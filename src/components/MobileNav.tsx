import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

const NAV_ITEMS = [
  { to: "/", label: "Inicio", icon: Home, exact: true },
  { to: "/catalogo", label: "Catálogo", icon: LayoutGrid, exact: false },
  { to: "/contacto", label: "Contacto", icon: MessageCircle, exact: false },
  { to: "/carrito", label: "Carrito", icon: ShoppingBag, exact: false },
] as const;

export function MobileNav() {
  const { count } = useCart();
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong border-t pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4 px-2 pt-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`relative flex h-9 w-16 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-foreground/10" : ""
                  }`}
                >
                  <Icon className={`h-6 w-6 transition-transform ${isActive ? "scale-110" : ""}`} strokeWidth={isActive ? 2.4 : 2} />
                  {item.to === "/carrito" && count > 0 && (
                    <span className="absolute top-0.5 right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background">
                      {count}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
