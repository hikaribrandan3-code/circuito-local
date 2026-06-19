import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const MAX_PRICE = 200000;

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const qParam = searchParams.get("q") ?? "";
  const catParam = searchParams.get("cat") ?? "";

  const [search, setSearch] = useState(qParam);
  const [price, setPrice] = useState<[number, number]>([0, MAX_PRICE]);
  const [cats, setCats] = useState<Category[]>(catParam ? [catParam as Category] : []);

  const toggleCat = (c: Category) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (search && !`${p.title} ${p.brand}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (cats.length && !cats.includes(p.category)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      return true;
    });
  }, [search, cats, price]);

  const updateSearch = (q: string) => {
    setSearch(q);
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (cats.length) params.cat = cats[0];
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setSearch("");
    setCats([]);
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
          {CATEGORIES.map((c) => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={cats.includes(c.id)} onCheckedChange={() => toggleCat(c.id)} />
              <span className="text-sm">{c.label}</span>
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
      {(cats.length > 0 || price[0] > 0 || price[1] < MAX_PRICE || search) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" /> Limpiar filtros
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tienda</span>
        <h1 className="font-display text-4xl md:text-5xl mt-1">Catálogo</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "regalo disponible" : "regalos disponibles"}
        </p>
      </motion.div>

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
              <p className="text-muted-foreground">No encontramos regalos con esos filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
