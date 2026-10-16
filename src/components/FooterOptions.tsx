import { Link } from "react-router-dom";
import { LockKeyhole, Instagram, ArrowUpRight } from "lucide-react";
import { adminEntry } from "@/lib/storeConfig";
import { STORE } from "@/lib/products";
export const FooterOption1 = () => (
  <footer className="mx-auto mt-7 w-full max-w-7xl px-5 pb-3 pt-3 lg:px-8">
    <div className="grid grid-cols-2 gap-x-5 gap-y-3 border-t border-black/20 pt-4 sm:grid-cols-[1.1fr_1fr_1fr_1.2fr] sm:gap-y-2">
      <Link to="/" aria-label="R&E Urban Style · Inicio" className="self-center">
        <img
          src="/re-logo.svg"
          alt="R&E Urban Style"
          width="120"
          height="60"
          className="h-12 w-24 object-contain object-left"
        />
      </Link>
      <nav aria-label="Enlaces del pie" className="grid content-start text-xs">
        <Link className="flex min-h-11 items-center" to="/">
          Inicio
        </Link>
        <Link className="flex min-h-11 items-center" to="/catalogo">
          Catálogo
        </Link>
        <Link className="flex min-h-11 items-center" to="/contacto">
          Contacto
        </Link>
      </nav>
      <nav aria-label="Categorías del pie" className="grid content-start text-xs">
        <Link className="flex min-h-11 items-center" to="/catalogo?cat=hombre">
          Hombre
        </Link>
        <Link className="flex min-h-11 items-center" to="/catalogo?cat=mujer">
          Mujer
        </Link>
        <Link className="flex min-h-11 items-center" to="/catalogo?cat=accesorios">
          Accesorios
        </Link>
      </nav>
      <div className="border-l border-black/20 pl-5 text-xs">
        <div className="flex items-center gap-2">
          <a
            href={STORE.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram de R&E"
            className="grid h-11 w-11 place-items-center"
          >
            <Instagram size={25} />
          </a>
          {STORE.tiktok && (
            <a
              href={STORE.tiktok}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-1"
            >
              TikTok <ArrowUpRight size={15} />
            </a>
          )}
        </div>
        <p className="mt-2 font-medium">Seguinos</p>
        <p className="mt-1 leading-relaxed text-muted-foreground">
          Ropa urbana.
          <br />
          Tu forma de llevarla.
        </p>
      </div>
    </div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
      <p>© {new Date().getFullYear()} R&E Urban Style. Todos los derechos reservados.</p>
      <div className="ml-auto flex items-center gap-1">
        <span>Córdoba, Argentina.</span>
        <Link
          to={adminEntry}
          aria-label="Acceso del propietario"
          className="grid h-11 w-11 place-items-center rounded-full text-black/45 hover:bg-black/5 hover:text-black"
        >
          <LockKeyhole size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  </footer>
);
export const FooterOption2 = FooterOption1;
export const FooterOption3 = FooterOption1;
