import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatARS } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Carrito — Circuito" },
      { name: "description", content: "Revisá tu carrito y finalizá la compra con MercadoPago." },
      { property: "og:title", content: "Carrito — Circuito" },
      { property: "og:description", content: "Comprá tech reacondicionada con pago seguro." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, setQty, remove, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full glass">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground">Explorá el catálogo y encontrá tu próximo equipo.</p>
        <Button asChild className="mt-8 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold glow-cyan">
          <Link to="/catalogo">Ver Catálogo</Link>
        </Button>
      </div>
    );
  }

  const checkout = () => {
    toast.success("Redirigiendo a MercadoPago...", { description: "Mock checkout — integración pendiente." });
    setTimeout(() => clear(), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-8 py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold">Tu carrito</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} producto{items.length === 1 ? "" : "s"}</p>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
        <ul className="space-y-3">
          {items.map((item, i) => (
            <motion.li
              key={item.product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-2xl glass p-4"
            >
              <Link to="/producto/$id" params={{ id: item.product.id }} className="shrink-0">
                <img src={item.product.image} alt={item.product.title} className="h-24 w-24 rounded-xl object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to="/producto/$id" params={{ id: item.product.id }} className="hover:text-primary">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.product.brand}</p>
                  <h3 className="font-semibold leading-tight line-clamp-1">{item.product.title}</h3>
                </Link>
                <span className="text-xs text-muted-foreground mt-1">
                  Condición {item.product.conditionLabel} · {item.product.conditionScore}/10
                </span>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 rounded-full glass px-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQty(item.product.id, item.qty - 1)}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQty(item.product.id, item.qty + 1)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <span className="font-display font-bold">{formatARS(item.product.price * item.qty)}</span>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => remove(item.product.id)} aria-label="Eliminar">
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </motion.li>
          ))}
        </ul>

        <aside className="rounded-2xl glass-strong p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Resumen</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatARS(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Envío</dt>
              <dd className="text-success">Gratis</dd>
            </div>
          </dl>
          <div className="my-4 h-px bg-border" />
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-bold text-gradient">{formatARS(total)}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">o 12 cuotas con MercadoPago</p>
          <Button
            onClick={checkout}
            size="lg"
            className="mt-6 w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 font-semibold glow-cyan"
          >
            Finalizar compra
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link to="/catalogo">Seguir comprando</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
