import { Link, useParams } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { Home, LayoutGrid, MessageCircle, ShoppingBag } from "lucide-react";
import { getStore, mediaUrl, type Store } from "@/lib/commerce";
import { useCart } from "@/lib/cart";

export function useCurrentStore() {
  const { storeSlug = "" } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true);
    getStore(storeSlug)
      .then((value) => {
        if (active) setStore(value);
      })
      .catch(() => active && setError("No pudimos cargar esta tienda."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [storeSlug]);
  return { store, storeSlug, loading, error };
}

export function StoreShell({ store, children }: { store: Store; children: ReactNode }) {
  const { count } = useCart();
  const base = `/${store.slug}`;
  const logo = mediaUrl(store.settings.logo_path, 160);
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-foreground text-background text-center py-2 px-4 text-xs tracking-wide font-medium">
        Comprá online y coordiná por WhatsApp
      </div>
      <header className="sticky top-0 z-40 w-full glass-strong border-b">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
          <Link to={base} className="flex items-center gap-3 shrink-0">
            {logo ? (
              <img
                src={logo}
                alt=""
                width="40"
                height="40"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground font-display text-background">
                {store.name[0]}
              </span>
            )}
            <span className="font-display text-2xl font-semibold tracking-tight">{store.name}</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-4 ml-5 text-sm">
            <Link to={`${base}/catalogo`}>Catálogo</Link>
            <Link to={`${base}/contacto`}>Contacto</Link>
          </nav>
          <Link className="ml-auto relative p-2" to={`${base}/carrito`} aria-label="Carrito">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                {count}
              </span>
            )}
          </Link>
        </div>
      </header>
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t pb-[env(safe-area-inset-bottom)]">
        <ul className="grid grid-cols-4 px-2 pt-1.5 text-xs">
          <li>
            <Link className="flex flex-col items-center gap-1 py-2" to={base}>
              <Home className="h-5 w-5" />
              Inicio
            </Link>
          </li>
          <li>
            <Link className="flex flex-col items-center gap-1 py-2" to={`${base}/catalogo`}>
              <LayoutGrid className="h-5 w-5" />
              Catálogo
            </Link>
          </li>
          <li>
            <Link className="flex flex-col items-center gap-1 py-2" to={`${base}/contacto`}>
              <MessageCircle className="h-5 w-5" />
              Contacto
            </Link>
          </li>
          <li>
            <Link className="flex flex-col items-center gap-1 py-2" to={`${base}/carrito`}>
              <ShoppingBag className="h-5 w-5" />
              Carrito
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export function StoreLoading({ message = "Cargando tienda…" }: { message?: string }) {
  return (
    <div className="min-h-[60vh] grid place-items-center text-muted-foreground">{message}</div>
  );
}
