import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { formatARS, PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/producto/$id")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.title} — Circuito` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.title} — Circuito` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
          { name: "twitter:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Producto no encontrado</h1>
      <p className="mt-2 text-muted-foreground">Puede que ya se haya vendido.</p>
      <Button asChild className="mt-6"><Link to="/catalogo">Volver al catálogo</Link></Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
      <Link to="/catalogo" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative aspect-square overflow-hidden rounded-3xl glass"
        >
          <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
          <Badge className="absolute top-4 left-4 bg-primary/20 text-primary border border-primary/30 backdrop-blur-md">
            {product.conditionLabel} · {product.conditionScore}/10
          </Badge>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="text-xs uppercase tracking-wider text-accent">{product.brand}</span>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-bold leading-tight">{product.title}</h1>
          <p className="mt-4 font-display text-4xl font-bold text-gradient">{formatARS(product.price)}</p>
          <p className="mt-1 text-xs text-muted-foreground">o 12 cuotas con MercadoPago</p>

          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-6 grid gap-2">
            <h3 className="text-sm font-semibold">Especificaciones</h3>
            <ul className="grid grid-cols-2 gap-2">
              {product.specs.map((s: string) => (
                <li key={s} className="flex items-center gap-2 rounded-lg glass px-3 py-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => {
                add(product);
                toast.success("Agregado al carrito", { description: product.title });
              }}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 font-semibold glow-cyan"
            >
              <ShoppingCart className="mr-1 h-4 w-4" /> Agregar al carrito
            </Button>
            <Button asChild size="lg" variant="outline" className="glass border-primary/40">
              <Link to="/carrito">Comprá ahora</Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-xl glass p-4">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-semibold">Garantía 6 meses</p>
              <p className="text-xs text-muted-foreground">Cambio sin vueltas</p>
            </div>
            <div className="rounded-xl glass p-4">
              <Truck className="h-5 w-5 text-accent" />
              <p className="mt-2 text-sm font-semibold">Envío a todo el país</p>
              <p className="text-xs text-muted-foreground">Gratis en CABA</p>
            </div>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">También te puede interesar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
