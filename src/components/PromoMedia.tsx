import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type HeroMedia = { url: string; type: "image" | "video" };

export function useHeroMedia() {
  const [media, setMedia] = useState<HeroMedia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("hero_media_url, hero_media_type")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.hero_media_url) {
          setMedia({
            url: data.hero_media_url,
            type: (data.hero_media_type as "image" | "video") || "image",
          });
        }
        setLoading(false);
      });
  }, []);

  return { media, loading };
}

export function PromoMedia({ media, loading }: { media: HeroMedia | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-3xl bg-secondary animate-pulse shadow-elegant" />
    );
  }

  if (!media) return null;

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-3xl shadow-elegant bg-secondary">
      {media.type === "video" ? (
        <video
          className="h-full w-full object-cover"
          src={media.url}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={media.url}
          alt="Hero"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
