import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "@/lib/cart";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Catalogo from "@/pages/Catalogo";
import Producto from "@/pages/Producto";
import Carrito from "@/pages/Carrito";
import Contacto from "@/pages/Contacto";
import NotFound from "@/pages/NotFound";

const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminFallback = () => (
  <div className="min-h-screen grid place-items-center text-muted-foreground">
    Cargando administración…
  </div>
);

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen grid place-items-center p-6 text-center">
              <div>
                <p className="font-display text-4xl">Tu tienda local, en un link.</p>
                <p className="mt-3 text-muted-foreground">
                  Ingresá a tu tienda con su enlace o administrala desde aquí.
                </p>
                <a className="mt-6 inline-block underline" href="/admin">
                  Administrar mi tienda
                </a>
              </div>
            </div>
          }
        />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route path="/:storeSlug" element={<Index />} />
        <Route path="/:storeSlug/catalogo" element={<Catalogo />} />
        <Route path="/:storeSlug/categoria/:categorySlug" element={<Catalogo />} />
        <Route path="/:storeSlug/producto/:productSlug" element={<Producto />} />
        <Route path="/:storeSlug/carrito" element={<Carrito />} />
        <Route path="/:storeSlug/contacto" element={<Contacto />} />
        <Route path="/catalogo" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster theme="light" position="top-center" />
    </CartProvider>
  );
}
