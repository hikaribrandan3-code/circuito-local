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
  const related = products.filter((item) => item.id !== id).slice(0, 4);
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
              Foto real del local. Precio ilustrativo para mostrar la experiencia de compra.
            </p>
          )}
          <button
            onClick={() => {
              add(product);
              toast.success("Agregado al carrito", { description: product.title });
            }}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-medium text-white"
          >
            <ShoppingBag size={18} />
            Agregar al carrito
          </button>
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
