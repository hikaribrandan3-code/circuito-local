import { Routes, Route, Link } from "react-router-dom";
import { Instagram, MessageCircle, Phone } from "lucide-react";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import { STORE } from "@/lib/products";
import Index from "@/pages/Index";
import Catalogo from "@/pages/Catalogo";
import Contacto from "@/pages/Contacto";
import Carrito from "@/pages/Carrito";
import Producto from "@/pages/Producto";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        {/* Announcement bar */}
        <div className="bg-foreground text-background text-center py-2.5 px-4 text-xs tracking-wide font-medium">
          🎁 Regalos armados en 2hs &nbsp;·&nbsp; Enviamos hoy en Córdoba Capital &nbsp;·&nbsp; Pedí antes de las 16hs
        </div>
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="border-t border-border/60 mt-8 bg-card/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-3">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img src="/logo.svg" alt="ASB Store" className="h-9 w-9 object-contain" />
                <p className="font-display text-2xl font-semibold">{STORE.name}</p>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm max-w-xs">{STORE.tagline}</p>
              <a
                href={STORE.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 mt-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-foreground hover:text-background transition-all group"
              >
                <Instagram className="h-4 w-4 group-hover:text-background" />
                @asb.tore
              </a>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">Contacto</p>
              <a
                href={`https://wa.me/${STORE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm font-medium hover:text-foreground/70 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-green-600 shrink-0" />
                {STORE.phone} — WhatsApp
              </a>
              <a
                href={`tel:${STORE.phone}`}
                className="flex items-center gap-3 text-sm hover:text-foreground/70 transition-colors"
              >
                <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                {STORE.phone}
              </a>
              <a
                href={STORE.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm font-semibold hover:text-foreground/70 transition-colors"
              >
                <Instagram className="h-5 w-5 text-pink-500 shrink-0" />
                @asb.tore
              </a>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">Navegación</p>
              <div className="flex flex-col gap-2.5">
                <Link to="/catalogo" className="text-sm hover:text-foreground text-foreground/80 transition-colors hover:translate-x-0.5 transform">Catálogo</Link>
                <Link to="/contacto" className="text-sm hover:text-foreground text-foreground/80 transition-colors hover:translate-x-0.5 transform">Contacto</Link>
                <a
                  href={STORE.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-500 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
                <Link to="/admin/login" className="text-sm opacity-40 hover:opacity-70 text-muted-foreground transition-opacity">Admin</Link>
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
