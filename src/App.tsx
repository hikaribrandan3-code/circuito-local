import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
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

function StorefrontEntry() {
  const configuredSlug = import.meta.env.VITE_DEFAULT_STORE_SLUG?.trim();
  const [storeSlug, setStoreSlug] = useState(configuredSlug ?? "");
  const [loading, setLoading] = useState(!configuredSlug);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (configuredSlug) return;
    let active = true;
    supabase
      .from("stores")
      .select("slug")
      .eq("is_published", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError || !data?.slug) setError(true);
        else setStoreSlug(data.slug);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [configuredSlug]);

  if (storeSlug) return <Navigate to={`/${storeSlug}`} replace />;
  if (loading)
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Cargando tienda…</div>;
  return (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <div>
        <p className="font-display text-4xl">Tu tienda local, en un link.</p>
        <p className="mt-3 text-muted-foreground">
          {error
            ? "No encontramos una tienda publicada. Revisá la configuración o entrá a administración."
            : "Publicá tu tienda para verla acá."}
        </p>
        <a className="mt-6 inline-block underline" href="/admin">
          Administrar mi tienda
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route
          path="/"
          element={<StorefrontEntry />}
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
