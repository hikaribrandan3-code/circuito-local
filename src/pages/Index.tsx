import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flower2, BookOpen, Coffee, Heart, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, STORE } from "@/lib/products";

const CATEGORY_ICONS: Record<string, typeof Flower2> = {
  flores: Flower2,
  libros: BookOpen,
  mate: Coffee,
  argentina: Heart,
  regalos: Gift,
};

const CATEGORY_IMAGES: Record<string, string> = {
  flores: "/images/flores-category.jpg",
  libros: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80",
  mate: "/images/mate-product.jpg",
  argentina: "/images/argentina-jersey.webp",
  regalos: "/images/regalos-special.png",
};

export default function Index() {
  const featured = PRODUCTS.slice(0, 8);
  const hasProducts = PRODUCTS.length > 0;

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 pt-10 pb-12 md:pt-20 md:pb-20 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-celeste" />
              <span className="text-muted-foreground">Boutique de regalos · Desde Córdoba hacia Argentina</span>
            </span>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight">
              Regalos <span className="serif-italic">boutique</span>
              <br />
              que <span className="serif-italic">cuentan</span> historias.
            </h1>
            <p className="mt-5 max-w-md text-base md:text-lg text-foreground/80 leading-relaxed">
              Seleccionados con cuidado. Enviamos a todo el país. Flores, libros, mate y piezas argentinas de diseño.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full">
                <Link to="/catalogo">
                  Ver Catálogo <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-foreground/20 hover:border-foreground hover:bg-foreground/5">
                <Link to="/contacto">Hablar con nosotros</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-elegant">
              <img
                src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=80"
                alt="Ramo artesanal de peonías"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden md:block absolute -bottom-6 -left-6 w-44 aspect-square overflow-hidden rounded-2xl border-4 border-background shadow-elegant">
              <img
                src="https://images.unsplash.com/photo-1605118898735-43ddc3b8d40c?auto=format&fit=crop&w=400&q=80"
                alt="Mate de calabaza con alpaca"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden md:flex absolute -top-4 -right-4 items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 shadow-elegant">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="text-xs font-medium tracking-wider uppercase">Hecho a mano</span>
            </div>
          </motion.div>
        </div>

        {/* Argentine flag accent strip */}
        <div className="h-1 w-full bg-gradient-to-r from-celeste via-background to-celeste" />
      </section>

      {/* CATEGORÍAS */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nuestras colecciones</span>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">Para cada gesto, un regalo</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c, i) => {
            const Icon = CATEGORY_ICONS[c.id] ?? Gift;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={`/catalogo?cat=${c.id}`}
                  className="group block relative aspect-[3/4] overflow-hidden rounded-2xl shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1"
                >
                  <img
                    src={CATEGORY_IMAGES[c.id]}
                    alt={c.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-background">
                    <Icon className="h-5 w-5 mb-2 opacity-90" />
                    <h3 className="font-display text-xl font-medium">{c.label}</h3>
                    <p className="text-xs opacity-80 line-clamp-2 mt-0.5">{c.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* DESTACADOS */}
      {hasProducts ? (
        <section className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Lo más querido</span>
              <h2 className="font-display text-3xl md:text-4xl mt-1">Seleccionados de la semana</h2>
            </div>
            <Link to="/catalogo" className="text-sm text-foreground hover:underline underline-offset-4">Ver todo →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
          <div className="rounded-3xl bg-secondary/30 border border-border p-12 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Próximamente</span>
            <h2 className="font-display text-3xl md:text-4xl mt-3">Estamos preparando tus regalos 🎁</h2>
            <p className="text-foreground/70 mt-3 max-w-md mx-auto">
              Hemos preparado las categorías con fotos hermosas. Pronto completaremos nuestro catálogo con flores, libros, mate y regalos especiales.
            </p>
            <Button asChild size="lg" className="mt-6 bg-foreground text-background hover:bg-foreground/90 rounded-full">
              <Link to="/contacto">Contanos si buscas algo especial <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      )}

      {/* CONTACT CTA */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-foreground border border-border/50 shadow-elegant p-10 md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-100/30 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-60 w-60 rounded-full bg-orange-100/20 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-amber-700/70">¿Algo a medida?</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight text-foreground">
                Armamos tu regalo <span className="serif-italic text-amber-700">a pedido.</span>
              </h2>
              <p className="mt-4 text-foreground/80 max-w-md leading-relaxed">
                Contanos para quién es, qué le gusta y cuándo lo querés. Te respondemos por WhatsApp
                con una propuesta hecha a tu medida.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full shadow-md">
                  <Link to="/contacto">Contactar <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-full transition-all">
                  <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp directo</a>
                </Button>
              </div>
            </div>
            <ul className="grid gap-3">
              {[
                "Curaduría personal según el destinatario",
                "Tarjetas escritas a mano sin cargo",
                "Envío en Córdoba y zona",
                "Empaque elegante listo para regalar",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-xl bg-white/40 backdrop-blur-sm border border-amber-200/50 p-4 hover:bg-white/60 transition-colors">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-white text-xs font-semibold">✓</span>
                  <span className="text-sm text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
