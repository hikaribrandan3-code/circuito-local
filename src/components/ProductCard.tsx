import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatARS, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product);
    toast.success("Agregado al carrito", { description: product.title });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        to="/producto/$id"
        params={{ id: product.id }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{product.brand}</p>
          <h3 className="font-display text-lg font-medium leading-snug line-clamp-2">{product.title}</h3>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <span className="font-display text-xl font-semibold">{formatARS(product.price)}</span>
            <Button
              size="icon"
              onClick={handleAdd}
              className="h-9 w-9 rounded-full bg-foreground text-background hover:bg-foreground/90 active:scale-95"
              aria-label="Agregar al carrito"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
