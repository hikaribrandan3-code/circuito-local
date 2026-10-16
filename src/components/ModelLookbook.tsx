import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const looks = [
  { image: "lookbook-tokyo.webp", title: "Tokyo · azul", detail: "Un clásico con actitud" },
  { image: "lookbook-web-back.webp", title: "Web · espalda", detail: "Gráfica protagonista" },
  {
    image: "lookbook-chain-front.webp",
    title: "Cross · negro",
    detail: "Oversize para todos los días",
  },
  { image: "lookbook-white-front.webp", title: "Gráfica · blanco", detail: "Simple, con carácter" },
  { image: "lookbook-web-pose.webp", title: "Web · street", detail: "Un look relajado" },
  { image: "lookbook-chain-walk.webp", title: "Cross · en movimiento", detail: "Urbano y cómodo" },
  {
    image: "lookbook-white-profile.webp",
    title: "Gráfica · perfil",
    detail: "Detalles que destacan",
  },
];

export function ModelLookbook() {
  const track = useRef<HTMLDivElement>(null);
  const move = (direction: number) => {
    const firstCard = track.current?.querySelector<HTMLElement>("[data-look-card]");
    if (!track.current || !firstCard) return;
    const gap = Number.parseFloat(getComputedStyle(track.current).columnGap) || 16;
    track.current.scrollBy({ left: direction * (firstCard.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <section className="mt-9" aria-labelledby="model-lookbook-title">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-muted-foreground">
            R&E en la calle
          </p>
          <h2 id="model-lookbook-title" className="mt-1 text-lg font-medium">
            Looks de la colección
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => move(-1)}
            className="round-control"
            aria-label="Look anterior"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            className="round-control"
            aria-label="Siguiente look"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div
        ref={track}
        className="store-gallery-track -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:-mx-8 sm:gap-4 sm:px-8 lg:-mx-8 lg:px-8"
        role="region"
        aria-label="Deslizá para ver los siete looks de R&E"
        tabIndex={0}
      >
        {looks.map((look, index) => (
          <article
            key={look.image}
            data-look-card
            className="group relative aspect-[4/5] w-[76vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[1.6rem] bg-neutral-200 sm:w-[280px] lg:w-[300px]"
          >
            <img
              src={`/images/${look.image}`}
              alt={`${look.title}, modelo R&E con prendas urbanas`}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-5 pb-5 pt-16 text-white">
              <p className="text-sm font-medium">{look.title}</p>
              <p className="mt-1 text-xs text-white/75">{look.detail}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">
        Lookbook de muestra · fotos de campaña inspiradas en prendas del local.
      </p>
    </section>
  );
}
