import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { FooterOption1 } from "@/components/FooterOptions";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import { demoStore } from "@/lib/storeConfig";
import { RouteBoundary } from "@/components/RouteBoundary";
const Catalogo = lazy(() => import("@/pages/Catalogo"));
const Contacto = lazy(() => import("@/pages/Contacto"));
const Carrito = lazy(() => import("@/pages/Carrito"));
const Producto = lazy(() => import("@/pages/Producto"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminDemo = lazy(() => import("@/pages/AdminDemo"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

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
        <main key={location.pathname} className="page-enter min-w-0 flex-1">
          <RouteBoundary key={location.pathname}>
            <Suspense
              fallback={
                <div
                  role="status"
                  className="mx-auto min-h-[50vh] max-w-5xl px-5 py-16 text-center text-sm text-muted-foreground"
                >
                  Un momento…
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/producto/:id" element={<Producto />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/demo" element={<AdminDemo />} />
                <Route
                  path="/admin"
                  element={demoStore ? <Navigate to="/admin/demo" replace /> : <AdminDashboard />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </RouteBoundary>
        </main>
        {!isAdminRoute && <FooterOption1 />}
        {!isAdminRoute && <MobileNav />}

        <Toaster theme="light" position="top-center" />
      </div>
    </CartProvider>
  );
}
