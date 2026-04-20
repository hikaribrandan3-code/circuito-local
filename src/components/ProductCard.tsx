import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatARS, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

const conditionVariant = (score: number) => {
  if (score >= 9) return "bg-primary/15 text-primary border-primary/30";
  if (score >= 8) return "bg-accent/15 text-accent border-accent/30";
  return "bg-muted text-muted-foreground border-border";
};

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
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        to="/producto/$id"
        params={{ id: product.id }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_oklch(0.84_0.18_195/40%)]"
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary to-card">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Badge variant="outline" className={`absolute top-3 left-3 backdrop-blur-md ${conditionVariant(product.conditionScore)}`}>
            {product.conditionLabel} · {product.conditionScore}/10
          </Badge>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{product.brand}</p>
            <h3 className="font-display text-base font-semibold leading-tight line-clamp-2">{product.title}</h3>
          </div>
          <div className="mt-auto flex items-end justify-between gap-2">
            <span className="font-display text-xl font-bold text-gradient">{formatARS(product.price)}</span>
            <Button
              size="sm"
              onClick={handleAdd}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Agregar al carrito</span>
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
