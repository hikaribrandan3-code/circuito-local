import { Routes, Route, useLocation } from "react-router-dom";
import { FooterOption1 } from "@/components/FooterOptions";
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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        {/* Announcement bar — hidden on admin routes */}
        {!isAdminRoute && (
          <div className="bg-foreground text-background dark:bg-card dark:text-muted-foreground dark:border-b dark:border-border text-center py-2.5 px-4 text-xs tracking-wide font-medium">
            🎁 Regalos armados en 2hs &nbsp;·&nbsp; Enviamos hoy en Córdoba Capital &nbsp;·&nbsp; Pedí antes de las 16hs
          </div>
        )}
        {!isAdminRoute && <Header />}
        <main className="flex-1 pb-28 md:pb-0">
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
        {!isAdminRoute && <FooterOption1 />}
        {!isAdminRoute && <MobileNav />}
        {!isAdminRoute && <WhatsAppButton />}
        <Toaster theme="light" position="top-center" />
      </div>
    </CartProvider>
  );
}
