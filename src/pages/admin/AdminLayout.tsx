import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Info, ShoppingBag, ClipboardList, BarChart2, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import InfoTab from "./tabs/InfoTab";
import ShopTab from "./tabs/ShopTab";
import OrdersTab from "./tabs/OrdersTab";
import AnalyticsTab from "./tabs/AnalyticsTab";

type Tab = "info" | "shop" | "orders" | "analytics";

const TABS = [
  { id: "info" as Tab, label: "Info", icon: Info },
  { id: "shop" as Tab, label: "Shop", icon: ShoppingBag },
  { id: "orders" as Tab, label: "Pedidos", icon: ClipboardList },
  { id: "analytics" as Tab, label: "Stats", icon: BarChart2 },
];

export default function AdminLayout({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [tab, setTab] = useState<Tab>("shop");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-card shadow-soft shrink-0 min-h-screen sticky top-0">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-foreground flex items-center justify-center">
              <span className="font-display text-sm font-semibold text-background">A</span>
            </div>
            <div>
              <p className="font-display text-base font-semibold leading-tight">ASB Store</p>
              <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{userEmail}</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start text-muted-foreground">
            <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-8 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-20 glass-strong border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-foreground flex items-center justify-center">
              <span className="font-display text-xs font-semibold text-background">A</span>
            </div>
            <span className="font-display text-base font-semibold">ASB Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-19 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
        )}
        <div className={`md:hidden fixed top-12 right-0 z-20 w-64 bg-card border-l border-border shadow-lg transition-all ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <nav className="flex flex-col p-3 gap-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full ${
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {t.label}
                </button>
              );
            })}
            <div className="border-t border-border my-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" /> Salir
              </Button>
            </div>
          </nav>
        </div>

        <div className="p-4 md:p-8 max-w-3xl mx-auto">
          {tab === "info" && <InfoTab userId={userId} />}
          {tab === "shop" && <ShopTab userId={userId} />}
          {tab === "orders" && <OrdersTab userId={userId} />}
          {tab === "analytics" && <AnalyticsTab userId={userId} />}
        </div>
      </main>
    </div>
  );
}
