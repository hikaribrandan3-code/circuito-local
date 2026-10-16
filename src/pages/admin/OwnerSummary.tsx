import { useEffect, useState } from "react";
import { ArrowRight, Boxes, Package, ChartNoAxesColumn } from "lucide-react";
import { storefrontDb } from "@/lib/storefrontDb";
import { formatARS } from "@/lib/products";
type SummaryItem = {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  category_id: string | null;
  image_url: string | null;
};
export default function OwnerSummary({
  userId,
  onProducts,
}: {
  userId: string;
  onProducts: () => void;
}) {
  const [state, setState] = useState<{
    items: SummaryItem[];
    images: Record<string, string>;
    categories: Record<string, string>;
    revenue: number;
    loading: boolean;
    error: boolean;
  }>({ items: [], images: {}, categories: {}, revenue: 0, loading: true, error: false });
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const [items, images, categories, orders] = await Promise.all([
          storefrontDb
            .from("items")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
          storefrontDb.from("item_images").select("*").order("display_order"),
          storefrontDb.from("categories").select("*").eq("user_id", userId),
          storefrontDb.from("orders").select("total").eq("user_id", userId),
        ]);
        if (items.error || categories.error || orders.error)
          throw new Error("No pudimos cargar el resumen.");
        const imageMap: Record<string, string> = {};
        for (const image of images.data ?? [])
          if (!imageMap[image.item_id]) imageMap[image.item_id] = image.image_url;
        if (active)
          setState({
            items: items.data ?? [],
            images: imageMap,
            categories: Object.fromEntries(
              (categories.data ?? []).map((category) => [category.id, category.name]),
            ),
            revenue: (orders.data ?? []).reduce((sum, order) => sum + Number(order.total), 0),
            loading: false,
            error: false,
          });
      } catch {
        if (active) setState((current) => ({ ...current, loading: false, error: true }));
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);
  if (state.loading) return <p className="py-8 text-sm text-muted-foreground">Cargando resumen…</p>;
  if (state.error)
    return (
      <p role="alert" className="rounded-2xl bg-white p-5 text-sm">
        No pudimos cargar el resumen. Volvé a intentarlo desde el panel.
      </p>
    );
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Package, value: state.items.length, detail: "en catálogo" },
          {
            icon: Boxes,
            value: state.items.reduce((sum, item) => sum + (item.stock_quantity || 0), 0),
            detail: "unidades en stock",
          },
          { icon: ChartNoAxesColumn, value: formatARS(state.revenue), detail: "total de pedidos" },
        ].map(({ icon: Icon, value, detail }) => (
          <article key={detail} className="min-w-0 rounded-3xl bg-white p-4">
            <Icon size={20} />
            <p className="mt-4 truncate text-lg font-semibold sm:text-2xl">{value}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">{detail}</p>
          </article>
        ))}
      </div>
      <section className="mt-5 rounded-3xl bg-white p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Stock destacado</h2>
          <button
            type="button"
            onClick={onProducts}
            className="flex min-h-11 items-center gap-2 text-xs underline underline-offset-4"
          >
            Ver productos
            <ArrowRight size={15} />
          </button>
        </div>
        <div className="divide-y divide-black/5">
          {state.items.slice(0, 4).map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={onProducts}
              className="flex min-h-20 w-full items-center gap-3 py-3 text-left"
            >
              {(state.images[item.id] || item.image_url) && (
                <img
                  src={state.images[item.id] || item.image_url || ""}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
              )}
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-sm font-medium">{item.name}</strong>
                <small className="mt-1 block truncate text-[11px] text-muted-foreground">
                  {state.categories[item.category_id ?? ""]} · {formatARS(item.price)}
                </small>
              </span>
              <span className="shrink-0 text-right text-sm">
                {item.stock_quantity ?? 0} u.
                <small
                  className={`mt-1 block text-[10px] ${item.stock_quantity > 0 ? "text-emerald-700" : "text-muted-foreground"}`}
                >
                  {item.stock_quantity > 0 ? "Disponible" : "Sin stock"}
                </small>
              </span>
            </button>
          ))}
        </div>
        {!state.items.length && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay productos. Agregá tu primera prenda.
          </p>
        )}
      </section>
    </>
  );
}
