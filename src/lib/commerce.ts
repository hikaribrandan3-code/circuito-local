/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/integrations/supabase/client";

export type Store = {
  id: string;
  slug: string;
  name: string;
  template_key: "boutique" | "clothing" | "tech" | "general";
  is_published: boolean;
  settings: {
    whatsapp_number: string | null;
    instagram_url: string | null;
    city: string | null;
    address: string | null;
    logo_path: string | null;
    hero_path: string | null;
    hero_media_type: "image" | "video";
    pickup_enabled: boolean;
    delivery_enabled: boolean;
    delivery_price: number;
    delivery_notes: string | null;
  };
  config: Record<string, unknown>;
};

export type Category = {
  id: string;
  store_id: string;
  parent_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  image_path: string | null;
  display_order: number;
  is_visible: boolean;
};

export type OptionValue = { id: string; value: string; display_order: number };
export type ProductOption = {
  id: string;
  name: string;
  display_order: number;
  values: OptionValue[];
};
export type Variant = {
  id: string;
  choice_signature: string;
  sku: string | null;
  price: number | null;
  availability: "available" | "sold_out";
  inventory_quantity: number | null;
  option_value_ids: string[];
};

export type ProductImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  display_order: number;
};
export type Product = {
  id: string;
  store_id: string;
  category_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  status: "draft" | "published" | "archived";
  availability: "available" | "sold_out";
  track_inventory: boolean;
  inventory_quantity: number | null;
  images: ProductImage[];
  options: ProductOption[];
  variants: Variant[];
  category?: Pick<Category, "id" | "name" | "slug"> | null;
};

type CacheEntry<T> = { value: T; expires: number };
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_MS = 60_000;

function cached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  return entry && entry.expires > Date.now() ? entry.value : null;
}

function save<T>(key: string, value: T) {
  cache.set(key, { value, expires: Date.now() + CACHE_MS });
  return value;
}

export function clearStoreCache(storeSlug?: string) {
  if (!storeSlug) return cache.clear();
  for (const key of cache.keys()) if (key.includes(`:${storeSlug}`)) cache.delete(key);
}

export function mediaUrl(path: string | null | undefined, width?: number) {
  if (!path) return "";
  const options = width
    ? ({ transform: { width, quality: 82, format: "webp" } } as any)
    : undefined;
  return supabase.storage.from("store-media").getPublicUrl(path, options).data.publicUrl;
}

export function formatMoney(value: number, currency = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeProduct(row: any): Product {
  return {
    ...row,
    images: (row.product_images ?? []).sort(
      (a: ProductImage, b: ProductImage) => a.display_order - b.display_order,
    ),
    options: (row.product_options ?? [])
      .map((option: any) => ({
        ...option,
        values: (option.product_option_values ?? []).sort(
          (a: OptionValue, b: OptionValue) => a.display_order - b.display_order,
        ),
      }))
      .sort((a: ProductOption, b: ProductOption) => a.display_order - b.display_order),
    variants: (row.product_variants ?? []).map((variant: any) => ({
      ...variant,
      option_value_ids: (variant.variant_option_values ?? []).map(
        (value: any) => value.option_value_id,
      ),
    })),
    category: Array.isArray(row.categories) ? row.categories[0] : row.categories,
  };
}

export async function getStore(slug: string): Promise<Store | null> {
  const key = `store:${slug}`;
  const existing = cached<Store>(key);
  if (existing) return existing;
  const { data, error } = await supabase
    .from("stores")
    .select(
      "id,slug,name,template_key,is_published,store_settings(whatsapp_number,instagram_url,city,logo_path,hero_path,hero_media_type,pickup_enabled,delivery_enabled,delivery_price),storefront_configs(config)",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row: any = data;
  return save(key, {
    id: row.id,
    slug: row.slug,
    name: row.name,
    template_key: row.template_key,
    is_published: row.is_published,
    settings: Array.isArray(row.store_settings) ? row.store_settings[0] : row.store_settings,
    config:
      (Array.isArray(row.storefront_configs) ? row.storefront_configs[0] : row.storefront_configs)
        ?.config ?? {},
  });
}

const cardSelect =
  "id,store_id,category_id,slug,name,description,price,currency,status,availability,categories(id,name,slug),product_images(id,storage_path,alt_text,display_order)";
const detailSelect = `${cardSelect},product_options(id,name,display_order,product_option_values(id,value,display_order)),product_variants(id,choice_signature,sku,price,availability,inventory_quantity,variant_option_values(option_value_id))`;

export async function getCatalog(
  store: Store,
): Promise<{ categories: Category[]; products: Product[] }> {
  const key = `catalog:${store.slug}`;
  const existing = cached<{ categories: Category[]; products: Product[] }>(key);
  if (existing) return existing;
  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id,store_id,parent_id,slug,name,description,image_path,display_order,is_visible")
      .eq("store_id", store.id)
      .eq("is_visible", true)
      .order("display_order"),
    supabase
      .from("products")
      .select(cardSelect)
      .eq("store_id", store.id)
      .eq("status", "published")
      .order("created_at", { ascending: false }),
  ]);
  if (categoriesResult.error) throw categoriesResult.error;
  if (productsResult.error) throw productsResult.error;
  return save(key, {
    categories: (categoriesResult.data ?? []) as Category[],
    products: (productsResult.data ?? []).map(normalizeProduct),
  });
}

export async function getProduct(store: Store, productSlug: string): Promise<Product | null> {
  const key = `product:${store.slug}:${productSlug}`;
  const existing = cached<Product>(key);
  if (existing) return existing;
  const { data, error } = await supabase
    .from("products")
    .select(detailSelect)
    .eq("store_id", store.id)
    .eq("slug", productSlug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? save(key, normalizeProduct(data)) : null;
}

export function productImage(product: Product, width = 800) {
  return mediaUrl(product.images[0]?.storage_path, width) || "/images/regalos-special.png";
}

export function variantLabel(product: Product, variant: Variant | undefined) {
  if (!variant) return "";
  const values = new Set(variant.option_value_ids);
  return product.options
    .flatMap((option) =>
      option.values
        .filter((value) => values.has(value.id))
        .map((value) => `${option.name}: ${value.value}`),
    )
    .join(" · ");
}
