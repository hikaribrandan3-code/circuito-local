import { useEffect, useState } from "react";
import { storefrontDb as supabase } from "@/lib/storefrontDb";
import { CATEGORIES, PRODUCTS, STORE, type Product } from "./products";

export function useStoreProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  useEffect(() => {
    const ownerId = import.meta.env.VITE_RE_STORE_OWNER_ID;
    if (!ownerId) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      controller.abort();
      setLoading(false);
    }, 6000);
    async function load() {
      try {
        const [items, cats, images] = await Promise.all([
          supabase.from("items").select("*").eq("user_id", ownerId).abortSignal(controller.signal),
          supabase
            .from("categories")
            .select("*")
            .eq("user_id", ownerId)
            .order("display_order")
            .abortSignal(controller.signal),
          supabase
            .from("item_images")
            .select("*")
            .order("display_order")
            .abortSignal(controller.signal),
        ]);
        if (controller.signal.aborted || items.error || !items.data?.length) return;
        const mapped = items.data.map((item): Product => {
          const categoryName =
            cats.data?.find((c) => c.id === item.category_id)?.name ?? "Colección";
          const allImages = (images.data ?? [])
            .filter((image) => image.item_id === item.id)
            .map((image) => image.image_url);
          if (!allImages.length && item.image_url) allImages.push(item.image_url);
          return {
            id: item.id,
            title: item.name,
            category: item.category_id ?? "general",
            categoryName,
            brand: STORE.name,
            price: Number(item.price),
            image: allImages[0] ?? "/images/gallery/img_1445.webp",
            allImages,
            description: item.description ?? "Descubrí esta prenda de nuestra colección.",
            specs: [],
          };
        });
        setProducts(mapped);
        if (cats.data?.length)
          setCategories(cats.data.map((c) => ({ id: c.id, label: c.name, description: "" })));
      } catch {
        /* Keep the local demo usable when the inventory is unavailable. */
      } finally {
        window.clearTimeout(timeout);
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);
  return { products, categories, loading, isDemo: products.every((product) => product.demo) };
}
