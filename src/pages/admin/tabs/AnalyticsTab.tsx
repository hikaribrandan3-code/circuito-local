import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { subDays, isAfter } from "date-fns";
import { ShoppingBag, TrendingUp, DollarSign } from "lucide-react";

type OrderItem = { id: string; name: string; qty: number; price: number };
type Order = { id: string; items: OrderItem[]; total: number; created_at: string };

type Period = 7 | 30;

export default function AnalyticsTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [period, setPeriod] = useState<Period>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("orders")
      .select("id, items, total, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data ?? []) as Order[]);
        setLoading(false);
      });
  }, [userId]);

  const cutoff = subDays(new Date(), period);
  const filtered = orders.filter((o) => isAfter(new Date(o.created_at), cutoff));

  const totalOrders = filtered.length;
  const totalRevenue = filtered.reduce((sum, o) => sum + o.total, 0);

  // Count items across filtered orders
  const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  filtered.forEach((order) => {
    (order.items ?? []).forEach((item) => {
      if (!itemCounts[item.name]) itemCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
      itemCounts[item.name].count += item.qty ?? 1;
      itemCounts[item.name].revenue += item.price * (item.qty ?? 1);
    });
  });

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  if (loading) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Cargando estadísticas...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Estadísticas</h1>
          <p className="text-sm text-muted-foreground mt-1">Resumen de pedidos por WhatsApp.</p>
        </div>
        <div className="flex gap-1 bg-secondary rounded-full p-1">
          {([7, 30] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all ${period === p ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {p}d
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border border-border p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Pedidos</span>
          </div>
          <p className="font-display text-3xl font-semibold">{totalOrders}</p>
          <p className="text-xs text-muted-foreground mt-1">últimos {period} días</p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Revenue</span>
          </div>
          <p className="font-display text-3xl font-semibold">${(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground mt-1">ARS total</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-card border border-border p-4 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Ticket promedio</span>
          </div>
          <p className="font-display text-3xl font-semibold">${avgOrder.toLocaleString("es-AR")}</p>
          <p className="text-xs text-muted-foreground mt-1">por pedido</p>
        </div>
      </div>

      {/* Top items */}
      <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
        <h2 className="font-display text-xl mb-4">Productos más pedidos</h2>
        {topItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Sin datos para este período.</p>
        ) : (
          <div className="space-y-3">
            {topItems.map((item, i) => {
              const maxCount = topItems[0].count;
              const pct = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                      <span className="font-medium truncate max-w-[160px]">{item.name}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold">{item.count} pedidos</span>
                      <p className="text-xs text-muted-foreground">${item.revenue.toLocaleString("es-AR")}</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
