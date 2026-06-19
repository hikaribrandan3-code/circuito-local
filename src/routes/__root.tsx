import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "@/components/ui/sonner";
import { STORE } from "@/lib/products";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold">404</h1>
        <h2 className="mt-4 text-xl font-medium">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Lo que buscás no existe o se mudó. Volvé al inicio y seguí descubriendo regalos.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          Ir al inicio
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ABS Store — Regalos curados con alma argentina" },
      {
        name: "description",
        content:
          "Boutique de regalos en Argentina: flores frescas, libros, mate, piezas argentinas y cajas curadas. Hechos con dedicación para personas con buen gusto.",
      },
      { name: "author", content: "ABS Store" },
      { property: "og:title", content: "ABS Store — Regalos curados con alma argentina" },
      {
        property: "og:description",
        content:
          "Flores, libros, mate y regalos argentinos seleccionados a mano. Envíos en el día.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ABS Store — Regalos curados" },
      { name: "twitter:description", content: "Boutique de regalos argentina: flores, libros, mate y más." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
        <footer className="border-t border-border/60 mt-8">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 grid gap-6 md:grid-cols-3 text-sm">
            <div>
              <p className="font-display text-xl font-semibold">{STORE.name}</p>
              <p className="mt-1 text-muted-foreground">{STORE.tagline}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Contacto</p>
              <p className="mt-2">{STORE.phone}</p>
              <a className="text-muted-foreground hover:text-foreground" href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Navegación</p>
              <div className="mt-2 flex flex-col gap-1">
                <Link to="/catalogo" className="hover:text-foreground text-muted-foreground">Catálogo</Link>
                <Link to="/contacto" className="hover:text-foreground text-muted-foreground">Contacto</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} {STORE.name} · Hecho con cariño en Argentina 🇦🇷
          </div>
        </footer>
        <MobileNav />
        <WhatsAppButton />
        <Toaster theme="light" position="top-center" />
      </div>
    </CartProvider>
  );
}
