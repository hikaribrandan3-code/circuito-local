import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tienda</span>
            <h1 className="font-display text-4xl md:text-5xl mt-1">Catálogo</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "regalo disponible" : "regalos disponibles"}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            {ownerPhone && (
              <a href={`https://wa.me/${ownerPhone.replace(/\D/g, "")}`} className="text-xs text-foreground hover:text-foreground/70 transition-colors">
                📱 {ownerPhone}
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground hover:text-foreground/70 transition-colors">
                📸 Instagram
              </a>
            )}
          </div>
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
