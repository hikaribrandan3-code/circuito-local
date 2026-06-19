import { Routes, Route, Link } from "react-router-dom";
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
                <a href={`https://instagram.com/${STORE.instagram.slice(1)}`} target="_blank" rel="noreferrer" className="hover:text-foreground text-muted-foreground text-[11px]">Instagram</a>
                <Link to="/admin/login" className="hover:text-foreground text-muted-foreground text-[11px] opacity-60 hover:opacity-100">Admin</Link>
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
