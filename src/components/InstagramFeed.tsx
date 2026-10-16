import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STORE } from "@/lib/products";

type Post = { id: string; image_url: string; caption: string | null };

export function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    supabase
      .from("gallery_posts")
      .select("id, image_url, caption")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setPosts((data ?? []) as Post[]));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-24">
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
            @asb.store
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

      <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
        {posts.map((post) => (
          <a
            key={post.id}
            href={STORE.instagram}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg md:rounded-xl bg-secondary"
          >
            <img
              src={post.image_url}
              alt={post.caption ?? ""}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(240,148,51,0.7) 0%,rgba(230,104,60,0.7) 25%,rgba(220,39,67,0.7) 50%,rgba(188,24,136,0.7) 100%)",
              }}
            >
              <Instagram className="h-6 w-6 text-white drop-shadow" />
            </div>
          </a>
        ))}
      </div>

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
