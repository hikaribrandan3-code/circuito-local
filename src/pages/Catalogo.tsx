import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getCatalog, productImage, type Category, type Product } from "@/lib/commerce";
import { StoreLoading, StoreShell, useCurrentStore } from "@/components/StoreShell";

export default function Catalogo() {
  const { store, loading } = useCurrentStore();
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [catalog, setCatalog] = useState<{ categories: Category[]; products: Product[] } | null>(
    null,
  );
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  useEffect(() => {
    if (store) getCatalog(store).then(setCatalog);
  }, [store]);
  const category = catalog?.categories.find((item) => item.slug === categorySlug);
  const categoryIds = new Set(
    category
      ? [
          category.id,
          ...catalog!.categories
            .filter((item) => item.parent_id === category.id)
            .map((item) => item.id),
        ]
      : [],
  );
  const products = useMemo(
    () =>
      (catalog?.products ?? []).filter(
        (product) =>
          (!category || categoryIds.has(product.category_id ?? "")) &&
          product.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [catalog, category, query],
  );
  if (loading || !store || !catalog) return <StoreLoading message="Cargando catálogo…" />;
  const base = `/${store.slug}`;
  return (
    <StoreShell store={store}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <span className="text-xs uppercase tracking-[.2em] text-muted-foreground">
          {category ? "Categoría" : "Tienda"}
        </span>
        <h1 className="font-display text-4xl md:text-5xl mt-1">{category?.name ?? "Catálogo"}</h1>
        {category?.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {!categorySlug && (
            <Link
              to={`${base}/catalogo`}
              className="shrink-0 rounded-full bg-foreground text-background px-4 py-2 text-sm"
            >
              Todo
            </Link>
          )}
          {catalog.categories
            .filter((item) => !item.parent_id)
            .map((item) => (
              <Link
                key={item.id}
                to={`${base}/categoria/${item.slug}`}
                className="shrink-0 rounded-full border px-4 py-2 text-sm"
              >
                {item.name}
              </Link>
            ))}
        </div>
        {category && catalog.categories.some((item) => item.parent_id === category.id) && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {catalog.categories
              .filter((item) => item.parent_id === category.id)
              .map((item) => (
                <Link
                  key={item.id}
                  to={`${base}/categoria/${item.slug}`}
                  className="shrink-0 rounded-full bg-secondary px-4 py-2 text-sm"
                >
                  {item.name}
                </Link>
              ))}
          </div>
        )}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar productos…"
          className="mt-7 h-11 w-full max-w-md rounded-full border bg-background px-4 text-sm"
        />
        {products.length ? (
          <div className="mt-7 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`${base}/producto/${product.slug}`}
                className="group overflow-hidden rounded-2xl border bg-card shadow-soft"
              >
                <img
                  src={productImage(product, 800)}
                  alt={product.images[0]?.alt_text || product.name}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="1000"
                  className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                  <h2 className="font-display mt-1 line-clamp-2">{product.name}</h2>
                  <p className="mt-2 font-semibold">${product.price.toLocaleString("es-AR")}</p>
                  {product.availability === "sold_out" && (
                    <p className="text-xs text-muted-foreground mt-1">Agotado</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border bg-card p-10 text-center text-muted-foreground">
            No encontramos productos.
          </p>
        )}
      </div>
    </StoreShell>
  );
}
