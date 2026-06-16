import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Lo que buscás no existe o se mudó. Volvé al inicio y seguí explorando.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
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
      { title: "Circuito — Tecnología premium, precios de segunda" },
      {
        name: "description",
        content:
          "Marketplace argentino de tech reacondicionada premium: iPhones, gaming, fotografía y accesorios. Comprá o vendé tu equipo.",
      },
      { name: "author", content: "Circuito" },
      { property: "og:title", content: "Circuito — Tecnología premium, precios de segunda" },
      {
        property: "og:description",
        content:
          "Comprá y vendé tecnología usada de primera línea en Argentina. Garantía, condición verificada y envíos a todo el país.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Circuito — Tecnología premium, precios de segunda" },
      { name: "description", content: "Circuito Tech is an e-commerce marketplace for buying and selling refurbished electronics in Argentina." },
      { property: "og:description", content: "Circuito Tech is an e-commerce marketplace for buying and selling refurbished electronics in Argentina." },
      { name: "twitter:description", content: "Circuito Tech is an e-commerce marketplace for buying and selling refurbished electronics in Argentina." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/59424aba-26b7-4ba4-ab10-c8c1ddfdafff/id-preview-ec69c3a8--9b686c43-231f-4219-9bac-a618b92272ff.lovable.app-1776710531071.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/59424aba-26b7-4ba4-ab10-c8c1ddfdafff/id-preview-ec69c3a8--9b686c43-231f-4219-9bac-a618b92272ff.lovable.app-1776710531071.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
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
        <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Circuito · Tecnología circular hecha en Argentina 🇦🇷
        </footer>
        <MobileNav />
        <WhatsAppButton />
        <Toaster theme="light" position="top-center" />
      </div>
    </CartProvider>
  );
}
