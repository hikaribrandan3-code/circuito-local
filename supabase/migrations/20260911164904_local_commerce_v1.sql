-- Circuito Local V1: clean, tenant-safe commerce foundation.
-- This intentionally replaces the prototype tables in this dedicated project.
-- It is self-contained so a fresh `supabase db reset` produces the same schema.

create extension if not exists pgcrypto;
create extension if not exists citext;

-- The prototype project is dedicated to this product. Retire its incompatible model.
-- These drops also make the rebuild safely rerunnable after a partially applied
-- SQL Editor execution.
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.customers cascade;
drop table if exists public.variant_option_values cascade;
drop table if exists public.product_variants cascade;
drop table if exists public.product_option_values cascade;
drop table if exists public.product_options cascade;
drop table if exists public.product_images cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;
drop table if exists public.storefront_configs cascade;
drop table if exists public.store_settings cascade;
drop table if exists public.store_members cascade;
drop table if exists public.stores cascade;
drop table if exists public.profiles cascade;

drop table if exists public.shop_customers cascade;
drop table if exists public.orders cascade;
drop table if exists public.delivery_settings cascade;
drop table if exists public.item_images cascade;
drop table if exists public.items cascade;
drop table if exists public.categories cascade;
drop table if exists public.gallery_posts cascade;
drop table if exists public.storefront_configs cascade;
drop table if exists public.store_settings cascade;
drop table if exists public.store_members cascade;
drop table if exists public.stores cascade;
drop table if exists public.profiles cascade;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_updated_at() cascade;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique check (slug::text ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 80),
  template_key text not null default 'boutique' check (template_key in ('boutique', 'clothing', 'tech', 'general')),
  is_published boolean not null default false,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.store_members (
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'manager' check (role in ('owner', 'manager')),
  created_at timestamptz not null default now(),
  primary key (store_id, user_id)
);

create table public.store_settings (
  store_id uuid primary key references public.stores(id) on delete cascade,
  whatsapp_number text,
  instagram_url text,
  city text,
  address text,
  logo_path text,
  hero_path text,
  hero_media_type text not null default 'image' check (hero_media_type in ('image', 'video')),
  pickup_enabled boolean not null default true,
  delivery_enabled boolean not null default false,
  delivery_price integer not null default 0 check (delivery_price >= 0),
  delivery_notes text,
  updated_at timestamptz not null default now()
);

create table public.storefront_configs (
  store_id uuid primary key references public.stores(id) on delete cascade,
  config jsonb not null default '{}'::jsonb check (jsonb_typeof(config) = 'object'),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  parent_id uuid references public.categories(id) on delete restrict,
  slug citext not null,
  name text not null check (char_length(name) between 1 and 80),
  description text,
  image_path text,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, parent_id, slug)
);
create unique index categories_root_slug_unique on public.categories (store_id, slug) where parent_id is null;
create index categories_store_parent_order_idx on public.categories (store_id, parent_id, display_order);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  slug citext not null,
  name text not null check (char_length(name) between 1 and 160),
  description text,
  price integer not null check (price >= 0),
  currency char(3) not null default 'ARS',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  availability text not null default 'available' check (availability in ('available', 'sold_out')),
  track_inventory boolean not null default false,
  inventory_quantity integer check (inventory_quantity is null or inventory_quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, slug)
);
create index products_store_status_category_idx on public.products (store_id, status, category_id, created_at desc);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, display_order)
);
create index product_images_product_order_idx on public.product_images (product_id, display_order);

create table public.product_options (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 50),
  display_order integer not null default 0,
  unique (product_id, name),
  unique (product_id, display_order)
);

create table public.product_option_values (
  id uuid primary key default gen_random_uuid(),
  option_id uuid not null references public.product_options(id) on delete cascade,
  value text not null check (char_length(value) between 1 and 80),
  display_order integer not null default 0,
  unique (option_id, value),
  unique (option_id, display_order)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  choice_signature text not null,
  sku text,
  price integer check (price is null or price >= 0),
  availability text not null default 'available' check (availability in ('available', 'sold_out')),
  inventory_quantity integer check (inventory_quantity is null or inventory_quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, choice_signature)
);
create index product_variants_product_idx on public.product_variants (product_id);

create table public.variant_option_values (
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  option_value_id uuid not null references public.product_option_values(id) on delete restrict,
  primary key (variant_id, option_value_id)
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  phone text not null,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, phone)
);
create index customers_store_name_idx on public.customers (store_id, name);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete restrict,
  customer_id uuid references public.customers(id) on delete set null,
  order_number bigint generated always as identity unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'fulfilled', 'cancelled')),
  fulfillment_method text not null check (fulfillment_method in ('pickup', 'delivery')),
  customer_name text not null,
  customer_phone text not null,
  delivery_address text,
  customer_note text,
  subtotal integer not null check (subtotal >= 0),
  delivery_price integer not null default 0 check (delivery_price >= 0),
  total integer not null check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_store_created_idx on public.orders (store_id, created_at desc);
create index orders_store_status_idx on public.orders (store_id, status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_label text,
  selected_options jsonb not null default '[]'::jsonb check (jsonb_typeof(selected_options) = 'array'),
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity between 1 and 99),
  line_total integer not null check (line_total >= 0)
);
create index order_items_order_idx on public.order_items (order_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
create trigger stores_updated before update on public.stores for each row execute function public.set_updated_at();
create trigger categories_updated before update on public.categories for each row execute function public.set_updated_at();
create trigger products_updated before update on public.products for each row execute function public.set_updated_at();
create trigger variants_updated before update on public.product_variants for each row execute function public.set_updated_at();
create trigger customers_updated before update on public.customers for each row execute function public.set_updated_at();
create trigger orders_updated before update on public.orders for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Helpers are SECURITY DEFINER solely to avoid recursive RLS policies. They expose
-- no store data and require an authenticated caller.
create or replace function public.is_store_member(p_store_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.store_members
    where store_id = p_store_id and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_store_owner(p_store_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.store_members
    where store_id = p_store_id and user_id = (select auth.uid()) and role = 'owner'
  );
$$;

create or replace function public.create_store(p_name text, p_slug text, p_template_key text default 'boutique')
returns public.stores language plpgsql security definer set search_path = public as $$
declare
  v_store public.stores;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  insert into public.profiles (id) values (auth.uid()) on conflict do nothing;
  insert into public.stores (name, slug, template_key, created_by)
  values (trim(p_name), lower(trim(p_slug)), p_template_key, auth.uid())
  returning * into v_store;
  insert into public.store_members (store_id, user_id, role) values (v_store.id, auth.uid(), 'owner');
  insert into public.store_settings (store_id) values (v_store.id);
  insert into public.storefront_configs (store_id) values (v_store.id);
  return v_store;
end;
$$;

create or replace function public.create_checkout_order(
  p_store_slug text,
  p_items jsonb,
  p_customer_name text,
  p_customer_phone text,
  p_fulfillment_method text,
  p_delivery_address text default null,
  p_customer_note text default null
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
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'invalid order items';
  end if;
  if char_length(trim(coalesce(p_customer_name, ''))) not between 1 and 120 then raise exception 'invalid customer name'; end if;
  if char_length(trim(coalesce(p_customer_phone, ''))) not between 5 and 40 then raise exception 'invalid customer phone'; end if;

  select * into v_store from public.stores where slug = lower(trim(p_store_slug)) and is_published;
  if not found then raise exception 'store not found'; end if;
  select * into v_settings from public.store_settings where store_id = v_store.id;

  if p_fulfillment_method not in ('pickup', 'delivery') then raise exception 'invalid fulfillment method'; end if;
  if p_fulfillment_method = 'pickup' and not v_settings.pickup_enabled then raise exception 'pickup unavailable'; end if;
  if p_fulfillment_method = 'delivery' then
    if not v_settings.delivery_enabled then raise exception 'delivery unavailable'; end if;
    if char_length(trim(coalesce(p_delivery_address, ''))) < 5 then raise exception 'delivery address required'; end if;
    v_delivery_price := v_settings.delivery_price;
  end if;

  insert into public.customers (store_id, phone, name)
  values (v_store.id, trim(p_customer_phone), trim(p_customer_name))
  on conflict (store_id, phone) do update set name = excluded.name, updated_at = now()
  returning id into v_customer_id;

  insert into public.orders (
    store_id, customer_id, fulfillment_method, customer_name, customer_phone,
    delivery_address, customer_note, subtotal, delivery_price, total
  ) values (
    v_store.id, v_customer_id, p_fulfillment_method, trim(p_customer_name), trim(p_customer_phone),
    nullif(trim(p_delivery_address), ''), nullif(trim(p_customer_note), ''), 0, v_delivery_price, v_delivery_price
  ) returning * into v_order;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := nullif(v_item ->> 'quantity', '')::integer;
    if v_quantity is null or v_quantity not between 1 and 99 then raise exception 'invalid quantity'; end if;
    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::uuid and store_id = v_store.id
        and status = 'published' and availability = 'available';
    if not found then raise exception 'product unavailable'; end if;

    v_variant := null;
    v_options := '[]'::jsonb;
    v_variant_label := null;
    if nullif(v_item ->> 'variant_id', '') is not null then
      select * into v_variant from public.product_variants
        where id = (v_item ->> 'variant_id')::uuid and product_id = v_product.id and availability = 'available';
      if not found then raise exception 'variant unavailable'; end if;
      select coalesce(jsonb_agg(jsonb_build_object('option', po.name, 'value', pov.value) order by po.display_order), '[]'::jsonb),
             string_agg(po.name || ': ' || pov.value, ' · ' order by po.display_order)
        into v_options, v_variant_label
        from public.variant_option_values vov
        join public.product_option_values pov on pov.id = vov.option_value_id
        join public.product_options po on po.id = pov.option_id
       where vov.variant_id = v_variant.id;
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

  update public.orders set subtotal = v_subtotal, total = v_subtotal + v_delivery_price where id = v_order.id
  returning * into v_order;
  return query select v_order.id, v_order.order_number, v_order.total, v_settings.whatsapp_number;
end;
$$;

create or replace function public.mark_order_fulfilled(p_order_id uuid)
returns public.orders language plpgsql security definer set search_path = public as $$
declare
  v_order public.orders;
  v_line public.order_items;
  v_product public.products;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'order not found'; end if;
  if not public.is_store_member(v_order.store_id) then raise exception 'not authorized'; end if;
  if v_order.status <> 'pending' then raise exception 'order is not pending'; end if;
  for v_line in select * from public.order_items where order_id = p_order_id loop
    select * into v_product from public.products where id = v_line.product_id for update;
    if v_product.track_inventory then
      if v_line.variant_id is null then
        update public.products set inventory_quantity = greatest(0, coalesce(inventory_quantity, 0) - v_line.quantity),
          availability = case when greatest(0, coalesce(inventory_quantity, 0) - v_line.quantity) = 0 then 'sold_out' else availability end
          where id = v_product.id;
      else
        update public.product_variants set inventory_quantity = greatest(0, coalesce(inventory_quantity, 0) - v_line.quantity),
          availability = case when greatest(0, coalesce(inventory_quantity, 0) - v_line.quantity) = 0 then 'sold_out' else availability end
          where id = v_line.variant_id;
      end if;
    end if;
  end loop;
  update public.orders set status = 'fulfilled' where id = p_order_id returning * into v_order;
  return v_order;
end;
$$;

-- Keep parents within the same tenant and only one category level deep.
create or replace function public.validate_category_parent()
returns trigger language plpgsql set search_path = public as $$
declare v_parent_store uuid; v_grandparent uuid;
begin
  if new.parent_id is null then return new; end if;
  select store_id, parent_id into v_parent_store, v_grandparent from public.categories where id = new.parent_id;
  if v_parent_store is null or v_parent_store <> new.store_id then raise exception 'category parent must belong to the same store'; end if;
  if v_grandparent is not null then raise exception 'only one subcategory level is supported'; end if;
  return new;
end;
$$;
create trigger categories_parent_check before insert or update of parent_id, store_id on public.categories for each row execute function public.validate_category_parent();

create or replace function public.validate_product_relations()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_store uuid;
begin
  if new.category_id is not null then
    select store_id into v_store from public.categories where id = new.category_id;
    if v_store is null or v_store <> new.store_id then raise exception 'product category must belong to the same store'; end if;
  end if;
  return new;
end;
$$;
create trigger products_relations_check before insert or update of category_id, store_id on public.products for each row execute function public.validate_product_relations();

create or replace function public.validate_product_image_store()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_store uuid;
begin
  select store_id into v_store from public.products where id = new.product_id;
  if v_store is null or v_store <> new.store_id then raise exception 'image product must belong to the same store'; end if;
  return new;
end;
$$;
create trigger product_images_store_check before insert or update of product_id, store_id on public.product_images for each row execute function public.validate_product_image_store();

create or replace function public.validate_variant_option_value()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_variant_product uuid; v_value_product uuid;
begin
  select product_id into v_variant_product from public.product_variants where id = new.variant_id;
  select po.product_id into v_value_product from public.product_option_values pov join public.product_options po on po.id = pov.option_id where pov.id = new.option_value_id;
  if v_variant_product is null or v_variant_product <> v_value_product then raise exception 'variant values must belong to the variant product'; end if;
  return new;
end;
$$;
create trigger variant_values_product_check before insert or update on public.variant_option_values for each row execute function public.validate_variant_option_value();

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.store_members enable row level security;
alter table public.store_settings enable row level security;
alter table public.storefront_configs enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_options enable row level security;
alter table public.product_option_values enable row level security;
alter table public.product_variants enable row level security;
alter table public.variant_option_values enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Private identity and operational data.
create policy "profiles self" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "members see own memberships" on public.store_members for select to authenticated using (user_id = (select auth.uid()));
create policy "members see colleagues" on public.store_members for select to authenticated using (public.is_store_member(store_id));
create policy "owners manage memberships" on public.store_members for all to authenticated using (public.is_store_owner(store_id)) with check (public.is_store_owner(store_id));

-- Storefront data: public only when the store and record are visible/published.
create policy "public published stores" on public.stores for select to anon, authenticated using (is_published or public.is_store_member(id));
create policy "members manage stores" on public.stores for update to authenticated using (public.is_store_member(id)) with check (public.is_store_member(id));
create policy "public store settings" on public.store_settings for select to anon, authenticated using (exists (select 1 from public.stores s where s.id = store_id and s.is_published) or public.is_store_member(store_id));
create policy "members manage settings" on public.store_settings for all to authenticated using (public.is_store_member(store_id)) with check (public.is_store_member(store_id));
create policy "public storefront config" on public.storefront_configs for select to anon, authenticated using (exists (select 1 from public.stores s where s.id = store_id and s.is_published) or public.is_store_member(store_id));
create policy "members manage storefront config" on public.storefront_configs for all to authenticated using (public.is_store_member(store_id)) with check (public.is_store_member(store_id));
create policy "public visible categories" on public.categories for select to anon, authenticated using ((is_visible and exists (select 1 from public.stores s where s.id = store_id and s.is_published)) or public.is_store_member(store_id));
create policy "members manage categories" on public.categories for all to authenticated using (public.is_store_member(store_id)) with check (public.is_store_member(store_id));
create policy "public published products" on public.products for select to anon, authenticated using ((status = 'published' and exists (select 1 from public.stores s where s.id = store_id and s.is_published)) or public.is_store_member(store_id));
create policy "members manage products" on public.products for all to authenticated using (public.is_store_member(store_id)) with check (public.is_store_member(store_id));
create policy "public product images" on public.product_images for select to anon, authenticated using (exists (select 1 from public.products p join public.stores s on s.id = p.store_id where p.id = product_id and p.status = 'published' and s.is_published) or public.is_store_member(store_id));
create policy "members manage images" on public.product_images for all to authenticated using (public.is_store_member(store_id)) with check (public.is_store_member(store_id));
create policy "public product options" on public.product_options for select to anon, authenticated using (exists (select 1 from public.products p join public.stores s on s.id = p.store_id where p.id = product_id and p.status = 'published' and s.is_published) or exists (select 1 from public.products p where p.id = product_id and public.is_store_member(p.store_id)));
create policy "members manage product options" on public.product_options for all to authenticated using (exists (select 1 from public.products p where p.id = product_id and public.is_store_member(p.store_id))) with check (exists (select 1 from public.products p where p.id = product_id and public.is_store_member(p.store_id)));
create policy "public option values" on public.product_option_values for select to anon, authenticated using (exists (select 1 from public.product_options po join public.products p on p.id = po.product_id join public.stores s on s.id = p.store_id where po.id = option_id and p.status = 'published' and s.is_published) or exists (select 1 from public.product_options po join public.products p on p.id = po.product_id where po.id = option_id and public.is_store_member(p.store_id)));
create policy "members manage option values" on public.product_option_values for all to authenticated using (exists (select 1 from public.product_options po join public.products p on p.id = po.product_id where po.id = option_id and public.is_store_member(p.store_id))) with check (exists (select 1 from public.product_options po join public.products p on p.id = po.product_id where po.id = option_id and public.is_store_member(p.store_id)));
create policy "public variants" on public.product_variants for select to anon, authenticated using (exists (select 1 from public.products p join public.stores s on s.id = p.store_id where p.id = product_id and p.status = 'published' and s.is_published) or exists (select 1 from public.products p where p.id = product_id and public.is_store_member(p.store_id)));
create policy "members manage variants" on public.product_variants for all to authenticated using (exists (select 1 from public.products p where p.id = product_id and public.is_store_member(p.store_id))) with check (exists (select 1 from public.products p where p.id = product_id and public.is_store_member(p.store_id)));
create policy "public variant values" on public.variant_option_values for select to anon, authenticated using (exists (select 1 from public.product_variants pv join public.products p on p.id = pv.product_id join public.stores s on s.id = p.store_id where pv.id = variant_id and p.status = 'published' and s.is_published) or exists (select 1 from public.product_variants pv join public.products p on p.id = pv.product_id where pv.id = variant_id and public.is_store_member(p.store_id)));
create policy "members manage variant values" on public.variant_option_values for all to authenticated using (exists (select 1 from public.product_variants pv join public.products p on p.id = pv.product_id where pv.id = variant_id and public.is_store_member(p.store_id))) with check (exists (select 1 from public.product_variants pv join public.products p on p.id = pv.product_id where pv.id = variant_id and public.is_store_member(p.store_id)));
create policy "members read customers" on public.customers for select to authenticated using (public.is_store_member(store_id));
create policy "members read orders" on public.orders for select to authenticated using (public.is_store_member(store_id));
create policy "members cancel orders" on public.orders for update to authenticated using (public.is_store_member(store_id)) with check (public.is_store_member(store_id) and status in ('pending', 'confirmed', 'cancelled'));
create policy "members read order items" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and public.is_store_member(o.store_id)));

grant usage on schema public to anon, authenticated;
grant select on public.stores, public.store_settings, public.storefront_configs, public.categories, public.products, public.product_images, public.product_options, public.product_option_values, public.product_variants, public.variant_option_values to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.store_members, public.store_settings, public.storefront_configs, public.categories, public.products, public.product_images, public.product_options, public.product_option_values, public.product_variants, public.variant_option_values, public.customers, public.orders, public.order_items to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant usage on all sequences in schema public to service_role;

revoke all on function public.handle_new_user() from public;
revoke all on function public.is_store_member(uuid) from public;
revoke all on function public.is_store_owner(uuid) from public;
revoke all on function public.create_store(text, text, text) from public;
revoke all on function public.create_checkout_order(text, jsonb, text, text, text, text, text) from public;
revoke all on function public.mark_order_fulfilled(uuid) from public;
grant execute on function public.is_store_member(uuid) to anon, authenticated;
grant execute on function public.is_store_owner(uuid), public.create_store(text, text, text), public.mark_order_fulfilled(uuid) to authenticated;
grant execute on function public.create_checkout_order(text, jsonb, text, text, text, text, text) to anon, authenticated;

-- Dedicated public media bucket. Database rows store only paths, never arbitrary URLs.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('store-media', 'store-media', true, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "store members upload media" on storage.objects;
drop policy if exists "store members update media" on storage.objects;
drop policy if exists "store members delete media" on storage.objects;
create policy "store members upload media" on storage.objects for insert to authenticated with check (
  bucket_id = 'store-media' and (storage.foldername(name))[1] = 'stores' and public.is_store_member(((storage.foldername(name))[2])::uuid)
);
create policy "store members update media" on storage.objects for update to authenticated using (
  bucket_id = 'store-media' and (storage.foldername(name))[1] = 'stores' and public.is_store_member(((storage.foldername(name))[2])::uuid)
) with check (
  bucket_id = 'store-media' and (storage.foldername(name))[1] = 'stores' and public.is_store_member(((storage.foldername(name))[2])::uuid)
);
create policy "store members delete media" on storage.objects for delete to authenticated using (
  bucket_id = 'store-media' and (storage.foldername(name))[1] = 'stores' and public.is_store_member(((storage.foldername(name))[2])::uuid)
);
