import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shirt } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ModelLookbook } from "@/components/ModelLookbook";
import { StoreGallery } from "@/components/StoreGallery";
import { useStoreProducts } from "@/lib/useStoreProducts";

export default function Index() {
  const { products, categories, isDemo } = useStoreProducts();
  const [category, setCategory] = useState("");
  useEffect(() => {
    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 60px" },
    );
    document.querySelectorAll(".reveal-section").forEach((section) => {
      if (section.getBoundingClientRect().top > window.innerHeight)
        section.setAttribute("data-reveal", "true");
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  const selected = products.filter((product) => !category || product.category === category);
  return (
    <div className="mx-auto max-w-7xl px-4 pb-4 lg:px-8">
      <section className="editorial-hero -mx-4 lg:-mx-8" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="hero-eyebrow">R&E · URBAN ESSENTIALS</p>
          <h1 id="home-title">
            TU ESTILO.
            <br />
            TODOS
            <br />
            LOS DÍAS.
          </h1>
          <div className="my-3 h-px w-7 bg-black/50" />
          <p className="hero-categories">REMERAS · BERMUDAS · ACCESORIOS</p>
          <p className="hero-categories mt-1">HOMBRE · MUJER</p>
          <Link to="/catalogo" className="hero-cta">
            VER COLECCIÓN <ArrowRight size={17} />
          </Link>
        </div>
        <div className="hero-image">
          <img
            src="/images/hero-editorial-v2.webp"
            alt="Selección de remeras, bermuda y gorra de estilo urbano"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
        </div>
      </section>
      <nav
        aria-label="Destacados de la colección"
        className="category-strip -mx-4 grid grid-cols-3 divide-x divide-black/20 bg-white/50 py-3 lg:-mx-8"
      >
        <Link to="/catalogo?q=remera">
          <Shirt size={22} strokeWidth={1.6} />
          <strong>REMERAS</strong>
          <small>BÁSICAS Y ESTAMPADAS</small>
        </Link>
        <Link to="/catalogo?cat=shorts">
          <svg
            width="22"
            height="22"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="M7 4h18l3 24-10-1-2-10-2 10-10 1Z" />
            <path d="M7 8h18" />
          </svg>
          <strong>BERMUDAS</strong>
          <small>COMODIDAD URBANA</small>
        </Link>
        <Link to="/catalogo?cat=accesorios">
          <svg
            width="22"
            height="22"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path d="M5 21C4 9 10 4 18 5s11 9 9 17l-10-2-9 7-5-2Z" />
            <path d="M17 5c5 6 5 11 3 15M8 27l9-7" />
          </svg>
          <strong>ACCESORIOS</strong>
          <small>COMPLETÁ TU LOOK</small>
        </Link>
      </nav>
      <p className="py-3 text-center text-[10px] tracking-wide text-muted-foreground">
        Ventas minoristas y mayoristas · Córdoba Capital
      </p>
      <ModelLookbook />
      <div
        className="store-gallery-track mt-6 flex gap-2 overflow-x-auto pb-2"
        role="group"
        aria-label="Categorías"
      >
        {[{ id: "", label: "Todo" }, ...categories].map((cat) => (
          <button
            key={cat.id}
            type="button"
            aria-pressed={category === cat.id}
            onClick={() => setCategory(cat.id)}
            className={`min-h-11 shrink-0 rounded-full px-5 py-2.5 text-xs font-medium transition ${category === cat.id ? "bg-black text-white" : "border border-white bg-white/80 text-foreground hover:bg-white"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <section className="reveal-section mt-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {category ? categories.find((cat) => cat.id === category)?.label : "Nuevos favoritos"}
          </h2>
          <Link to="/catalogo" className="text-xs underline underline-offset-4">
            Ver colección
          </Link>
        </div>
        {isDemo && (
          <p className="mb-4 text-[11px] text-muted-foreground">
            Selección de muestra · fotos reales del local · precios ilustrativos
          </p>
        )}
        {selected.length ? (
          category ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-5 lg:grid-cols-4">
              {selected.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div
              className="store-product-carousel -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:gap-5 sm:px-8 lg:-mx-8 lg:px-8"
              role="region"
              aria-label="Deslizá para explorar la colección"
              tabIndex={0}
            >
              {selected.map((product) => (
                <div
                  key={product.id}
                  className="w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[240px]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="rounded-3xl border border-white bg-white/60 px-6 py-12 text-center text-sm text-muted-foreground">
            Estamos armando esta selección.{" "}
            <button onClick={() => setCategory("")} className="ml-1 text-foreground underline">
              Explorar todo
            </button>
          </div>
        )}
      </section>
      <StoreGallery />
    </div>
  );
}
