import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatARS, STORE } from "@/lib/products";
import { toast } from "sonner";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Carrito — ABS Store" },
      { name: "description", content: "Revisá tu pedido y finalizá la compra." },
      { property: "og:title", content: "Carrito — ABS Store" },
      { property: "og:description", content: "Tu selección de regalos curados." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, setQty, remove, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-4xl">Tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground">Explorá el catálogo y encontrá el regalo perfecto.</p>
        <Button asChild className="mt-8 bg-foreground text-background hover:bg-foreground/90 rounded-full">
          <Link to="/catalogo">Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  const checkout = () => {
    const lines = items
      .map((i) => `• ${i.product.title} x${i.qty} — ${formatARS(i.product.price * i.qty)}`)
      .join("\n");
    const text = encodeURIComponent(
      `Hola ${STORE.name}, quiero hacer este pedido:\n\n${lines}\n\nTotal: ${formatARS(total)}`,
    );
    window.open(`https://wa.me/${STORE.whatsapp}?text=${text}`, "_blank");
    toast.success("Abriendo WhatsApp", { description: "Te esperamos para coordinar el envío." });
    setTimeout(() => clear(), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-8 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Tu pedido</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} {items.length === 1 ? "producto" : "productos"}</p>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
        <ul className="space-y-3">
          {items.map((item, i) => (
            <motion.li
              key={item.product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-2xl bg-card border border-border p-4"
            >
              <Link to="/producto/$id" params={{ id: item.product.id }} className="shrink-0">
                <img src={item.product.image} alt={item.product.title} className="h-24 w-24 rounded-xl object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to="/producto/$id" params={{ id: item.product.id }} className="hover:underline">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{item.product.brand}</p>
                  <h3 className="font-display text-lg font-medium leading-tight line-clamp-1">{item.product.title}</h3>
                </Link>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-secondary px-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setQty(item.product.id, item.qty - 1)}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setQty(item.product.id, item.qty + 1)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <span className="font-display font-semibold">{formatARS(item.product.price * item.qty)}</span>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => remove(item.product.id)} aria-label="Eliminar">
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </motion.li>
          ))}
        </ul>

        <aside className="rounded-2xl bg-card border border-border p-6 h-fit lg:sticky lg:top-24 shadow-soft">
          <h2 className="font-display text-2xl">Resumen</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatARS(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Envío</dt>
              <dd className="text-muted-foreground">A coordinar</dd>
            </div>
          </dl>
          <div className="my-4 h-px bg-border" />
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-semibold">{formatARS(total)}</span>
          </div>
          <Button
            onClick={checkout}
            size="lg"
            className="mt-6 w-full bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium"
          >
            Finalizar por WhatsApp
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full rounded-full">
            <Link to="/catalogo">Seguir comprando</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
