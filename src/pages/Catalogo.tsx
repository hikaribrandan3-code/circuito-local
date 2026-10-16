import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X, Phone, Instagram, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type DbCategory = { id: string; name: string; description: string | null; display_order: number; image_url?: string | null };
type DbItem = { id: string; name: string; description: string | null; price: number; category_id: string; image_url: string | null };
type DbItemImage = { id: string; item_id: string; image_url: string; display_order: number };

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  categoryName: string;
  stock_status: string;
};

const CATEGORY_IMAGES: Record<string, string> = {
  flores: "/images/flores-category.jpg",
  libros: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80",
  mate: "/images/mate-product.jpg",
  argentina: "/images/argentina-jersey.webp",
  regalos: "/images/regalos-special.png",
};

// Map category names to image URLs (handles both ID-based and name-based lookups)
const getImageForCategory = (category: DbCategory): string => {
  // First try by ID (in case ID is "flores", "libros", etc.)
  if (CATEGORY_IMAGES[category.id]) {
    return CATEGORY_IMAGES[category.id];
  }
  // Fall back to name-based lookup (lowercase the category name)
  const nameKey = category.name.toLowerCase().replace(/[^a-z]/g, "");
  if (CATEGORY_IMAGES[nameKey]) {
    return CATEGORY_IMAGES[nameKey];
  }
  // If no match, try partial match (e.g., "Libros" -> "libros")
  const firstWord = category.name.split(" ")[0].toLowerCase();
  if (CATEGORY_IMAGES[firstWord]) {
    return CATEGORY_IMAGES[firstWord];
  }
  return "/images/default-category.jpg";
};

const MAX_PRICE = 1000000;

export default function Catalogo() {
  const { count } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const qParam = searchParams.get("q") ?? "";
  const catParam = searchParams.get("cat") ?? "";

  const [search, setSearch] = useState(qParam);
  const [price, setPrice] = useState<[number, number]>([0, MAX_PRICE]);
  const [selectedCats, setSelectedCats] = useState<string[]>(catParam ? [catParam] : []);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerPhone, setOwnerPhone] = useState<string>("");
  const [instagramUrl, setInstagramUrl] = useState<string>("");

  // Load categories and items from Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load owner phone and Instagram from profiles (get first/primary user)
        const { data: profiles } = await supabase.from("profiles").select("phone,instagram_url").limit(1).single();
        if (profiles?.phone) setOwnerPhone(profiles.phone);
        if (profiles?.instagram_url) setInstagramUrl(profiles.instagram_url);

        // Load categories
        const { data: catsData } = await supabase.from("categories").select("*").order("display_order");
        if (catsData) setCategories(catsData as DbCategory[]);

        // Load items with their primary image
        const { data: itemsData } = await supabase.from("items").select("*");
        if (itemsData) {
          const items = itemsData as DbItem[];

          // Get all images
          const { data: imagesData } = await supabase.from("item_images").select("*").order("display_order");
          const imageMap: Record<string, DbItemImage[]> = {};
          (imagesData || []).forEach((img: DbItemImage) => {
            if (!imageMap[img.item_id]) imageMap[img.item_id] = [];
            imageMap[img.item_id].push(img);
          });

          // Build product list with first image
          const productList: Product[] = items.map((item) => {
            const catName = catsData?.find((c) => c.id === item.category_id)?.name || "General";
            const images = imageMap[item.id] || [];
            const firstImage = images[0]?.image_url || item.image_url || "https://images.unsplash.com/photo-1549465120-7ccae1a7d4d6?auto=format&fit=crop&w=900&q=80";

            return {
              id: item.id,
              title: item.name,
              category: item.category_id,
              price: item.price,
              image: firstImage,
              categoryName: catName,
              stock_status: "in_stock",
            };
          });

          setProducts(productList);
        }
      } catch (err) {
        console.error("Error loading catalog:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const toggleCat = (c: string) => {
    setSelectedCats((prev) => {
      const updated = prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c];
      return updated;
    });
  };

  const filtered = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCats && selectedCats.length > 0) {
      result = result.filter((p) => selectedCats.includes(p.category));
    }

    // Filter by search
    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by price
    result = result.filter((p) => p.price >= price[0] && p.price <= price[1]);

    return result;
  }, [search, selectedCats, price, products]);

  const updateSearch = (q: string) => {
    setSearch(q);
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (selectedCats.length) params.cat = selectedCats[0];
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCats([]);
    setPrice([0, MAX_PRICE]);
    navigate("/catalogo", { replace: true });
  };

  const Filters = (
    <div className="space-y-6">
      <div>
        <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Buscar</Label>
        <Input
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
          placeholder="Flores, mate, libros..."
          className="mt-2 rounded-full"
        />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Categoría</Label>
        <div className="mt-3 space-y-2">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={selectedCats.includes(c.id)} onCheckedChange={() => toggleCat(c.id)} />
              <span className="text-sm">{c.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Precio (ARS)</Label>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={2000}
          value={price}
          onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
          className="mt-4"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>${price[0].toLocaleString("es-AR")}</span>
          <span>${price[1].toLocaleString("es-AR")}</span>
        </div>
      </div>
      {(selectedCats.length > 0 || price[0] > 0 || price[1] < MAX_PRICE || search) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" /> Limpiar filtros
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <div className="text-center text-muted-foreground">Cargando catálogo...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
      {/* Empty cart pill */}
      {count === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs text-muted-foreground">
            <ShoppingBag className="h-3.5 w-3.5" />
            Tu carrito está vacío
          </span>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tienda</span>
            <h1 className="font-display text-4xl md:text-5xl mt-1">Catálogo</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "regalo disponible" : "regalos disponibles"}
            </p>
          </div>
          {(ownerPhone || instagramUrl) && (
            <div className="flex flex-row sm:flex-col gap-3 sm:gap-2 sm:items-end">
              {ownerPhone && (
                <a
                  href={`https://wa.me/${ownerPhone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-foreground hover:text-background transition-all"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {ownerPhone}
                </a>
              )}
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900 dark:bg-pink-950 dark:text-pink-300 px-4 py-2 text-sm font-semibold hover:bg-pink-600 hover:text-white transition-all"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  @asb.tore
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Category Tiles */}
      {categories.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => {
            const isSelected = selectedCats.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCat(c.id)}
                className={`relative group rounded-2xl overflow-hidden aspect-[3/4] transition-all duration-200 ${
                  isSelected ? "ring-4 ring-foreground shadow-xl scale-105" : "shadow-md hover:shadow-lg"
                }`}
              >
                <img
                  src={getImageForCategory(c)}
                  alt={c.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className={`absolute inset-0 transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent"
                    : "bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent group-hover:from-foreground/80"
                }`} />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-3">
                  <p className="font-display text-sm font-semibold text-background text-center drop-shadow-lg">
                    {c.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block sticky top-24 self-start rounded-2xl bg-card border border-border p-5 shadow-soft">{Filters}</aside>

        <div>
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="glass-strong w-80">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">{Filters}</div>
              </SheetContent>
            </Sheet>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-card border border-border p-12 text-center">
              <p className="text-muted-foreground">
                {products.length === 0 ? "Aún no hay productos en el catálogo." : "No encontramos regalos con esos filtros."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/producto/${p.id}`)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-lg transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground">{p.categoryName}</p>
                    <p className="font-display text-sm font-semibold mt-1 line-clamp-2">{p.title}</p>
                    <p className="font-display text-base font-bold text-foreground mt-2">
                      ${p.price.toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
