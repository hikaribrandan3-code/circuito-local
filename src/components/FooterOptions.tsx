import { Link } from "react-router-dom";

// FOOTER OPTION 1 — App-style centered column.
// Borrows the Contact-page card aesthetic (IG gradient + WhatsApp cards).
// Coffee/amber in light mode, Spotify-black in dark mode. Lock = admin gateway.
export const FooterOption1 = () => (
  <footer className="bg-amber-50 text-foreground dark:bg-black dark:text-white">
    <div className="mx-auto max-w-md px-6 py-14 flex flex-col items-center text-center">
      {/* Brand */}
      <img src="/logo.svg" alt="ASB Store" className="h-12 w-12 object-contain dark:filter dark:invert" />
      <p className="mt-3 font-display text-2xl font-bold">ASB Store</p>
      <p className="mt-1 text-sm text-amber-700 dark:text-gray-400 max-w-xs">
        Regalos boutique armados a mano en Córdoba Capital.
      </p>

      {/* Cards (borrowed from Contact page) */}
      <div className="mt-8 w-full space-y-3">
        {/* Instagram gradient card */}
        <a
          href="https://www.instagram.com/asb.tore/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 text-white p-4 hover:opacity-95 transition shadow-md text-left"
        >
          <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/70">Instagram</p>
            <p className="font-display text-lg font-semibold leading-tight">@asb.tore</p>
          </div>
        </a>

        {/* WhatsApp card */}
        <a
          href="https://wa.me/543516459100"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-4 rounded-2xl bg-foreground text-background p-4 hover:opacity-95 transition text-left"
        >
          <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-background/60">WhatsApp</p>
            <p className="font-display text-lg font-semibold leading-tight">3516459100</p>
          </div>
        </a>
      </div>

      {/* Nav links */}
      <div className="mt-8 flex items-center justify-center gap-6 text-sm font-medium">
        <Link to="/catalogo" className="hover:text-amber-700 dark:hover:text-gray-300 transition">Catálogo</Link>
        <Link to="/contacto" className="hover:text-amber-700 dark:hover:text-gray-300 transition">Contacto</Link>
        <Link to="/carrito" className="hover:text-amber-700 dark:hover:text-gray-300 transition">Carrito</Link>
      </div>

      {/* Hours */}
      <p className="mt-6 text-xs text-amber-700 dark:text-gray-500">
        Lun a Sáb · 9:30 a 19:30 &nbsp;·&nbsp; Envío hoy en Córdoba
      </p>

      {/* Admin gateway — lock icon */}
      <Link
        to="/admin/login"
        aria-label="Acceso administrador"
        className="mt-8 inline-flex items-center justify-center h-10 w-10 rounded-full border border-amber-300 dark:border-gray-700 text-amber-600 dark:text-gray-500 hover:bg-amber-100 dark:hover:bg-gray-900 hover:text-amber-800 dark:hover:text-gray-300 transition"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4ZM7 13V9H9V13H7Z" />
        </svg>
      </Link>

      {/* Copyright */}
      <p className="mt-8 text-xs text-amber-700 dark:text-gray-500">
        © {new Date().getFullYear()} ASB Store · Hecho con cariño en Argentina 🇦🇷
      </p>
    </div>
  </footer>
);

// FOOTER OPTION 2: Modern Cards
export const FooterOption2 = () => (
  <footer className="bg-gradient-to-b from-background to-secondary/20">
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Brand Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="ASB Store" className="h-8 w-8 object-contain" />
            <p className="font-display text-xl font-bold">ASB Store</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Boutique de regalos armados a mano. Desde Córdoba Capital hacia todo el país.
          </p>
          <a href="https://www.instagram.com/asb.tore/" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full border border-pink-200 text-pink-700 text-sm font-medium hover:bg-pink-50 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Seguir @asb.tore
          </a>
        </div>

        {/* Contact Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Contacto</p>
          <div className="space-y-3">
            <a href="https://wa.me/543516459100" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm hover:text-foreground text-foreground/70 transition"
            >
              <div className="h-2 w-2 rounded-full bg-green-500" />
              3516459100 — WhatsApp
            </a>
            <a href="tel:3516459100" className="flex items-center gap-2 text-sm hover:text-foreground text-foreground/70 transition">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              Llamada directa
            </a>
          </div>
          <div className="pt-3 border-t border-border space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Atención</p>
            <p className="text-xs text-foreground/60">Lun - Sáb · 9:30 a 19:30</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Envíos</p>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li className="flex gap-2">
              <span>✓</span> <span>Córdoba Capital en el día</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span> <span>Pedí antes de las 16hs</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span> <span>Todo el país en 48-72hs</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ASB Store · Hecho con cariño en Argentina 🇦🇷
      </div>
    </div>
  </footer>
);

// FOOTER OPTION 3: Bold Gradient (Energetic Marketplace)
export const FooterOption3 = () => (
  <footer className="bg-gradient-to-r from-amber-900 via-orange-900 to-red-900 text-white">
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <img src="/logo.svg" alt="ASB Store" className="h-10 w-10 object-contain filter drop-shadow" />
            <p className="font-display text-2xl font-bold drop-shadow">ASB</p>
          </div>
          <p className="text-orange-100 text-sm leading-relaxed">
            Regalos boutique que cuentan historias. Armados a mano en Córdoba.
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-orange-200 font-bold">Contacto Rápido</p>
          <div className="space-y-2.5">
            <a href="https://wa.me/543516459100" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm hover:text-yellow-200 transition font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-green-300" />
              WhatsApp
            </a>
            <a href="tel:3516459100" className="flex items-center gap-2 text-sm hover:text-yellow-200 transition font-medium">
              <span className="h-2 w-2 rounded-full bg-blue-300" />
              3516459100
            </a>
            <a href="https://www.instagram.com/asb.tore/" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm hover:text-yellow-200 transition font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-pink-300" />
              @asb.tore
            </a>
          </div>
        </div>

        {/* Tienda */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-orange-200 font-bold">Tienda</p>
          <div className="space-y-2">
            <a href="/catalogo" className="block text-sm hover:text-yellow-200 transition">Catálogo</a>
            <a href="/contacto" className="block text-sm hover:text-yellow-200 transition">Contacto</a>
            <a href="/carrito" className="block text-sm hover:text-yellow-200 transition">Carrito</a>
          </div>
        </div>

        {/* Promesa */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-widest text-orange-200 font-bold">Garantía</p>
          <div className="space-y-2 text-sm text-orange-100">
            <p className="flex gap-2"><span>🎁</span> Armado en 2hs</p>
            <p className="flex gap-2"><span>🚚</span> Envío en el día</p>
            <p className="flex gap-2"><span>✍️</span> Tarjeta a mano</p>
          </div>
        </div>
      </div>

      <div className="border-t border-orange-700 py-6 text-center text-xs text-orange-200">
        © {new Date().getFullYear()} ASB Store · Hecho con cariño en Argentina 🇦🇷
      </div>
    </div>
  </footer>
);
