import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useStoreProducts } from "@/lib/useStoreProducts";
import { ProductCard } from "@/components/ProductCard";

export default function Catalogo() {
  const { products, categories, isDemo } = useStoreProducts();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("cat") ?? "";
  const update = (key: string, value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };
  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (!category || product.category === category) &&
          product.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      ),
    [products, category, query],
  );
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground">
            R&E Urban Style
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">La colección</h1>
        </div>
        <label className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm">
          <Search size={18} />
          <input
            aria-label="Buscar en la colección"
            placeholder="Buscar prendas..."
            value={query}
            onChange={(e) => update("q", e.target.value)}
            className="min-w-0 bg-transparent text-sm outline-none"
          />
          {query && (
            <button aria-label="Borrar búsqueda" onClick={() => update("q", "")}>
              <X size={16} />
            </button>
          )}
        </label>
      </div>
      <div
        className="store-gallery-track my-6 flex gap-2 overflow-x-auto pb-2"
        role="group"
        aria-label="Categorías"
      >
        {[{ id: "", label: "Todo" }, ...categories].map((cat) => (
          <button
            key={cat.id}
            aria-pressed={category === cat.id}
            onClick={() => update("cat", cat.id)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-medium ${category === cat.id ? "bg-black text-white" : "bg-white"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <p className="mb-5 text-xs text-muted-foreground">
        {filtered.length} prendas{isDemo ? " · precios ilustrativos para la demo" : ""}
      </p>
      {filtered.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white/70 p-12 text-center">
          <p className="text-sm text-muted-foreground">No hay prendas en esta selección todavía.</p>
          <button onClick={() => setParams({})} className="mt-4 text-sm underline">
            Ver toda la colección
          </button>
        </div>
      )}
    </div>
  );
}
