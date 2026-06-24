import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart";
import { formatARS, STORE } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Carrito() {
  const { items, setQty, remove, total, clear } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("pickup");
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [customerLat, setCustomerLat] = useState<number | null>(null);
  const [customerLon, setCustomerLon] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Load delivery settings
  useEffect(() => {
    async function loadDeliverySettings() {
      const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
      const ownerId = profiles?.[0]?.id;
      if (ownerId) {
        const { data } = await supabase
          .from("delivery_settings")
          .select("delivery_price")
          .eq("user_id", ownerId)
          .single();
        if (data) setDeliveryPrice(data.delivery_price);
      }
    }
    loadDeliverySettings();
  }, []);

  const getLocation = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCustomerLat(position.coords.latitude);
        setCustomerLon(position.coords.longitude);
        setLoadingLocation(false);
        toast.success("Ubicación detectada");
      }, () => {
        setLoadingLocation(false);
        toast.error("No pudimos acceder a tu ubicación");
      });
    }
  };

  const finalTotal = deliveryMethod === "delivery" ? total + deliveryPrice : total;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
          <img
            src="/sad-sleepy-emoticon-face-square-svgrepo-com.svg"
            alt="sad face"
            className="h-16 w-16 object-contain"
            onError={(e) => {
              // Fallback to emoji if SVG fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-5xl select-none">😢</span>';
            }}
          />
        </div>
        <h1 className="mt-6 font-display text-4xl">Pobresito, tu carrito está vacío</h1>
        <p className="mt-2 text-muted-foreground">Nada por aquí todavía... explorá el catálogo y encontrá el regalo perfecto.</p>
        <Button asChild className="mt-8 bg-foreground text-background hover:bg-foreground/90 rounded-full">
          <Link to="/catalogo">Ver catálogo</Link>
        </Button>
      </div>
    );
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    const orderItems = items.map((i) => ({
      id: i.product.id,
      name: i.product.title,
      qty: i.qty,
      price: i.product.price,
    }));

    // Find owner's user_id (single owner shop — get first profile)
    const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
    const ownerId = profiles?.[0]?.id;

    if (ownerId) {
      await supabase.from("orders").insert({
        user_id: ownerId,
        customer_name: name,
        customer_phone: phone,
        items: orderItems,
        total: finalTotal,
        delivery_method: deliveryMethod,
        customer_latitude: customerLat,
        customer_longitude: customerLon,
      });
    }

    const deliveryText = deliveryMethod === "delivery"
      ? `Envío a domicilio (+${formatARS(deliveryPrice)})`
      : "Retiro en tienda (gratis)";

    const lines = items.map((i) => `• ${i.product.title} x${i.qty} — ${formatARS(i.product.price * i.qty)}`).join("\n");
    const text = encodeURIComponent(
      `Hola ${STORE.name}, soy ${name} (${phone}).\n\nQuiero hacer este pedido:\n\n${lines}\n\n${deliveryText}\n\nTotal: ${formatARS(finalTotal)}`,
    );
    window.open(`https://wa.me/${STORE.whatsapp}?text=${text}`, "_blank");
    toast.success("¡Pedido enviado!", { description: "Te esperamos para coordinar el envío." });
    setSending(false);
    setShowModal(false);
    setTimeout(() => clear(), 1500);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-8 py-10">
      <h1 className="font-display text-4xl md:text-5xl">Tu pedido</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} {items.length === 1 ? "producto" : "productos"}</p>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
        <ul className="space-y-3">
          {items.map((item, i) => (
            <motion.li
              key={item.product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-2xl bg-card border border-border p-4"
            >
              <Link to={`/producto/${item.product.id}`} className="shrink-0">
                <img src={item.product.image} alt={item.product.title} className="h-24 w-24 rounded-xl object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to={`/producto/${item.product.id}`} className="hover:underline">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{item.product.brand}</p>
                  <h3 className="font-display text-lg font-medium leading-tight line-clamp-1">{item.product.title}</h3>
                </Link>

                {/* Size selector if product has sizes */}
                {item.product.has_sizes && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {SIZES.map((size) => {
                      const isAvailable = item.product.sizes?.[size] !== false;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            // Store selected size in cart item
                            if (item.product.selectedSize !== size) {
                              item.product.selectedSize = size;
                            }
                          }}
                          className={`text-[10px] px-2 py-1 rounded transition ${
                            !isAvailable
                              ? "bg-secondary text-muted-foreground line-through opacity-40"
                              : item.product.selectedSize === size
                              ? "bg-foreground text-background font-medium"
                              : "border border-border text-muted-foreground hover:border-foreground"
                          }`}
                          disabled={!isAvailable}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-secondary px-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setQty(item.product.id, item.qty - 1)}>
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setQty(item.product.id, item.qty + 1)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <span className="font-display font-semibold">{formatARS(item.product.price * item.qty)}</span>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => remove(item.product.id)} aria-label="Eliminar">
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </motion.li>
          ))}
        </ul>

        <aside className="rounded-2xl bg-card border border-border p-6 h-fit lg:sticky lg:top-24 shadow-soft">
          <h2 className="font-display text-2xl">Resumen</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatARS(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Envío</dt>
              <dd className={deliveryMethod === "delivery" ? "font-medium" : "text-muted-foreground"}>
                {deliveryMethod === "delivery" ? formatARS(deliveryPrice) : "Gratis"}
              </dd>
            </div>
          </dl>
          <div className="my-4 h-px bg-border" />
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display text-2xl font-semibold">{formatARS(finalTotal)}</span>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            className="mt-6 w-full bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium"
          >
            Finalizar por WhatsApp
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full rounded-full">
            <Link to="/catalogo">Seguir comprando</Link>
          </Button>
        </aside>
      </div>

      {/* Checkout modal — captures name + phone */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="w-full max-w-sm rounded-3xl bg-card border border-border p-6 shadow-elegant"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl">Tu contacto</h2>
                <button onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <form onSubmit={checkout} className="space-y-4">
                <div className="space-y-2">
                  <Label>Tu nombre</Label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="¿Cómo te llamás?"
                    className="rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tu WhatsApp</Label>
                  <Input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 9 11 0000-0000"
                    className="rounded-full"
                  />
                </div>

                {/* Delivery method selection */}
                <div className="space-y-2">
                  <Label>Cómo querés recibirlo</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                        deliveryMethod === "pickup"
                          ? "bg-foreground text-background"
                          : "border border-border text-muted-foreground hover:border-foreground"
                      }`}
                    >
                      Retiro Gratis
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                        deliveryMethod === "delivery"
                          ? "bg-foreground text-background"
                          : "border border-border text-muted-foreground hover:border-foreground"
                      }`}
                    >
                      Envío ({formatARS(deliveryPrice)})
                    </button>
                  </div>
                </div>

                {/* Location detection for delivery */}
                {deliveryMethod === "delivery" && (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      onClick={getLocation}
                      disabled={loadingLocation}
                      variant="outline"
                      className="w-full rounded-full"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {loadingLocation ? "Detectando..." : customerLat ? "✓ Ubicación detectada" : "Detectar mi ubicación"}
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={sending || (deliveryMethod === "delivery" && !customerLat)}
                  size="lg"
                  className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium"
                >
                  {sending ? "Enviando..." : "Confirmar y abrir WhatsApp"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
