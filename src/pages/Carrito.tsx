import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, MapPin, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStoreProducts } from "@/lib/useStoreProducts";
import { cartItemKey, useCart } from "@/lib/cart";
import { formatARS, STORE } from "@/lib/products";
import { storefrontDb as supabase } from "@/lib/storefrontDb";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Carrito() {
  const { items, setQty, setSize, remove, total, clear } = useCart();
  const { products } = useStoreProducts();
  const isDemo = items.some((item) => item.product.demo);
  const [demoConfirmed, setDemoConfirmed] = useState(false);
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
    if (!items.length || isDemo) return;
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
    void loadDeliverySettings().catch(() => setDeliveryPrice(0));
  }, [items.length, isDemo]);

  const getLocation = async () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerLat(position.coords.latitude);
          setCustomerLon(position.coords.longitude);
          setLoadingLocation(false);
          toast.success("Ubicación detectada");
        },
        () => {
          setLoadingLocation(false);
          toast.error("No pudimos acceder a tu ubicación");
        },
      );
    }
  };

  const effectiveDeliveryPrice = isDemo ? 3500 : deliveryPrice;
  const finalTotal = deliveryMethod === "delivery" ? total + effectiveDeliveryPrice : total;

  if (demoConfirmed)
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white">
          <Check size={28} />
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
          R&E Urban Style · Demo
        </p>
        <h1 className="mt-3 text-3xl font-medium">Así se vería tu confirmación.</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Tu selección suma {formatARS(finalTotal)}. Esta es una vista de muestra: no se realizó un
          cobro ni se envió un pedido.
        </p>
        <Button className="mt-7 rounded-full" onClick={() => setDemoConfirmed(false)}>
          Volver a mi carrito
        </Button>
        <Link to="/" className="mt-4 block text-sm underline">
          Seguir explorando
        </Link>
      </div>
    );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-5 lg:px-8">
        <section className="mx-auto max-w-lg py-12 text-center sm:py-16">
          <ShoppingBag size={60} strokeWidth={1.4} className="mx-auto" aria-hidden="true" />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Tu carrito está vacío
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Elegí tus favoritos de la colección y armá tu próximo look.
          </p>
          <Link
            to="/catalogo"
            className="mx-auto mt-6 flex min-h-12 w-[50vw] min-w-44 max-w-64 items-center justify-center gap-3 rounded-full bg-black px-5 text-sm font-medium text-white"
          >
            Ver catálogo <ArrowRight size={17} />
          </Link>
        </section>
        <section className="border-t border-black/5 pt-6" aria-labelledby="recommendations-title">
          <p className="text-[10px] uppercase tracking-[.2em] text-muted-foreground">
            QUIZÁS TE GUSTE
          </p>
          <div className="mb-5 mt-1 flex items-center justify-between gap-3">
            <h2 id="recommendations-title" className="text-lg font-semibold sm:text-2xl">
              Populares de la colección
            </h2>
            <Link
              to="/catalogo"
              className="flex min-h-11 shrink-0 items-center gap-2 text-xs underline underline-offset-4"
            >
              Ver todo <ArrowRight size={15} />
            </Link>
          </div>
          <div className="store-gallery-track flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
            {products.slice(0, 3).map((product) => (
              <Link
                key={product.id}
                to={`/producto/${product.id}`}
                className="w-[58vw] max-w-64 shrink-0 snap-start overflow-hidden rounded-2xl bg-white sm:w-60"
              >
                <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-medium">{product.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{formatARS(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (items.some((item) => item.product.has_sizes && !item.product.selectedSize)) {
      toast.error("Elegí un talle para cada prenda antes de continuar.");
      return;
    }
    if (isDemo) {
      setShowModal(false);
      setDemoConfirmed(true);
      return;
    }
    setSending(true);
    try {
      const orderItems = items.map((i) => ({
        id: i.product.id,
        name: i.product.title,
        qty: i.qty,
        price: i.product.price,
        size: i.product.selectedSize ?? null,
      }));

      // Find owner's user_id (single owner shop — get first profile)
      const { data: profiles } = await supabase.from("profiles").select("id,phone").limit(1);
      const destination = profiles?.[0]?.phone?.replace(/\D/g, "");
      if (!destination) {
        toast.error("El contacto de la tienda todavía no está configurado.");
        setSending(false);
        return;
      }
      const ownerId = profiles?.[0]?.id;

      if (ownerId) {
        const { error: orderError } = await supabase.from("orders").insert({
          user_id: ownerId,
          customer_name: name,
          customer_phone: phone,
          items: orderItems,
          total: finalTotal,
          delivery_method: deliveryMethod,
          customer_latitude: customerLat,
          customer_longitude: customerLon,
        });
        if (orderError) {
          console.error("Failed to save order:", orderError);
          toast.error("No pudimos guardar tu pedido, pero podés seguir por WhatsApp");
        }

        const { error: customerError } = await supabase
          .from("shop_customers")
          .upsert(
            { user_id: ownerId, phone, name, updated_at: new Date().toISOString() },
            { onConflict: "user_id,phone" },
          );
        if (customerError) console.error("Failed to upsert customer:", customerError);
      }

      const deliveryText =
        deliveryMethod === "delivery"
          ? `Envío a domicilio (+${formatARS(effectiveDeliveryPrice)})`
          : "Retiro en tienda (gratis)";

      const lines = items
        .map((i) => `• ${i.product.title} x${i.qty} — ${formatARS(i.product.price * i.qty)}`)
        .join("\n");
      const text = encodeURIComponent(
        `Hola ${STORE.name}, soy ${name} (${phone}).\n\nQuiero hacer este pedido:\n\n${lines}\n\n${deliveryText}\n\nTotal: ${formatARS(finalTotal)}`,
      );
      window.open(`https://wa.me/${destination}?text=${text}`, "_blank");
      toast.success("¡Pedido enviado!", { description: "Te esperamos para coordinar el envío." });
      setSending(false);
      setShowModal(false);
      setTimeout(() => clear(), 1500);
    } catch {
      toast.error("No pudimos completar el pedido. Intentá de nuevo o contactanos.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-medium">Tu carrito</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "producto" : "productos"}
      </p>

      {isDemo && (
        <p className="mt-4 rounded-2xl border border-white bg-white/60 px-4 py-3 text-xs text-muted-foreground">
          Vista demo · fotos del local y precios ilustrativos. Podés recorrer el checkout completo.
        </p>
      )}
      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={cartItemKey(item.product)}
              className="flex min-w-0 gap-3 rounded-3xl border border-white bg-white p-3 sm:gap-4 sm:p-5"
            >
              <Link to={`/producto/${item.product.id}`} className="shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  loading="lazy"
                  width={96}
                  height={96}
                  className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link to={`/producto/${item.product.id}`} className="hover:underline">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {item.product.brand}
                  </p>
                  <h3 className="break-words font-display text-base font-medium leading-tight sm:text-lg">
                    {item.product.title}
                  </h3>
                </Link>

                {/* Size selector if product has sizes */}
                {item.product.has_sizes && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {(item.product.sizes ? Object.keys(item.product.sizes) : SIZES).map((size) => {
                      const isAvailable = item.product.sizes?.[size] !== false;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            setSize(cartItemKey(item.product), size);
                          }}
                          className={`min-h-11 min-w-11 text-[10px] px-2 py-1 rounded transition ${
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

                <div className="mt-auto flex flex-col items-start gap-2 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-secondary px-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-11 w-11 rounded-full"
                      onClick={() => setQty(cartItemKey(item.product), item.qty - 1)}
                      aria-label={`Quitar una unidad de ${item.product.title}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-11 w-11 rounded-full"
                      onClick={() => setQty(cartItemKey(item.product), item.qty + 1)}
                      aria-label={`Sumar una unidad de ${item.product.title}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <span className="max-w-full break-words font-display text-sm font-semibold tabular-nums sm:text-base">
                    {formatARS(item.product.price * item.qty)}
                  </span>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => remove(cartItemKey(item.product))}
                aria-label="Eliminar"
                className="h-11 w-11 shrink-0"
              >
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </li>
          ))}
        </ul>

        <aside className="rounded-3xl bg-white border border-white p-6 h-fit lg:sticky lg:top-24 shadow-soft">
          <h2 className="font-display text-lg font-medium">Resumen del pedido</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatARS(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Envío</dt>
              <dd
                className={deliveryMethod === "delivery" ? "font-medium" : "text-muted-foreground"}
              >
                {deliveryMethod === "delivery" ? formatARS(effectiveDeliveryPrice) : "Gratis"}
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
            Continuar al checkout
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full rounded-full">
            <Link to="/catalogo">Seguir comprando</Link>
          </Button>
        </aside>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-h-[90dvh] max-w-md overflow-y-auto rounded-3xl p-6">
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            {isDemo
              ? "Una muestra de cómo comprar en R&E. No se generan pedidos ni cobros."
              : "Completá tus datos para coordinar tu pedido."}
          </DialogDescription>
          <form onSubmit={checkout} className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-secondary/70 p-3">
              <img
                src={items[0]?.product.image}
                alt="Tu selección"
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Tu selección</p>
                <p className="mt-1 text-sm font-medium">
                  {items.reduce((sum, item) => sum + item.qty, 0)} prendas
                </p>
              </div>
              <span className="text-sm font-semibold">{formatARS(finalTotal)}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-name">Tu nombre</Label>
              <Input
                required={!isDemo}
                id="checkout-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llamás?"
                className="rounded-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-phone">Tu teléfono</Label>
              <Input
                required={!isDemo}
                id="checkout-phone"
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
                  className={`flex-1 min-h-11 py-2 rounded-full text-sm font-medium transition ${
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
                  className={`flex-1 min-h-11 py-2 rounded-full text-sm font-medium transition ${
                    deliveryMethod === "delivery"
                      ? "bg-foreground text-background"
                      : "border border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  Envío ({formatARS(effectiveDeliveryPrice)})
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 p-3 text-xs">
              <p className="font-medium">Forma de pago</p>
              <p className="mt-1 text-muted-foreground">
                A coordinar con el local al confirmar tu pedido.
              </p>
            </div>
            {/* Location detection for delivery */}
            {deliveryMethod === "delivery" && !isDemo && (
              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={getLocation}
                  disabled={loadingLocation}
                  variant="outline"
                  className="w-full rounded-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {loadingLocation
                    ? "Detectando..."
                    : customerLat
                      ? "✓ Ubicación detectada"
                      : "Detectar mi ubicación"}
                </Button>
              </div>
            )}

            <Button
              type="submit"
              disabled={sending || (!isDemo && deliveryMethod === "delivery" && !customerLat)}
              size="lg"
              className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium"
            >
              {sending ? "Enviando..." : isDemo ? "Confirmar demo" : "Confirmar y coordinar pedido"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
