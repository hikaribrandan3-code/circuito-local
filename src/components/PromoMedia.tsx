// ============================================================
//  PROMO MEDIA — the hero slot on the home page.
//  To swap between a photo and a video, edit PROMO below.
//  - type: "image"  → set `src` to an image URL
//  - type: "video"  → set `src` to an .mp4 URL, `poster` to a fallback image
//  Drop files in /public and reference like "/mi-video.mp4".
// ============================================================
const PROMO: {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
} = {
  type: "image",
  src: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=80",
  poster: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=80",
  alt: "Ramo artesanal de peonías",
};

export function PromoMedia() {
  return (
    <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-3xl shadow-elegant bg-secondary">
      {PROMO.type === "video" ? (
        <video
          className="h-full w-full object-cover"
          src={PROMO.src}
          poster={PROMO.poster}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={PROMO.src}
          alt={PROMO.alt}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
