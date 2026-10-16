import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
const STORE_GALLERY = [
  { src: "img_1498.webp", alt: "Tops de la colección de mujer" },
  { src: "img_1499.webp", alt: "Prendas de mujer de la colección" },
  { src: "ig-womens-butterfly-look.webp", alt: "Modelo con remera blanca estampada" },
  { src: "ig-womens-white-butterfly.webp", alt: "Remera blanca con estampa violeta" },
  { src: "img_1489.webp", alt: "Remeras claras en exhibición" },
  { src: "img_1496.webp", alt: "Selección de prendas del local" },
  { src: "img_1492.webp", alt: "Detalle de una prenda" },
  { src: "new-1483-dark-denim.webp", alt: "Jean baggy oscuro" },
  { src: "new-1457-grey-denim.webp", alt: "Jean baggy gris" },
  { src: "img_1445.webp", alt: "Percheros con prendas de la colección" },
  { src: "img_1446.webp", alt: "Remera gráfica azul" },
  { src: "new-1456-web-back.webp", alt: "Remera gráfica con estampa trasera" },
  { src: "new-1458-cross-tee.webp", alt: "Remera negra con estampa urbana" },
  { src: "new-1459-cross-detail.webp", alt: "Detalle de estampa urbana" },
  { src: "img_1447.webp", alt: "Remeras y accesorios de la tienda" },
  { src: "img_1488.webp", alt: "Remera de la colección" },
  { src: "img_1455.webp", alt: "Prendas de la colección" },
  { src: "img_1448.webp", alt: "Gorra de la colección" },
  { src: "img_1453.webp", alt: "Gorra bordada en exhibición" },
  { src: "img_1469.webp", alt: "Accesorios de la tienda" },
  { src: "new-1489-rack-white-tee.webp", alt: "Remera clara en percha" },
  { src: "img_1474.webp", alt: "Rincón de exhibición de prendas" },
  { src: "img_1472.webp", alt: "Vista del interior del local" },
  { src: "img_1456.webp", alt: "Detalle de una remera de la colección" },
  { src: "ig-raglan-heart-tees.webp", alt: "Remeras raglán en varios colores" },
  { src: "ig-raglan-classic-tees.webp", alt: "Remeras raglán estampadas" },
  { src: "ig-mens-black-look.webp", alt: "Look urbano con remera negra y shorts" },
  { src: "ig-mens-white-tee-look.webp", alt: "Look urbano con remera blanca y bermuda" },
  { src: "ig-mens-grey-short-look.webp", alt: "Look con remera gris y shorts baggy" },
  { src: "ig-mens-grey-shorts-back.webp", alt: "Detalle trasero de bermuda baggy" },
  { src: "ig-angel-print-tees.webp", alt: "Remeras con estampa de alas" },
  { src: "ig-web-spider-tees.webp", alt: "Remeras gráficas con estampa tribal" },
  { src: "ig-graphic-shorts-set.webp", alt: "Shorts estampados en negro y gris" },
  { src: "ig-tribal-shorts-set.webp", alt: "Shorts baggy con estampa urbana" },
  { src: "ig-dark-denim-shorts.webp", alt: "Bermuda de jean baggy oscuro" },
  { src: "ig-white-graphic-hoodie.webp", alt: "Buzo blanco con estampa gráfica" },
];

export function StoreGallery() {
  const track = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const move = (direction: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <section className="reveal-section mt-12 border-t border-black/5 pt-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground">
            R&E por dentro
          </p>
          <h2 className="mt-1 text-xl font-medium">Desde el local</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Fotos anteriores"
            className="round-control"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Fotos siguientes"
            className="round-control"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={track}
        className="store-gallery-track flex snap-x snap-mandatory gap-3 overflow-x-auto"
      >
        {STORE_GALLERY.map((item) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setPhoto(item.src)}
            aria-label={`Ampliar ${item.alt}`}
            className="h-72 w-52 shrink-0 snap-start overflow-hidden rounded-2xl bg-white sm:h-80 sm:w-60"
          >
            <img
              src={`/images/gallery/${item.src}`}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              width="960"
              height="1200"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-between gap-4 text-xs">
        <p className="text-muted-foreground">Deslizá por prendas, accesorios y el local.</p>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="underline underline-offset-4"
        >
          {expanded ? "Ver menos" : `Ver las ${STORE_GALLERY.length} fotos`}
        </button>
      </div>
      {expanded && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STORE_GALLERY.map((item) => (
            <button
              key={item.src}
              onClick={() => setPhoto(item.src)}
              aria-label={`Ampliar ${item.alt}`}
              className="aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img
                loading="lazy"
                decoding="async"
                width="960"
                height="1200"
                src={`/images/gallery/${item.src}`}
                alt={item.alt}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <Dialog
        open={!!photo}
        onOpenChange={(open) => {
          if (!open) setPhoto(null);
        }}
      >
        <DialogContent className="max-w-3xl rounded-3xl">
          <DialogTitle>Desde el local</DialogTitle>
          <DialogDescription>R&E Urban Style</DialogDescription>
          {photo && (
            <img
              src={`/images/gallery/${photo}`}
              alt={STORE_GALLERY.find((item) => item.src === photo)?.alt}
              className="max-h-[70vh] w-full rounded-xl object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
