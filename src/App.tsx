import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FooterOption1 } from "@/components/FooterOptions";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Catalogo from "@/pages/Catalogo";
import Contacto from "@/pages/Contacto";
import Carrito from "@/pages/Carrito";
import Producto from "@/pages/Producto";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminDemo from "@/pages/AdminDemo";
import NotFound from "@/pages/NotFound";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.search]);

  return (
    <CartProvider>
      <div
        className={`flex min-h-screen flex-col ${isAdminRoute ? "" : "storefront customer-shell"}`}
      >
        {/* Announcement bar — hidden on admin routes */}
        {!isAdminRoute && (
          <div className="bg-foreground text-background text-center py-2 px-4 text-[10px] tracking-[0.18em] font-medium">
            R&E URBAN STYLE &nbsp; / &nbsp; HOMBRE · MUJER · ACCESORIOS
          </div>
        )}
        {!isAdminRoute && <Header />}
        <main className="min-w-0 flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/demo" element={<AdminDemo />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminRoute && <FooterOption1 />}
        {!isAdminRoute && <MobileNav />}

        <Toaster theme="light" position="top-center" />
      </div>
    </CartProvider>
  );
}
