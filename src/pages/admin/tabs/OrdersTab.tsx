import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MessageCircle, ChevronDown, ChevronUp, User, Phone } from "lucide-react";

type OrderItem = { id: string; name: string; qty: number; price: number };

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  created_at: string;
};

export default function OrdersTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data ?? []) as Order[]);
        setLoading(false);
      });
  }, [userId]);

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
                    <p className="text-xs text-muted-foreground">{order.items.length} {order.items.length === 1 ? "producto" : "productos"}</p>
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
                      href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${order.customer_name}, gracias por tu pedido de ABS Store 🙌`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] text-white py-2 text-sm font-medium hover:opacity-90 transition"
                    >
                      <Phone className="h-4 w-4" /> Responder por WhatsApp
                    </a>
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
