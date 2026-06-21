// FOOTER OPTION 1: Responsive (Coffee/Brown light mode, Dark Spotify dark mode)
export const FooterOption1 = () => (
  <footer className="bg-amber-50 text-foreground dark:bg-black dark:text-white">
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 grid gap-12 md:grid-cols-4">
      {/* Brand */}
      <div className="space-y-4">
        <img src="/logo.svg" alt="ASB Store" className="h-8 w-8 object-contain dark:filter dark:invert" />
        <p className="font-display text-lg font-bold">ASB Store</p>
        <p className="text-amber-700 dark:text-gray-400 text-sm leading-relaxed">Regalos boutique armados a mano en Córdoba Capital.</p>
      </div>

      {/* Contact */}
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-amber-900 dark:text-gray-500 font-bold">Contacto</p>
        <div className="space-y-3">
          <a href="https://wa.me/543516459100" target="_blank" rel="noreferrer" className="block text-sm text-amber-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition">
            WhatsApp
          </a>
          <a href="tel:3516459100" className="block text-sm text-amber-900 dark:text-white dark:hover:text-gray-300 hover:text-amber-700 transition">
            3516459100
          </a>
          <a href="https://www.instagram.com/asb.tore/" target="_blank" rel="noreferrer" className="block text-sm text-amber-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition">
            Instagram @asb.tore
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-amber-900 dark:text-gray-500 font-bold">Tienda</p>
        <div className="space-y-3">
          <a href="/catalogo" className="block text-sm text-amber-900 dark:text-white hover:text-amber-700 dark:hover:text-gray-300 transition">Catálogo</a>
          <a href="/contacto" className="block text-sm text-amber-900 dark:text-white hover:text-amber-700 dark:hover:text-gray-300 transition">Contacto</a>
          <a href="/admin/login" className="block text-sm text-amber-600 dark:text-gray-500 hover:text-amber-700 dark:hover:text-gray-300 transition">Admin</a>
        </div>
      </div>

      {/* Hours */}
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-amber-900 dark:text-gray-500 font-bold">Atención</p>
        <div className="space-y-2 text-sm text-amber-800 dark:text-gray-400">
          <p>Lun - Sáb · 9:30 a 19:30</p>
          <p>Envío en Córdoba en el día</p>
          <p className="text-xs">Pedí antes de las 16hs</p>
        </div>
      </div>
    </div>
    <div className="border-t border-amber-200 dark:border-gray-800 py-6 text-center text-xs text-amber-700 dark:text-gray-500">
      © {new Date().getFullYear()} ASB Store · Hecho con cariño en Argentina 🇦🇷
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
