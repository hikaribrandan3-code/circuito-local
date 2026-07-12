import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { MessageCircle, ChevronDown, ChevronUp, User, Phone, Check, X as XIcon } from "lucide-react";

type OrderItem = { id: string; name: string; qty: number; price: number };

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  created_at: string;
  status: "pending" | "fulfilled" | "cancelled";
};

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pendiente",
  fulfilled: "Vendido",
  cancelled: "Cancelado",
};

export default function OrdersTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  function loadOrders() {
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data ?? []) as Order[]);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadOrders();
  }, [userId]);

  async function markFulfilled(order: Order) {
    if (order.status !== "pending") return;
    setUpdating(order.id);
    try {
      // Decrement stock for every line item, floored at 0. Manual and
      // idempotent by design — WhatsApp checkout isn't a real payment
      // confirmation, so stock only moves when the owner confirms a sale.
      for (const line of order.items) {
        const { data: current } = await supabase
          .from("items")
          .select("stock_quantity")
          .eq("id", line.id)
          .single();
        if (!current) continue;
        const nextQty = Math.max(0, (current.stock_quantity ?? 0) - line.qty);
        await supabase
          .from("items")
          .update({ stock_quantity: nextQty, stock_status: nextQty > 0 ? "in_stock" : "out_of_stock" })
          .eq("id", line.id);
      }
      const { error } = await supabase.from("orders").update({ status: "fulfilled" }).eq("id", order.id);
      if (error) throw error;
      toast.success("Pedido marcado como vendido, stock actualizado");
      loadOrders();
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  }

  async function markCancelled(order: Order) {
    if (order.status !== "pending") return;
    setUpdating(order.id);
    const { error } = await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    setUpdating(null);
    if (error) return toast.error(error.message);
    loadOrders();
  }

  if (loading) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Cargando pedidos...</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Pedidos</h1>
        <p className="text-sm text-muted-foreground mt-1">Clientes que enviaron pedidos por WhatsApp.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-card border border-border p-12 text-center">
          <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="font-display text-xl">Aún no hay pedidos</p>
          <p className="text-sm text-muted-foreground mt-1">Los pedidos aparecerán aquí cuando alguien compre desde el catálogo.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 p-4 text-left"
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                >
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm">{order.customer_name}</p>
                      <p className="font-display text-base font-semibold shrink-0">${order.total.toLocaleString("es-AR")}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                      <p className="text-xs text-muted-foreground shrink-0">
                        {format(new Date(order.created_at), "d MMM · HH:mm", { locale: es })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground">{order.items.length} {order.items.length === 1 ? "producto" : "productos"}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                        order.status === "fulfilled" ? "border-success/40 text-success bg-success/5"
                        : order.status === "cancelled" ? "border-destructive/40 text-destructive bg-destructive/5"
                        : "border-warning/40 text-warning bg-warning/5"
                      }`}>
                        {STATUS_LABEL[order.status]}
                      </span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>

                {isOpen && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    <ul className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{item.name} <span className="text-muted-foreground">x{item.qty}</span></span>
                          <span className="font-medium">${(item.price * item.qty).toLocaleString("es-AR")}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span>${order.total.toLocaleString("es-AR")}</span>
                    </div>
                    <a
                      href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${order.customer_name}, gracias por tu pedido de ASB Store 🙌`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] text-white py-2 text-sm font-medium hover:opacity-90 transition"
                    >
                      <Phone className="h-4 w-4" /> Responder por WhatsApp
                    </a>
                    {order.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => markFulfilled(order)}
                          disabled={updating === order.id}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-foreground text-background py-2 text-sm font-medium disabled:opacity-50 transition"
                        >
                          <Check className="h-4 w-4" /> Marcar vendido
                        </button>
                        <button
                          onClick={() => markCancelled(order)}
                          disabled={updating === order.id}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-full border border-border text-muted-foreground py-2 text-sm font-medium disabled:opacity-50 hover:text-destructive hover:border-destructive/40 transition"
                        >
                          <XIcon className="h-4 w-4" /> Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
