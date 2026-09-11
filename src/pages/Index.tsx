import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getCatalog, mediaUrl, productImage, type Category, type Product } from "@/lib/commerce";
import {
  StoreLoading,
  StoreShell,
  StoreUnavailable,
  useCurrentStore,
} from "@/components/StoreShell";

export default function Index() {
  const { store, loading, error } = useCurrentStore();
  const [catalog, setCatalog] = useState<{ categories: Category[]; products: Product[] } | null>(
    null,
  );
  useEffect(() => {
    if (store)
      getCatalog(store)
        .then(setCatalog)
        .catch(() => setCatalog({ categories: [], products: [] }));
  }, [store]);
  if (loading) return <StoreLoading />;
  if (!store || error) return <StoreUnavailable message={error || undefined} />;
  const base = `/${store.slug}`;
  const rootCategories = catalog?.categories.filter((category) => !category.parent_id) ?? [];
  return (
    <StoreShell store={store}>
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 pt-10 pb-12 md:pt-20 md:pb-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <span className="inline-flex rounded-full bg-green-100 text-green-700 border border-green-200 px-3 py-1 text-xs font-semibold">
              Tienda local · compra simple
            </span>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight">
              Encontrá algo <span className="serif-italic">especial.</span>
            </h1>
            <p className="mt-5 max-w-md text-base md:text-lg text-foreground/80 leading-relaxed">
              {String(
                store.config.hero_subtitle ??
                  "Productos elegidos con cariño. Comprá online y coordiná todo por WhatsApp.",
              )}
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                className="inline-flex items-center rounded-full bg-foreground text-background px-5 py-3 font-medium"
                to={`${base}/catalogo`}
              >
                Ver catálogo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              {store.settings.whatsapp_number && (
                <a
                  className="inline-flex items-center rounded-full border px-5 py-3 font-medium"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/${store.settings.whatsapp_number.replace(/\D/g, "")}`}
                >
                  Consultar por WhatsApp
                </a>
              )}
            </div>
          </div>
          {store.settings.hero_path && (
            <img
              src={mediaUrl(store.settings.hero_path, 1200)}
              alt=""
              fetchPriority="high"
              width="1200"
              height="900"
              className="w-full aspect-[4/3] rounded-3xl object-cover shadow-elegant"
            />
          )}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[.2em] text-muted-foreground">
            Colecciones
          </span>
          <h2 className="mt-2 font-display text-4xl">Elegí una categoría</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rootCategories.map((category) => (
            <Link
              key={category.id}
              to={`${base}/categoria/${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary shadow-soft"
            >
              {category.image_path && (
                <img
                  src={mediaUrl(category.image_path, 800)}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="1066"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              <div className="absolute bottom-0 p-4 text-background">
                <h3 className="font-display text-xl">{category.name}</h3>
                <p className="text-xs opacity-80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[.2em] text-muted-foreground">
              Destacados
            </span>
            <h2 className="font-display text-3xl md:text-4xl mt-1">Para descubrir hoy</h2>
          </div>
          <Link to={`${base}/catalogo`} className="text-sm underline">
            Ver todo
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {catalog?.products.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              to={`${base}/producto/${product.slug}`}
              className="rounded-2xl overflow-hidden border bg-card shadow-soft"
            >
              <img
                src={productImage(product, 800)}
                alt={product.images[0]?.alt_text || product.name}
                loading="lazy"
                decoding="async"
                width="800"
                height="1000"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="p-3">
                <p className="font-display line-clamp-2">{product.name}</p>
                <p className="mt-1 font-semibold">${product.price.toLocaleString("es-AR")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </StoreShell>
  );
}
