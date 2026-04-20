import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, Tag, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";

const items = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/catalogo", label: "Catálogo", icon: LayoutGrid },
  { to: "/vender", label: "Vender", icon: Tag },
  { to: "/carrito", label: "Carrito", icon: ShoppingCart },
] as const;

export function MobileNav() {
  const { count } = useCart();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
                activeProps={{ className: "flex flex-col items-center gap-1 py-2.5 text-[11px] text-primary" }}
                activeOptions={{ exact: it.to === "/" }}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {it.to === "/carrito" && count > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background">
                      {count}
                    </span>
                  )}
                </div>
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
