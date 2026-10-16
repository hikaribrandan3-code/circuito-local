import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useStoreProducts } from "@/lib/useStoreProducts";
import { useCart } from "@/lib/cart";
import { formatARS } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";

export default function Producto() {
  const { id } = useParams();
  const { products, loading } = useStoreProducts();
  const { add } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const product = products.find((item) => item.id === id);
  if (!product)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-medium">
          {loading ? "Cargando prenda…" : "Esta prenda ya no está disponible"}
        </h1>
        <Link to="/catalogo" className="mt-4 inline-block text-sm underline">
          Volver a la colección
        </Link>
      </div>
    );
  const images = product.allImages?.length ? product.allImages : [product.image];
  const related = products
    .filter((item) => item.id !== id)
    .sort(
      (a, b) => Number(b.category === product.category) - Number(a.category === product.category),
    )
    .slice(0, 4);
  const sizes = product.sizes ? Object.keys(product.sizes) : ["S", "M", "L", "XL"];
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <Link
        to="/catalogo"
        className="mb-5 inline-flex items-center gap-2 text-xs text-muted-foreground"
      >
        <ArrowLeft size={14} />
        La colección
      </Link>
      <div className="grid gap-7 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white">
          <img
            src={images[imageIndex % images.length]}
            alt={product.title}
            width="960"
            height="1200"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
          {images.length > 1 && (
            <div className="absolute inset-x-4 bottom-4 flex justify-between">
              <button
                aria-label="Foto anterior"
                className="round-control"
                onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                aria-label="Foto siguiente"
                className="round-control"
                onClick={() => setImageIndex((i) => (i + 1) % images.length)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
        <div className="py-3 md:self-center">
          <p className="text-[10px] uppercase tracking-[.18em] text-muted-foreground">
            {product.categoryName ?? "La colección"}
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">{product.title}</h1>
          <p className="mt-4 text-xl font-semibold">{formatARS(product.price)}</p>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          {product.demo && (
            <p className="mt-4 rounded-2xl border border-black/5 bg-white/70 p-3 text-xs leading-relaxed text-muted-foreground">
              Demo interactiva · precios y talles de muestra. No se realizan cobros.
            </p>
          )}
          {product.has_sizes && (
            <fieldset className="mt-6">
              <legend className="mb-3 text-xs font-medium">
                Elegí tu talle{product.demo ? " · muestra" : ""}
              </legend>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    disabled={product.sizes?.[size] === false}
                    onClick={() => setSelectedSize(size)}
                    className={`min-h-11 min-w-12 rounded-xl border px-4 text-sm transition disabled:opacity-30 disabled:line-through ${selectedSize === size ? "border-black bg-black text-white" : "border-black/15 bg-white hover:border-black"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <button
            disabled={Boolean(product.has_sizes && !selectedSize)}
            onClick={() => {
              add({ ...product, selectedSize: product.has_sizes ? selectedSize : undefined });
              toast.success("Agregado al carrito", { description: product.title });
            }}
            className="disabled:cursor-not-allowed disabled:opacity-40 mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-medium text-white"
          >
            <ShoppingBag size={18} />
            {product.has_sizes && !selectedSize ? "Elegí un talle" : "Agregar al carrito"}
          </button>
          <div className="mt-6 divide-y divide-black/10 border-y border-black/10 text-xs">
            <details>
              <summary className="flex min-h-12 cursor-pointer items-center font-medium">
                Talles y medidas
              </summary>
              <p className="pb-4 leading-relaxed text-muted-foreground">
                Consultanos las medidas de la prenda para elegir tu talle.{" "}
                {product.demo
                  ? "Las opciones de esta demo son ilustrativas."
                  : "La disponibilidad depende del modelo."}
              </p>
            </details>
            <details>
              <summary className="flex min-h-12 cursor-pointer items-center font-medium">
                Entrega y retiro
              </summary>
              <p className="pb-4 leading-relaxed text-muted-foreground">
                Coordiná con la tienda las opciones de entrega o retiro en Córdoba.
              </p>
            </details>
            <Link to="/contacto" className="flex min-h-12 items-center justify-between font-medium">
              ¿Necesitás ayuda? <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <Link
            to="/carrito"
            className="mt-4 block text-center text-xs underline underline-offset-4"
          >
            Ver mi carrito
          </Link>
        </div>
      </div>
      <section className="mt-12">
        <h2 className="mb-5 text-lg font-medium">También te puede gustar</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
