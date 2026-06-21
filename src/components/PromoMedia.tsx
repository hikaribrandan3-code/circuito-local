import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Media = { url: string; type: "image" | "video" };

export function PromoMedia() {
  const [media, setMedia] = useState<Media | null>(null);
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

  if (loading) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-secondary animate-pulse shadow-elegant" />
    );
  }

  if (!media) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-secondary border-2 border-dashed border-border shadow-elegant flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <ImageIcon className="h-10 w-10 opacity-30" />
        <p className="text-xs text-center opacity-50 px-4">
          Agregá una imagen o video desde el panel admin → Info → Media del Hero
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl shadow-elegant bg-secondary">
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
