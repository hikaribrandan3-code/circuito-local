import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product, Store, Variant } from "./commerce";

export type CartItem = { key: string; product: Product; variant: Variant | null; quantity: number };
type CartContext = {
  items: CartItem[];
  add: (product: Product, variant?: Variant | null) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};
const Cart = createContext<CartContext | null>(null);
const keyFor = (product: Product, variant?: Variant | null) =>
  `${product.store_id}:${product.id}:${variant?.id ?? "base"}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("circuito-cart-v2") ?? "[]"));
    } catch {
      setItems([]);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("circuito-cart-v2", JSON.stringify(items));
  }, [items]);
  const value = useMemo<CartContext>(
    () => ({
      items,
      add(product, variant = null) {
        const key = keyFor(product, variant);
        setItems((previous) => {
          // A cart is deliberately scoped to one storefront. Mixing tenants is
          // confusing and can never be checked out as one local order.
          if (previous[0] && previous[0].product.store_id !== product.store_id) {
            return [{ key, product, variant, quantity: 1 }];
          }
          return previous.some((item) => item.key === key)
            ? previous.map((item) =>
                item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
              )
            : [...previous, { key, product, variant, quantity: 1 }];
        });
      },
      remove(key) {
        setItems((previous) => previous.filter((item) => item.key !== key));
      },
      setQuantity(key, quantity) {
        setItems((previous) =>
          previous
            .map((item) => (item.key === key ? { ...item, quantity: Math.max(0, quantity) } : item))
            .filter((item) => item.quantity),
        );
      },
      clear() {
        setItems([]);
      },
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity,
        0,
      ),
    }),
    [items],
  );
  return <Cart.Provider value={value}>{children}</Cart.Provider>;
}

export function useCart() {
  const context = useContext(Cart);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
export function cartStore(items: CartItem[]): Store["id"] | null {
  return items[0]?.product.store_id ?? null;
}
