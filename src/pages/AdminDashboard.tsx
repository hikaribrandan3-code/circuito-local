/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  clearStoreCache,
  formatMoney,
  type Category,
  type Product,
  type Store,
} from "@/lib/commerce";
import { compressImage } from "@/lib/imageCompress";

type Tab = "store" | "products" | "orders" | "customers";
const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [tab, setTab] = useState<Tab>("store");
  const [loading, setLoading] = useState(true);
  async function load() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return navigate("/admin/login", { replace: true });
    setUser(auth.user);
    const { data, error } = await supabase
      .from("store_members")
      .select(
        "role,stores(id,slug,name,template_key,is_published,store_settings(whatsapp_number,instagram_url,city,address,logo_path,hero_path,hero_media_type,pickup_enabled,delivery_enabled,delivery_price,delivery_notes),storefront_configs(config))",
      )
      .eq("user_id", auth.user.id)
      .limit(1)
      .maybeSingle();
    if (error) toast.error(error.message);
    const row: any = data?.stores;
    if (row)
      setStore({
        ...row,
        settings: Array.isArray(row.store_settings) ? row.store_settings[0] : row.store_settings,
        config:
          (Array.isArray(row.storefront_configs)
            ? row.storefront_configs[0]
            : row.storefront_configs
          )?.config ?? {},
      });
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);
  if (loading)
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">Cargando…</div>
    );
  if (!store) return <Onboarding onCreated={load} />;
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl flex items-center gap-4 px-4 py-4">
          <div>
            <p className="font-display text-xl">{store.name}</p>
            <a
              className="text-xs text-muted-foreground underline"
              target="_blank"
              rel="noreferrer"
              href={`/${store.slug}`}
            >
              Ver tienda
            </a>
          </div>
          <button
            className="ml-auto text-sm underline"
            onClick={() => supabase.auth.signOut().then(() => navigate("/admin/login"))}
          >
            Salir
          </button>
        </div>
      </header>
      <nav className="mx-auto max-w-6xl flex gap-2 overflow-x-auto px-4 py-4">
        {(
          [
            ["store", "Tienda"],
            ["products", "Productos"],
            ["orders", "Pedidos"],
            ["customers", "Clientes"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm ${tab === id ? "bg-foreground text-background" : "border"}`}
          >
            {label}
          </button>
        ))}
      </nav>
      <main className="mx-auto max-w-6xl px-4 pb-12">
        {tab === "store" && <StoreTab store={store} onSaved={load} />}
        {tab === "products" && <ProductsTab store={store} />}
        {tab === "orders" && <OrdersTab store={store} />}
        {tab === "customers" && <CustomersTab store={store} />}
      </main>
    </div>
  );
}

function Onboarding({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    const { error } = await supabase.rpc("create_store", {
      p_name: name,
      p_slug: slugify(slug || name),
      p_template_key: "boutique",
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Tu tienda está lista");
    onCreated();
  }
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border bg-card p-7">
        <h1 className="font-display text-3xl">Creá tu tienda</h1>
        <p className="mt-2 text-sm text-muted-foreground">Podés cambiar su información después.</p>
        <input
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slug) setSlug(slugify(e.target.value));
          }}
          placeholder="Nombre de tu tienda"
          className="mt-6 w-full rounded-xl border p-3"
        />
        <input
          required
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="mi-tienda"
          className="mt-3 w-full rounded-xl border p-3"
        />
        <p className="mt-2 text-xs text-muted-foreground">Tu link: /{slug || "mi-tienda"}</p>
        <button
          disabled={saving}
          className="mt-6 w-full rounded-full bg-foreground py-3 text-background"
        >
          {saving ? "Creando…" : "Crear tienda"}
        </button>
      </form>
    </div>
  );
}

function StoreTab({ store, onSaved }: { store: Store; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: store.name,
    whatsapp_number: store.settings.whatsapp_number ?? "",
    instagram_url: store.settings.instagram_url ?? "",
    city: store.settings.city ?? "",
    address: store.settings.address ?? "",
    pickup_enabled: store.settings.pickup_enabled,
    delivery_enabled: store.settings.delivery_enabled,
    delivery_price: store.settings.delivery_price,
  });
  async function submit(event: FormEvent) {
    event.preventDefault();
    const [storeResult, settingsResult] = await Promise.all([
      supabase.from("stores").update({ name: form.name }).eq("id", store.id),
      supabase
        .from("store_settings")
        .update({
          ...form,
          whatsapp_number: form.whatsapp_number || null,
          instagram_url: form.instagram_url || null,
        })
        .eq("store_id", store.id),
    ]);
    if (storeResult.error || settingsResult.error)
      return toast.error(storeResult.error?.message ?? settingsResult.error?.message ?? "Error");
    clearStoreCache(store.slug);
    toast.success("Tienda actualizada");
    onSaved();
  }
  async function uploadLogo(file?: File) {
    if (!file) return;
    const compressed = await compressImage(file);
    const path = `stores/${store.id}/branding/logo-${Date.now()}.webp`;
    const { error } = await supabase.storage.from("store-media").upload(path, compressed);
    if (error) return toast.error(error.message);
    const result = await supabase
      .from("store_settings")
      .update({ logo_path: path })
      .eq("store_id", store.id);
    if (result.error) return toast.error(result.error.message);
    clearStoreCache(store.slug);
    onSaved();
  }
  return (
    <form onSubmit={submit} className="max-w-xl space-y-4 rounded-3xl border bg-card p-6">
      <h1 className="font-display text-3xl">Tienda</h1>
      <label className="block text-sm">
        Nombre
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-xl border p-2"
        />
      </label>
      <label className="block text-sm">
        Logo
        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadLogo(e.target.files?.[0])}
          className="mt-1 block text-sm"
        />
      </label>
      <label className="block text-sm">
        WhatsApp
        <input
          value={form.whatsapp_number}
          onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
          className="mt-1 w-full rounded-xl border p-2"
        />
      </label>
      <label className="block text-sm">
        Instagram
        <input
          value={form.instagram_url}
          onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
          className="mt-1 w-full rounded-xl border p-2"
        />
      </label>
      <label className="block text-sm">
        Ciudad
        <input
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="mt-1 w-full rounded-xl border p-2"
        />
      </label>
      <label className="block text-sm">
        Dirección / punto de retiro
        <input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="mt-1 w-full rounded-xl border p-2"
        />
      </label>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.pickup_enabled}
          onChange={(e) => setForm({ ...form, pickup_enabled: e.target.checked })}
        />
        Permitir retiro
      </label>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.delivery_enabled}
          onChange={(e) => setForm({ ...form, delivery_enabled: e.target.checked })}
        />
        Permitir envío local
      </label>
      {form.delivery_enabled && (
        <label className="block text-sm">
          Costo de envío
          <input
            type="number"
            min="0"
            value={form.delivery_price}
            onChange={(e) => setForm({ ...form, delivery_price: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border p-2"
          />
        </label>
      )}
      <button className="w-full rounded-full bg-foreground py-3 text-background">
        Guardar cambios
      </button>
    </form>
  );
}

function ProductsTab({ store }: { store: Store }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [publishing, setPublishing] = useState(false);
  const load = async () => {
    const [c, p] = await Promise.all([
      supabase
        .from("categories")
        .select("id,store_id,parent_id,slug,name,description,image_path,display_order,is_visible")
        .eq("store_id", store.id)
        .order("display_order"),
      supabase
        .from("products")
        .select("id,name,slug,price,status,availability,product_images(storage_path)")
        .eq("store_id", store.id)
        .neq("status", "archived")
        .order("created_at", { ascending: false }),
    ]);
    setCategories((c.data ?? []) as Category[]);
    setProducts((p.data ?? []) as any);
  };
  useEffect(() => {
    load();
  }, [store.id]);
  async function addCategory() {
    const title = prompt("Nombre de categoría");
    if (!title) return;
    const { error } = await supabase.from("categories").insert({
      store_id: store.id,
      name: title,
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      display_order: categories.length,
    });
    if (error) toast.error(error.message);
    else load();
  }
  async function create(event: FormEvent) {
    event.preventDefault();
    setPublishing(true);
    try {
      const slug = `${slugify(name)}-${Date.now().toString(36)}`;
      const { data: product, error } = await supabase
        .from("products")
        .insert({
          store_id: store.id,
          category_id: categoryId || null,
          slug,
          name,
          description: description || null,
          price,
          status: "published",
          availability: "available",
        })
        .select("id")
        .single();
      if (error) throw error;
      const parsed = options
        .split("\n")
        .map((line) => line.split(":"))
        .filter((pair) => pair.length === 2)
        .map(([option, values]) => ({
          name: option.trim(),
          values: values
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        }));
      const optionRows: { id: string; values: string[] }[] = [];
      for (let index = 0; index < parsed.length; index++) {
        const option = parsed[index];
        const { data, error: optionError } = await supabase
          .from("product_options")
          .insert({ product_id: product.id, name: option.name, display_order: index })
          .select("id")
          .single();
        if (optionError) throw optionError;
        optionRows.push({ id: data.id, values: option.values });
      }
      const valuesByOption: string[][] = [];
      for (const option of optionRows) {
        const values = [];
        for (let index = 0; index < option.values.length; index++) {
          const { data, error: valueError } = await supabase
            .from("product_option_values")
            .insert({ option_id: option.id, value: option.values[index], display_order: index })
            .select("id")
            .single();
          if (valueError) throw valueError;
          values.push(data.id);
        }
        valuesByOption.push(values);
      }
      if (valuesByOption.length) {
        const combinations = valuesByOption.reduce<string[][]>(
          (all, values) => all.flatMap((entry) => values.map((value) => [...entry, value])),
          [[]],
        );
        for (const combination of combinations) {
          const { data: variant, error: variantError } = await supabase
            .from("product_variants")
            .insert({ product_id: product.id, choice_signature: [...combination].sort().join("|") })
            .select("id")
            .single();
          if (variantError) throw variantError;
          const { error: joinError } = await supabase
            .from("variant_option_values")
            .insert(
              combination.map((option_value_id) => ({ variant_id: variant.id, option_value_id })),
            );
          if (joinError) throw joinError;
        }
      }
      for (const [index, file] of Array.from(files ?? []).entries()) {
        const compressed = await compressImage(file);
        const path = `stores/${store.id}/products/${product.id}/${index}-${Date.now()}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("store-media")
          .upload(path, compressed);
        if (uploadError) throw uploadError;
        const { error: imageError } = await supabase.from("product_images").insert({
          store_id: store.id,
          product_id: product.id,
          storage_path: path,
          display_order: index,
        });
        if (imageError) throw imageError;
      }
      clearStoreCache(store.slug);
      toast.success("Producto publicado");
      setName("");
      setPrice(0);
      setDescription("");
      setOptions("");
      setFiles(null);
      load();
    } catch (error: any) {
      toast.error(error.message ?? "No pudimos crear el producto");
    } finally {
      setPublishing(false);
    }
  }
  async function archive(id: string) {
    const { error } = await supabase.from("products").update({ status: "archived" }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      clearStoreCache(store.slug);
      load();
    }
  }
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl">Productos</h1>
          <button onClick={addCategory} className="text-sm underline">
            Nueva categoría
          </button>
        </div>
        <div className="mt-5 space-y-2">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3"
            >
              <img
                src={
                  product.product_images?.[0]?.storage_path
                    ? supabase.storage
                        .from("store-media")
                        .getPublicUrl(product.product_images[0].storage_path).data.publicUrl
                    : "/images/regalos-special.png"
                }
                alt=""
                className="h-14 w-14 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatMoney(product.price)} · {product.status}
                </p>
              </div>
              <button className="text-sm text-destructive" onClick={() => archive(product.id)}>
                Archivar
              </button>
            </div>
          ))}
        </div>
      </section>
      <form onSubmit={create} className="h-fit space-y-3 rounded-3xl border bg-card p-5">
        <h2 className="font-display text-2xl">Nuevo producto</h2>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          className="w-full rounded-xl border p-2"
        />
        <input
          required
          min="0"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Precio"
          className="w-full rounded-xl border p-2"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl border p-2"
        >
          <option value="">Sin categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
          className="min-h-24 w-full rounded-xl border p-2"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          className="block w-full text-sm"
        />
        <textarea
          value={options}
          onChange={(e) => setOptions(e.target.value)}
          placeholder={"Opciones (una por línea)\nTalle: S, M, L\nColor: Negro, Blanco"}
          className="min-h-24 w-full rounded-xl border p-2 text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Las combinaciones se generan automáticamente. Si no necesitás variantes, dejalo vacío.
        </p>
        <button
          disabled={publishing}
          className="w-full rounded-full bg-foreground py-3 text-background"
        >
          {publishing ? "Publicando…" : "Publicar producto"}
        </button>
      </form>
    </div>
  );
}

function OrdersTab({ store }: { store: Store }) {
  const [orders, setOrders] = useState<any[]>([]);
  const load = () =>
    supabase
      .from("orders")
      .select(
        "id,order_number,status,customer_name,customer_phone,total,fulfillment_method,delivery_address,created_at,order_items(product_name,variant_label,quantity,unit_price)",
      )
      .eq("store_id", store.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        setOrders(data ?? []);
      });
  useEffect(() => {
    load();
  }, [store.id]);
  async function fulfill(id: string) {
    const { error } = await supabase.rpc("mark_order_fulfilled", { p_order_id: id });
    if (error) toast.error(error.message);
    else load();
  }
  return (
    <div>
      <h1 className="font-display text-3xl">Pedidos</h1>
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border bg-card p-4">
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-medium">
                  #{order.order_number} · {order.customer_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.customer_phone} · {order.fulfillment_method}
                </p>
              </div>
              <p className="font-semibold">{formatMoney(order.total)}</p>
            </div>
            <ul className="mt-3 text-sm">
              {order.order_items.map((item: any) => (
                <li key={`${item.product_name}-${item.variant_label}`}>
                  {item.product_name}
                  {item.variant_label ? ` · ${item.variant_label}` : ""} ×{item.quantity}
                </li>
              ))}
            </ul>
            {order.status === "pending" && (
              <button
                onClick={() => fulfill(order.id)}
                className="mt-4 rounded-full bg-foreground px-4 py-2 text-sm text-background"
              >
                Marcar vendido
              </button>
            )}
            <p className="mt-2 text-xs text-muted-foreground">{order.status}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function CustomersTab({ store }: { store: Store }) {
  const [customers, setCustomers] = useState<any[]>([]);
  useEffect(() => {
    supabase
      .from("customers")
      .select("id,name,phone,created_at")
      .eq("store_id", store.id)
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        setCustomers(data ?? []);
      });
  }, [store.id]);
  return (
    <div>
      <h1 className="font-display text-3xl">Clientes</h1>
      <div className="mt-5 space-y-2">
        {customers.map((customer) => (
          <a
            key={customer.id}
            className="flex items-center justify-between rounded-2xl border bg-card p-4"
            href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            <span>{customer.name || "Sin nombre"}</span>
            <span className="text-sm text-muted-foreground">{customer.phone}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
