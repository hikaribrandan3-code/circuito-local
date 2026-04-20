import { createFileRoute, useNavigate } from "@tanstack/react-router";
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

type Search = { q?: string; cat?: Category };

export const Route = createFileRoute("/catalogo")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    cat: (CATEGORIES.find((c) => c.id === s.cat)?.id as Category | undefined),
  }),
  head: () => ({
    meta: [
      { title: "Catálogo — Circuito" },
      {
        name: "description",
        content: "Explorá iPhones, PC gamer, cámaras y accesorios reacondicionados con condición verificada.",
      },
      { property: "og:title", content: "Catálogo — Circuito" },
      { property: "og:description", content: "Tech reacondicionada al mejor precio en Argentina." },
    ],
  }),
  component: Catalog,
});

const MAX_PRICE = 2500000;

function Catalog() {
  const navigate = useNavigate();
  const { q, cat } = Route.useSearch();
  const [search, setSearch] = useState(q ?? "");
  const [price, setPrice] = useState<[number, number]>([0, MAX_PRICE]);
  const [minCondition, setMinCondition] = useState(0);
  const [cats, setCats] = useState<Category[]>(cat ? [cat] : []);

  const toggleCat = (c: Category) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (search && !`${p.title} ${p.brand}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (cats.length && !cats.includes(p.category)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      if (p.conditionScore < minCondition) return false;
      return true;
    });
  }, [search, cats, price, minCondition]);

  const Filters = (
    <div className="space-y-6">
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Buscar</Label>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            navigate({ to: "/catalogo", search: { q: e.target.value || undefined, cat } as never, replace: true });
          }}
          placeholder="iPhone, teclado..."
          className="mt-2"
        />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Categoría</Label>
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
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Precio (ARS)</Label>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={50000}
          value={price}
          onValueChange={(v) => setPrice([v[0], v[1]] as [number, number])}
          className="mt-4"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>${price[0].toLocaleString("es-AR")}</span>
          <span>${price[1].toLocaleString("es-AR")}</span>
        </div>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
          Condición mínima: {minCondition}/10
        </Label>
        <Slider
          min={0}
          max={10}
          step={1}
          value={[minCondition]}
          onValueChange={(v) => setMinCondition(v[0])}
          className="mt-4"
        />
      </div>
      {(cats.length > 0 || minCondition > 0 || price[0] > 0 || price[1] < MAX_PRICE || search) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("");
            setCats([]);
            setPrice([0, MAX_PRICE]);
            setMinCondition(0);
            navigate({ to: "/catalogo", search: {} as never, replace: true });
          }}
        >
          <X className="h-4 w-4 mr-1" /> Limpiar filtros
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold">Catálogo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "producto" : "productos"} disponibles
        </p>
      </motion.div>

      <div className="mt-6 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block sticky top-24 self-start rounded-2xl glass p-5">{Filters}</aside>

        <div>
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="glass">
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
            <div className="rounded-2xl glass p-12 text-center">
              <p className="text-muted-foreground">No encontramos productos con esos filtros.</p>
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
