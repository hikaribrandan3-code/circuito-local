import { Link } from "react-router-dom";
import { useStoreBranding } from "@/lib/useStoreBranding";
import { ArrowUpRight } from "lucide-react";
export function OwnerHeader({ demo = false, ownerId }: { demo?: boolean; ownerId?: string }) {
  const branding = useStoreBranding(ownerId);
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" aria-label="Volver a la tienda" className="flex min-w-0 items-center gap-3">
          <img
            src={branding.logo}
            alt=""
            width="40"
            height="40"
            className="h-10 w-14 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <strong className="block truncate text-sm font-semibold">{branding.name}</strong>
            <small className="mt-1 block text-[11px] text-muted-foreground">
              Panel de tienda{demo ? " · demo" : ""}
            </small>
          </span>
        </Link>
        <Link
          to="/"
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 text-xs font-medium"
        >
          <ArrowUpRight size={16} />
          Ver tienda
        </Link>
      </div>
    </header>
  );
}
