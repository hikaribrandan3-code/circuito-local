-- V1 production hardening. This follows the initial rebuild without mutating
-- its history, and tightens tenant boundaries and checkout invariants.

-- A category slug is a public route segment, so it must be unique per store,
-- independently of its optional parent.
alter table public.categories drop constraint if exists categories_store_id_parent_id_slug_key;
drop index if exists public.categories_root_slug_unique;
alter table public.categories add constraint categories_store_slug_key unique (store_id, slug);

-- A retry must resolve to the same order rather than creating a duplicate.
alter table public.orders add column checkout_token uuid not null default gen_random_uuid();
alter table public.orders add constraint orders_checkout_token_key unique (checkout_token);

-- Move policy helpers out of the API-exposed schema. Existing policy
-- dependencies follow the function object when it moves schema.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;
alter function public.is_store_member(uuid) set schema private;
alter function public.is_store_owner(uuid) set schema private;
revoke all on function private.is_store_member(uuid) from public;
revoke all on function private.is_store_owner(uuid) from public;
grant execute on function private.is_store_member(uuid) to authenticated;
grant execute on function private.is_store_owner(uuid) to authenticated;

-- An authenticated merchant must only access stores they belong to. Published
-- storefront data remains anonymous-only; customers do not have accounts in V1.
drop policy if exists "public published stores" on public.stores;
drop policy if exists "public store settings" on public.store_settings;
drop policy if exists "public storefront config" on public.storefront_configs;
drop policy if exists "public visible categories" on public.categories;
drop policy if exists "public published products" on public.products;
drop policy if exists "public product images" on public.product_images;
drop policy if exists "public product options" on public.product_options;
drop policy if exists "public option values" on public.product_option_values;
drop policy if exists "public variants" on public.product_variants;
drop policy if exists "public variant values" on public.variant_option_values;

create policy "anonymous published stores" on public.stores for select to anon using (is_published);
create policy "members read stores" on public.stores for select to authenticated using (private.is_store_member(id));
create policy "anonymous store settings" on public.store_settings for select to anon using (exists (select 1 from public.stores s where s.id = store_id and s.is_published));
create policy "anonymous storefront config" on public.storefront_configs for select to anon using (exists (select 1 from public.stores s where s.id = store_id and s.is_published));
create policy "anonymous visible categories" on public.categories for select to anon using (is_visible and exists (select 1 from public.stores s where s.id = store_id and s.is_published));
create policy "anonymous published products" on public.products for select to anon using (status = 'published' and exists (select 1 from public.stores s where s.id = store_id and s.is_published));
create policy "anonymous product images" on public.product_images for select to anon using (exists (select 1 from public.products p join public.stores s on s.id = p.store_id where p.id = product_id and p.status = 'published' and s.is_published));
create policy "anonymous product options" on public.product_options for select to anon using (exists (select 1 from public.products p join public.stores s on s.id = p.store_id where p.id = product_id and p.status = 'published' and s.is_published));
create policy "anonymous option values" on public.product_option_values for select to anon using (exists (select 1 from public.product_options po join public.products p on p.id = po.product_id join public.stores s on s.id = p.store_id where po.id = option_id and p.status = 'published' and s.is_published));
create policy "anonymous variants" on public.product_variants for select to anon using (exists (select 1 from public.products p join public.stores s on s.id = p.store_id where p.id = product_id and p.status = 'published' and s.is_published));
create policy "anonymous variant values" on public.variant_option_values for select to anon using (exists (select 1 from public.product_variants pv join public.products p on p.id = pv.product_id join public.stores s on s.id = p.store_id where pv.id = variant_id and p.status = 'published' and s.is_published));

-- Fulfillment is an atomic server-side transition. A fulfilled order is final
-- in V1; if a sale is reversed, the merchant adjusts stock explicitly.
drop policy if exists "members cancel orders" on public.orders;
create policy "members update unfulfilled orders" on public.orders for update to authenticated using (private.is_store_member(store_id) and status <> 'fulfilled') with check (private.is_store_member(store_id) and status in ('pending', 'confirmed', 'cancelled'));

create or replace function public.validate_product_publication()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status <> 'published' then return new; end if;
  if exists (select 1 from public.product_options where product_id = new.id) then
    if not exists (select 1 from public.product_variants where product_id = new.id) then
      raise exception 'products with options require at least one variant before publishing';
    end if;
    if exists (
      select 1 from public.product_variants pv
      where pv.product_id = new.id
        and (select count(*) from public.variant_option_values vov where vov.variant_id = pv.id) <>
            (select count(*) from public.product_options po where po.product_id = new.id)
    ) then
      raise exception 'every published variant must choose one value per option';
    end if;
  elsif exists (select 1 from public.product_variants where product_id = new.id) then
    raise exception 'products without options cannot have variants';
  end if;
  return new;
end;
$$;
create trigger products_publication_check before insert or update of status on public.products for each row execute function public.validate_product_publication();

drop function if exists public.create_checkout_order(text, jsonb, text, text, text, text, text);
create or replace function public.create_checkout_order(
  p_store_slug text,
  p_items jsonb,
  p_customer_name text,
  p_customer_phone text,
  p_fulfillment_method text,
  p_delivery_address text default null,
  p_customer_note text default null,
  p_checkout_token uuid default null
)
returns table (order_id uuid, order_number bigint, total integer, whatsapp_number text)
language plpgsql security definer set search_path = public as $$
declare
  v_store public.stores;
  v_settings public.store_settings;
  v_customer_id uuid;
  v_order public.orders;
  v_item jsonb;
  v_product public.products;
  v_variant public.product_variants;
  v_quantity integer;
  v_unit_price integer;
  v_options jsonb;
  v_variant_label text;
  v_subtotal integer := 0;
  v_delivery_price integer := 0;
  v_phone text;
  v_product_id uuid;
  v_variant_id uuid;
begin
  if p_checkout_token is null then raise exception 'checkout token required'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then raise exception 'invalid order items'; end if;
  if char_length(trim(coalesce(p_customer_name, ''))) not between 1 and 120 then raise exception 'invalid customer name'; end if;
  v_phone := regexp_replace(trim(coalesce(p_customer_phone, '')), '[^0-9+]', '', 'g');
  if char_length(v_phone) not between 5 and 40 then raise exception 'invalid customer phone'; end if;
  if char_length(coalesce(p_delivery_address, '')) > 500 or char_length(coalesce(p_customer_note, '')) > 2000 then raise exception 'checkout text too long'; end if;
  if exists (
    select 1
    from (
      select coalesce(value ->> 'product_id', '') as product_id,
             coalesce(value ->> 'variant_id', '') as variant_id,
             count(*)
      from jsonb_array_elements(p_items)
      group by 1, 2
      having count(*) > 1
    ) duplicate_lines
  ) then raise exception 'duplicate item variants are not allowed'; end if;

  select * into v_store from public.stores where slug = lower(trim(p_store_slug)) and is_published;
  if not found then raise exception 'store not found'; end if;
  select * into v_settings from public.store_settings where store_id = v_store.id;

  -- Serializes retries for the same browser-generated token.
  perform pg_advisory_xact_lock(hashtextextended(p_checkout_token::text, 0));
  select * into v_order from public.orders where checkout_token = p_checkout_token;
  if found then
    if v_order.store_id <> v_store.id then raise exception 'checkout token conflict'; end if;
    return query select v_order.id, v_order.order_number, v_order.total, v_settings.whatsapp_number;
    return;
  end if;

  if p_fulfillment_method not in ('pickup', 'delivery') then raise exception 'invalid fulfillment method'; end if;
  if p_fulfillment_method = 'pickup' and not v_settings.pickup_enabled then raise exception 'pickup unavailable'; end if;
  if p_fulfillment_method = 'delivery' then
    if not v_settings.delivery_enabled then raise exception 'delivery unavailable'; end if;
    if char_length(trim(coalesce(p_delivery_address, ''))) < 5 then raise exception 'delivery address required'; end if;
    v_delivery_price := v_settings.delivery_price;
  end if;

  insert into public.customers (store_id, phone, name)
  values (v_store.id, v_phone, trim(p_customer_name))
  on conflict (store_id, phone) do update set name = excluded.name, updated_at = now()
  returning id into v_customer_id;

  insert into public.orders (store_id, customer_id, checkout_token, fulfillment_method, customer_name, customer_phone, delivery_address, customer_note, subtotal, delivery_price, total)
  values (v_store.id, v_customer_id, p_checkout_token, p_fulfillment_method, trim(p_customer_name), v_phone, nullif(trim(p_delivery_address), ''), nullif(trim(p_customer_note), ''), 0, v_delivery_price, v_delivery_price)
  returning * into v_order;

  for v_item in select value from jsonb_array_elements(p_items) loop
    if not ((v_item ->> 'product_id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') then raise exception 'invalid product'; end if;
    v_product_id := (v_item ->> 'product_id')::uuid;
    v_quantity := nullif(v_item ->> 'quantity', '')::integer;
    if v_quantity is null or v_quantity not between 1 and 99 then raise exception 'invalid quantity'; end if;
    select * into v_product from public.products where id = v_product_id and store_id = v_store.id and status = 'published' and availability = 'available';
    if not found then raise exception 'product unavailable'; end if;

    v_variant := null; v_options := '[]'::jsonb; v_variant_label := null;
    if nullif(v_item ->> 'variant_id', '') is not null then
      if not ((v_item ->> 'variant_id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') then raise exception 'invalid variant'; end if;
      v_variant_id := (v_item ->> 'variant_id')::uuid;
      select * into v_variant from public.product_variants where id = v_variant_id and product_id = v_product.id and availability = 'available';
      if not found then raise exception 'variant unavailable'; end if;
      select coalesce(jsonb_agg(jsonb_build_object('option', po.name, 'value', pov.value) order by po.display_order), '[]'::jsonb), string_agg(po.name || ': ' || pov.value, ' · ' order by po.display_order)
      into v_options, v_variant_label
      from public.variant_option_values vov join public.product_option_values pov on pov.id = vov.option_value_id join public.product_options po on po.id = pov.option_id where vov.variant_id = v_variant.id;
      if v_product.track_inventory and coalesce(v_variant.inventory_quantity, 0) < v_quantity then raise exception 'insufficient stock'; end if;
      v_unit_price := coalesce(v_variant.price, v_product.price);
    else
      if exists (select 1 from public.product_options where product_id = v_product.id) then raise exception 'variant selection required'; end if;
      if v_product.track_inventory and coalesce(v_product.inventory_quantity, 0) < v_quantity then raise exception 'insufficient stock'; end if;
      v_unit_price := v_product.price;
    end if;
    insert into public.order_items (order_id, product_id, variant_id, product_name, variant_label, selected_options, unit_price, quantity, line_total)
    values (v_order.id, v_product.id, v_variant.id, v_product.name, v_variant_label, v_options, v_unit_price, v_quantity, v_unit_price * v_quantity);
    v_subtotal := v_subtotal + v_unit_price * v_quantity;
  end loop;
  update public.orders set subtotal = v_subtotal, total = v_subtotal + v_delivery_price where id = v_order.id returning * into v_order;
  return query select v_order.id, v_order.order_number, v_order.total, v_settings.whatsapp_number;
end;
$$;
revoke all on function public.create_checkout_order(text, jsonb, text, text, text, text, text, uuid) from public;
grant execute on function public.create_checkout_order(text, jsonb, text, text, text, text, text, uuid) to anon, authenticated;

create or replace function public.mark_order_fulfilled(p_order_id uuid)
returns public.orders language plpgsql security definer set search_path = public as $$
declare v_order public.orders; v_line public.order_items; v_product public.products; v_stock integer;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'order not found'; end if;
  if not private.is_store_member(v_order.store_id) then raise exception 'not authorized'; end if;
  if v_order.status <> 'pending' then raise exception 'order is not pending'; end if;
  for v_line in select * from public.order_items where order_id = p_order_id loop
    select * into v_product from public.products where id = v_line.product_id;
    if not found then continue; end if;
    if v_product.track_inventory then
      if v_line.variant_id is null then
        select inventory_quantity into v_stock from public.products where id = v_product.id for update;
        if coalesce(v_stock, 0) < v_line.quantity then raise exception 'insufficient inventory for %', v_line.product_name; end if;
        update public.products set inventory_quantity = inventory_quantity - v_line.quantity, availability = case when inventory_quantity - v_line.quantity = 0 then 'sold_out' else availability end where id = v_product.id;
      else
        select inventory_quantity into v_stock from public.product_variants where id = v_line.variant_id for update;
        if coalesce(v_stock, 0) < v_line.quantity then raise exception 'insufficient inventory for %', v_line.product_name; end if;
        update public.product_variants set inventory_quantity = inventory_quantity - v_line.quantity, availability = case when inventory_quantity - v_line.quantity = 0 then 'sold_out' else availability end where id = v_line.variant_id;
      end if;
    end if;
  end loop;
  update public.orders set status = 'fulfilled' where id = p_order_id returning * into v_order;
  return v_order;
end;
$$;
revoke all on function public.mark_order_fulfilled(uuid) from public;
grant execute on function public.mark_order_fulfilled(uuid) to authenticated;
