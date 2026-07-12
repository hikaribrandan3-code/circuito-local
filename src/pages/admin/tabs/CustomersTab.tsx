import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Users, Phone, Search } from "lucide-react";

type OrderItem = { id: string; name: string; qty: number; price: number };
type Order = { customer_name: string; customer_phone: string; items: OrderItem[]; total: number; created_at: string };

type Customer = {
  phone: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
};

export default function CustomersTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase
      .from("orders")
      .select("customer_name, customer_phone, items, total, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data ?? []) as Order[]);
        setLoading(false);
      });
  }, [userId]);

  const customers = useMemo(() => {
    const byPhone: Record<string, Customer> = {};
    for (const order of orders) {
      const phone = order.customer_phone;
      if (!phone) continue;
      if (!byPhone[phone]) {
        byPhone[phone] = { phone, name: order.customer_name, orderCount: 0, totalSpent: 0, lastOrderAt: order.created_at };
      }
      byPhone[phone].orderCount += 1;
      byPhone[phone].totalSpent += order.total;
      // Orders are sorted newest-first, so the first one seen per phone has the most recent name.
    }
    return Object.values(byPhone).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = customers.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.name?.toLowerCase().includes(q) || c.phone.includes(q);
  });

  if (loading) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Cargando clientes...</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Clientes</h1>
        <p className="text-sm text-muted-foreground mt-1">{customers.length} {customers.length === 1 ? "cliente" : "clientes"} · ordenados por gasto total.</p>
      </div>

      {customers.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="w-full h-10 rounded-full border border-input bg-background pl-10 pr-4 text-sm"
          />
        </div>
      )}

      {customers.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-12 text-center">
          <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-display text-xl">Aún no hay clientes</p>
          <p className="text-sm text-muted-foreground mt-1">Aparecerán acá apenas alguien haga un pedido desde el catálogo.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.phone} className="flex items-center gap-3 rounded-2xl bg-card border border-border shadow-soft p-4">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm truncate">{c.name || "Sin nombre"}</p>
                  <p className="font-display text-base font-semibold shrink-0">${c.totalSpent.toLocaleString("es-AR")}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {c.orderCount} {c.orderCount === 1 ? "pedido" : "pedidos"} · último {format(new Date(c.lastOrderAt), "d MMM", { locale: es })}
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 hover:opacity-90 transition"
                aria-label="WhatsApp"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
