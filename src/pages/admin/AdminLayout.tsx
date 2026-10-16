import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminBottomNav, type AdminSection } from "@/components/AdminBottomNav";
import { OwnerHeader } from "@/components/OwnerHeader";
import {
  AddProductActions,
  StoreManagement,
  type StoreSetting,
} from "@/components/StoreManagement";
import InfoTab from "./tabs/InfoTab";
import ShopTab, { type NewItemRequest } from "./tabs/ShopTab";
import OrdersTab from "./tabs/OrdersTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import CustomersTab from "./tabs/CustomersTab";
import OwnerSummary from "./OwnerSummary";
export default function AdminLayout({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [section, setSection] = useState<AdminSection>("resumen");
  const [setting, setSetting] = useState<
    StoreSetting | "orders" | "customers" | "analytics" | null
  >(null);
  const [request, setRequest] = useState<NewItemRequest>();
  const [addStarted, setAddStarted] = useState(false);
  const [summaryVersion, setSummaryVersion] = useState(0);
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const changeSection = (next: AdminSection) => {
    setSection(next);
    setSetting(null);
    if (next === "agregar") setAddStarted(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const addProduct = (file?: File) => {
    setAddStarted(true);
    setRequest({ id: Date.now(), file });
  };
  async function logout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }
  return (
    <div className="owner-shell min-h-screen">
      <OwnerHeader ownerId={userId} />
      <input
        ref={camera}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.[0]) addProduct(event.target.files[0]);
          event.target.value = "";
        }}
      />
      <input
        ref={gallery}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.[0]) addProduct(event.target.files[0]);
          event.target.value = "";
        }}
      />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {section === "resumen" && (
          <OwnerSummary
            key={summaryVersion}
            userId={userId}
            onProducts={() => changeSection("productos")}
          />
        )}
        {section === "agregar" && !addStarted && (
          <AddProductActions
            onCamera={() => camera.current?.click()}
            onGallery={() => gallery.current?.click()}
            onManual={() => addProduct()}
          />
        )}
        <div hidden={section !== "productos" && !(section === "agregar" && addStarted)}>
          <ShopTab
            userId={userId}
            newItemRequest={request}
            onSaved={() => {
              setSection("productos");
              setSummaryVersion((current) => current + 1);
            }}
          />
        </div>
        {section === "tienda" && !setting && (
          <StoreManagement onSelect={setSetting} onLogout={() => void logout()} />
        )}
        {section === "tienda" && setting && (
          <>
            <button
              type="button"
              onClick={() => setSetting(null)}
              className="mb-4 min-h-11 text-xs underline underline-offset-4"
            >
              ← Gestioná tu tienda
            </button>
            {setting === "account" ? (
              <section className="rounded-3xl bg-white p-5">
                <h1 className="text-xl font-semibold">Configuración</h1>
                <p className="mt-2 break-all text-sm text-muted-foreground">{userEmail}</p>
                <div className="mt-5 grid gap-2">
                  {[
                    { id: "orders" as const, title: "Pedidos" },
                    { id: "customers" as const, title: "Clientes" },
                    { id: "analytics" as const, title: "Estadísticas" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSetting(item.id)}
                      className="management-row"
                    >
                      {item.title} →
                    </button>
                  ))}
                  <button type="button" onClick={() => void logout()} className="management-row">
                    Cerrar sesión →
                  </button>
                </div>
              </section>
            ) : setting === "orders" ? (
              <OrdersTab userId={userId} />
            ) : setting === "customers" ? (
              <CustomersTab userId={userId} />
            ) : setting === "analytics" ? (
              <AnalyticsTab userId={userId} />
            ) : (
              <InfoTab userId={userId} focusSection={setting} />
            )}
          </>
        )}
      </div>
      <AdminBottomNav section={section} onChange={changeSection} />
    </div>
  );
}
