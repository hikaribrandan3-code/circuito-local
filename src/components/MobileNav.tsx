import { useLocation } from "react-router-dom";
import { Home, LayoutGrid, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { NavigationDock } from "./NavigationDock";
const destinations = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/catalogo", label: "Catálogo", icon: LayoutGrid },
  { to: "/contacto", label: "Contacto", icon: MessageCircle },
  { to: "/carrito", label: "Carrito", icon: ShoppingBag },
];
export function CustomerBottomNav() {
  const { count } = useCart();
  const { pathname } = useLocation();
  return (
    <NavigationDock
      label="Navegación de la tienda"
      context="customer"
      items={destinations.map((item) => ({
        ...item,
        id: item.to,
        active:
          item.to === "/catalogo"
            ? pathname === item.to || pathname.startsWith("/producto/")
            : pathname === item.to,
        count: item.to === "/carrito" ? count : undefined,
      }))}
    />
  );
}
export const MobileNav = CustomerBottomNav;
