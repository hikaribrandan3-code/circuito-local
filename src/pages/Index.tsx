import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flower2, BookOpen, Coffee, Heart, Gift, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, STORE } from "@/lib/products";
import { InstagramFeed } from "@/components/InstagramFeed";
import { PromoMedia, useHeroMedia } from "@/components/PromoMedia";

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
  const { media: heroMedia, loading: heroLoading } = useHeroMedia();

  // Occasion items — each opens WhatsApp with a pre-filled concierge message
  const OCCASIONS = [
    { emoji: "🎂", label: "Cumpleaños", msg: "Hola! Busco un regalo de cumpleaños especial 🎂 ¿Me ayudás a elegir?" },
    { emoji: "💝", label: "San Valentín", msg: "Hola! Quiero sorprender con un regalo para San Valentín 💝 ¿Qué me recomendás?" },
    { emoji: "🥂", label: "Aniversario", msg: "Hola! Busco algo especial para un aniversario 🥂 ¿Me ayudás a armar algo?" },
    { emoji: "👑", label: "Para ella", msg: "Hola! Busco un regalo para ella 👑 ¿Qué me sugerís?" },
    { emoji: "🎯", label: "Para él", msg: "Hola! Busco un regalo para él 🎯 ¿Qué tenés?" },
    { emoji: "🌸", label: "Sin motivo", msg: "Hola! Quiero regalar algo lindo sin motivo en especial 🌸 ¿Qué me recomendás?" },
    { emoji: "👶", label: "Nacimiento", msg: "Hola! Busco un regalo de bienvenida para un bebé 👶 ¿Qué tenés?" },
    { emoji: "🎓", label: "Graduación", msg: "Hola! Busco un regalo de graduación 🎓 ¿Me ayudás a elegir?" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 pt-10 pb-12 md:pt-20 md:pb-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="min-w-0"
          >
            {/* Urgency badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900 px-3 py-1 text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Enviamos hoy en Córdoba Capital
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> Pedí antes de las 16hs
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight">
              Regalos <span className="serif-italic">boutique</span>
              <br />
              que <span className="serif-italic">cuentan</span> historias.
            </h1>
            <p className="mt-5 max-w-md text-base md:text-lg text-foreground/80 leading-relaxed">
              Armados a mano en 2 horas. Flores, libros, mate y piezas argentinas de diseño — desde $5.000 ARS.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full">
                <Link to="/catalogo">
                  Ver Catálogo <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              {/* VIP WhatsApp concierge CTA */}
              <a
                href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent("Hola! Me gustaría que me ayudes a elegir un regalo especial 🎁")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 sm:gap-2 rounded-full px-1.5 sm:px-4 py-0.5 sm:py-1.5 text-[7px] sm:text-sm font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition-transform whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}
              >
                <svg className="h-2.5 sm:h-4 w-2.5 sm:w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="hidden sm:inline">Hablá con tu Personal Shopper</span>
                <span className="sm:hidden">Personal Shopper</span>
              </a>
            </div>

            {/* Trust micro-signals — scrolling marquee */}
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .marquee-container { overflow: hidden; }
              .marquee { display: flex; gap: 2.5rem; animation: marquee 15s linear infinite; white-space: nowrap; }
              .marquee:hover { animation-play-state: paused; }
            `}</style>
            <div className="mt-8 marquee-container bg-foreground/5 rounded-2xl border border-border/50 py-3 px-4">
              <div className="marquee">
                {/* Repeat twice for seamless loop */}
                {[...Array(2)].map((_, rep) => (
                  <div key={rep} className="flex gap-2.5 items-center">
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Zap className="h-4 w-4 text-amber-500" />
                      Listo en 2hs
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                      </svg>
                      Empaque elegante
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      Tarjeta a mano
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
                    <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/>
                      </svg>
                      Envío todo el país
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {(heroLoading || heroMedia) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative min-w-0 w-full overflow-hidden"
            >
              <PromoMedia media={heroMedia} loading={heroLoading} />
              {heroMedia && (
                <>
                  <div className="hidden md:flex absolute -top-4 -right-4 items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 shadow-elegant">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span className="text-xs font-medium tracking-wider uppercase">Hecho a mano</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 hidden md:flex flex-col items-center justify-center rounded-2xl bg-background border border-border shadow-elegant px-4 py-3">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Desde</span>
                    <span className="font-display text-xl font-bold">$5.000</span>
                    <span className="text-[10px] text-muted-foreground">ARS</span>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Argentine flag accent strip */}
        <div className="h-1 w-full bg-gradient-to-r from-celeste via-background to-celeste" />
      </section>

      {/* OCCASION STRIP */}
      <section className="border-y border-border/60 bg-card/40 py-5 overflow-hidden">
        <style>{`
          @keyframes occasion-loop { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .occasion-track { display: flex; gap: 0.5rem; width: max-content; animation: occasion-loop 24s linear infinite; }
          .occasion-track:hover { animation-play-state: paused; }
        `}</style>
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-1 mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">¿Cuál es la ocasión?</span>
          </div>
        </div>
        {/* Duplicate items so the loop is seamless */}
        <div className="occasion-track">
          {[...OCCASIONS, ...OCCASIONS].map((o, i) => (
            <a
              key={`${o.label}-${i}`}
              href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(o.msg)}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-foreground hover:text-background hover:border-foreground transition-all whitespace-nowrap"
            >
              <span>{o.emoji}</span>
              {o.label}
            </a>
          ))}
        </div>
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
        <section className="mx-auto max-w-7xl px-4 lg:px-8 py-8 md:py-12">
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

      {/* INSTAGRAM FEED */}
      <InstagramFeed />
    </div>
  );
}
