import { Instagram } from "lucide-react";
import { STORE } from "@/lib/products";

// Replace these URLs with real screenshot URLs from his Instagram posts
// e.g. download post images and upload to Supabase Storage, then paste URLs here
const POSTS = [
  {
    url: "https://images.unsplash.com/photo-1549465120-7ccae1a7d4d6?auto=format&fit=crop&w=600&q=80",
    caption: "Caja de regalo curada ✨",
  },
  {
    url: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
    caption: "Ramo artesanal de peonías 🌸",
  },
  {
    url: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=600&q=80",
    caption: "Detalles que hacen la diferencia 💛",
  },
  {
    url: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80",
    caption: "Empaque listo para regalar 🎁",
  },
  {
    url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80",
    caption: "Tarjeta escrita a mano sin cargo 💌",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
    caption: "Aromas que enamoran 🌿",
  },
];

export function InstagramFeed() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seguinos</span>
          <h2 className="font-display text-3xl md:text-4xl mt-1 flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center rounded-xl p-1.5"
              style={{
                background: "linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
              }}
            >
              <Instagram className="h-5 w-5 text-white" />
            </span>
            @asb.tore
          </h2>
        </div>
        <a
          href={STORE.instagram}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-foreground hover:text-background transition-all"
        >
          <Instagram className="h-4 w-4" />
          Seguir
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
        {POSTS.map((post, i) => (
          <a
            key={i}
            href={STORE.instagram}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg md:rounded-xl bg-secondary"
          >
            <img
              src={post.url}
              alt={post.caption}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Instagram gradient overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(240,148,51,0.7) 0%,rgba(230,104,60,0.7) 25%,rgba(220,39,67,0.7) 50%,rgba(188,24,136,0.7) 100%)",
              }}
            >
              <Instagram className="h-6 w-6 text-white drop-shadow" />
            </div>
          </a>
        ))}
      </div>

      {/* Mobile follow CTA */}
      <div className="mt-6 flex sm:hidden justify-center">
        <a
          href={STORE.instagram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
          }}
        >
          <Instagram className="h-4 w-4" />
          Seguir en Instagram
        </a>
      </div>
    </section>
  );
}
