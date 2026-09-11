/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cartStore, useCart } from "@/lib/cart";
import { formatMoney, variantLabel } from "@/lib/commerce";
import { StoreLoading, StoreShell, useCurrentStore } from "@/components/StoreShell";

export default function Carrito() {
  const { store, loading } = useCurrentStore();
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  if (loading || !store) return <StoreLoading />;
  const currentStore = store;
  const invalidCart = Boolean(items.length && cartStore(items) !== currentStore.id);
  const delivery = method === "delivery" ? currentStore.settings.delivery_price : 0;
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!items.length || invalidCart) return;
    setSending(true);
    try {
      const { data, error } = await supabase.rpc("create_checkout_order", {
        p_store_slug: currentStore.slug,
        p_items: items.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variant?.id ?? null,
          quantity: item.quantity,
        })),
        p_customer_name: name,
        p_customer_phone: phone,
        p_fulfillment_method: method,
        p_delivery_address: address || null,
        p_customer_note: note || null,
      });
      if (error) throw error;
      const order = Array.isArray(data) ? data[0] : data;
      const lines = items
        .map(
          (item) =>
            `• ${item.product.name}${item.variant ? ` (${variantLabel(item.product, item.variant)})` : ""} ×${item.quantity}`,
        )
        .join("\n");
      const message = `Pedido #${order.order_number}\n\n${name}\n\n${lines}\n\n${method === "delivery" ? `Envío: ${address}` : "Retiro en tienda"}\nTotal: ${formatMoney(order.total)}`;
      const whatsapp = String(
        order.whatsapp_number ?? currentStore.settings.whatsapp_number ?? "",
      ).replace(/\D/g, "");
      if (whatsapp)
        window.open(
          `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,
          "_blank",
          "noopener",
        );
      clear();
      toast.success("Pedido recibido. Continuamos por WhatsApp.");
    } catch (error: any) {
      toast.error(error.message ?? "No pudimos crear el pedido");
    } finally {
      setSending(false);
    }
  }
  return (
    <StoreShell store={currentStore}>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl">Tu pedido</h1>
        {invalidCart ? (
          <p className="mt-6 rounded-2xl border border-destructive p-5">
            Este carrito corresponde a otra tienda. Volvé a esa tienda o vacialo antes de continuar.
          </p>
        ) : !items.length ? (
          <div className="mt-8 rounded-2xl border p-10 text-center">
            <p>Tu carrito está vacío.</p>
            <Link className="mt-4 inline-block underline" to={`/${currentStore.slug}/catalogo`}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.key} className="flex gap-3 rounded-2xl border bg-card p-3">
                  <img
                    src={
                      item.product.images[0]
                        ? supabase.storage
                            .from("store-media")
                            .getPublicUrl(item.product.images[0].storage_path, {
                              transform: { width: 240, format: "webp", quality: 80 } as any,
                            }).data.publicUrl
                        : "/images/regalos-special.png"
                    }
                    alt=""
                    width="96"
                    height="96"
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="font-display">{item.product.name}</h2>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {variantLabel(item.product, item.variant)}
                      </p>
                    )}
                    <p className="mt-2 font-medium">
                      {formatMoney((item.variant?.price ?? item.product.price) * item.quantity)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button type="button" className="ml-auto" onClick={() => remove(item.key)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <aside className="rounded-2xl border bg-card p-5 h-fit space-y-4">
              <div>
                <label className="text-sm">Nombre</label>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-xl border p-2"
                />
              </div>
              <div>
                <label className="text-sm">WhatsApp</label>
                <input
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-1 w-full rounded-xl border p-2"
                />
              </div>
              {store.settings.pickup_enabled && (
                <label className="flex gap-2 text-sm">
                  <input
                    type="radio"
                    checked={method === "pickup"}
                    onChange={() => setMethod("pickup")}
                  />
                  Retiro
                </label>
              )}
              {store.settings.delivery_enabled && (
                <label className="flex gap-2 text-sm">
                  <input
                    type="radio"
                    checked={method === "delivery"}
                    onChange={() => setMethod("delivery")}
                  />
                  Envío local {delivery ? `(+${formatMoney(delivery)})` : ""}
                </label>
              )}
              {method === "delivery" && (
                <textarea
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Dirección de entrega"
                  className="w-full rounded-xl border p-2"
                />
              )}
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Nota opcional"
                className="w-full rounded-xl border p-2"
              />
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatMoney(subtotal + delivery)}</span>
              </div>
              <button
                disabled={sending}
                className="w-full rounded-full bg-foreground py-3 text-background disabled:opacity-50"
              >
                {sending ? "Enviando…" : "Finalizar por WhatsApp"}
              </button>
            </aside>
          </form>
        )}
      </div>
    </StoreShell>
  );
}
