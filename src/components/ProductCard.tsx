import { Link } from "react-router-dom";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { formatARS, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product; index?: number; images?: string[] }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <article className="min-w-0">
      <div className="relative">
        <Link
          to={`/producto/${product.id}`}
          className="group block aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white"
        >
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          aria-label={`Agregar ${product.title} al carrito`}
          onClick={() => {
            add(product);
            setAdded(true);
            toast.success("Agregado al carrito", { description: product.title });
          }}
          className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-black text-white shadow-lg transition hover:scale-105 active:scale-95"
        >
          {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
        </button>
      </div>
      <div className="px-1 pb-4 pt-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {product.categoryName ?? product.brand}
        </p>
        <Link
          to={`/producto/${product.id}`}
          className="mt-1 block truncate text-sm font-medium leading-snug"
        >
          {product.title}
        </Link>
        <p className="mt-1.5 text-sm font-semibold">{formatARS(product.price)}</p>
      </div>
    </article>
  );
}
