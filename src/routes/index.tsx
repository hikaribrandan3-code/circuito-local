import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Recycle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Circuito — Tecnología de primera, precios de segunda" },
      {
        name: "description",
        content:
          "Comprá y vendé iPhones, gaming, cámaras y accesorios reacondicionados en Argentina. Condición verificada y envíos a todo el país.",
      },
      { property: "og:title", content: "Circuito — Tech premium reacondicionada" },
      {
        property: "og:description",
        content: "Marketplace argentino de tecnología usada premium. Cotizá tu equipo en 1 minuto.",
      },
    ],
  }),
  component: Index,
});

const BRANDS = ["Apple", "Sony", "Logitech", "Razer", "Nikon", "HyperX", "Keychron", "Nvidia", "GoPro", "Samsung"];

function Index() {
  const featured = PRODUCTS.slice(0, 8);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 pt-12 pb-16 md:pt-24 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-muted-foreground">Reacondicionado verificado · Envío a todo el país</span>
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Tecnología <span className="text-gradient">de primera.</span>
              <br />
              Precios <span className="italic font-medium text-muted-foreground">de segunda.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base md:text-lg text-foreground">
              Comprá iPhones, gaming, cámaras y accesorios reacondicionados con condición verificada.
              O cotizá tu equipo en menos de 1 minuto.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-full">
                <Link to="/catalogo">
                  Ver Catálogo <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-foreground/20 hover:border-foreground hover:bg-foreground/5">
                <Link to="/vender">Cotizá tu equipo</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { icon: ShieldCheck, label: "Garantía 6 meses" },
                { icon: Truck, label: "Envíos a todo el país" },
                { icon: Recycle, label: "Tech circular" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-start gap-2">
                  <b.icon className="h-5 w-5 text-foreground" />
                  <span className="text-xs text-muted-foreground leading-tight">{b.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Marquee */}
        <div className="relative border-y border-border/40 glass overflow-hidden">
          <div className="flex marquee whitespace-nowrap py-4">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="mx-8 font-display text-2xl md:text-3xl font-semibold text-muted-foreground/60 hover:text-primary transition-colors">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Explorá por categoría</h2>
          <Link to="/catalogo" className="text-sm text-primary hover:underline">Ver todo →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to="/catalogo"
                search={{ cat: c.id } as never}
                className="group flex aspect-[4/3] flex-col justify-between rounded-2xl glass p-5 hover:border-primary/40 hover:-translate-y-1 transition-all"
              >
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Categoría</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold">{c.label}</h3>
                  <span className="mt-1 inline-flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-wider text-accent">Lo más buscado</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Destacados de la semana</h2>
          </div>
          <Link to="/catalogo" className="text-sm text-primary hover:underline">Ver todo →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* SELL CTA */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-14">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase tracking-wider text-accent">Vendé fácil</span>
              <h2 className="mt-2 font-display text-3xl md:text-5xl font-bold leading-tight">
                Cotizá tu equipo <span className="text-gradient">en 1 minuto.</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-md">
                Decinos qué tenés, te pasamos una oferta clara y sin vueltas. Pago al instante.
              </p>
              <Button asChild size="lg" className="mt-6 bg-accent text-accent-foreground hover:opacity-90 font-semibold glow-yellow">
                <Link to="/vender">Solicitar Cotización <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <ul className="grid gap-3">
              {["Cotización en minutos", "Pago por transferencia o MercadoPago", "Retiro gratis en CABA y GBA", "Sin intermediarios"].map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-xl glass p-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">✓</span>
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
