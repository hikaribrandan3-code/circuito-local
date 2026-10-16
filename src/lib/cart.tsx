import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = { product: Product; qty: number };
export const cartItemKey = (product: Product) => `${product.id}::${product.selectedSize ?? ""}`;
type CartCtx = {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  setSize: (key: string, size: string) => void;
  clear: () => void;
  count: number;
  total: number;
};
const Ctx = createContext<CartCtx | null>(null);
const STORAGE = "re-urban-cart-v1";
function readCart(): CartItem[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (item): item is CartItem =>
        item?.product &&
        typeof item.product.id === "string" &&
        typeof item.product.title === "string" &&
        typeof item.product.image === "string" &&
        Number.isFinite(item.product.price) &&
        item.product.price >= 0 &&
        Number.isInteger(item.qty) &&
        item.qty > 0 &&
        item.qty <= 99,
    );
  } catch {
    return [];
  }
}
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readCart);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(items));
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
  }, [items]);
  const value = useMemo<CartCtx>(
    () => ({
      items,
      add: (product) =>
        setItems((current) => {
          const key = cartItemKey(product);
          const existing = current.find((item) => cartItemKey(item.product) === key);
          return existing
            ? current.map((item) =>
                cartItemKey(item.product) === key
                  ? { ...item, qty: Math.min(99, item.qty + 1) }
                  : item,
              )
            : [...current, { product: { ...product }, qty: 1 }];
        }),
      remove: (key) =>
        setItems((current) => current.filter((item) => cartItemKey(item.product) !== key)),
      setQty: (key, qty) =>
        setItems((current) =>
          current
            .map((item) =>
              cartItemKey(item.product) === key
                ? { ...item, qty: Math.min(99, Math.max(0, Math.trunc(qty))) }
                : item,
            )
            .filter((item) => item.qty > 0),
        ),
      setSize: (key, size) =>
        setItems((current) => {
          const target = current.find((item) => cartItemKey(item.product) === key);
          if (!target || target.product.sizes?.[size] === false) return current;
          const updated = { ...target, product: { ...target.product, selectedSize: size } };
          const nextKey = cartItemKey(updated.product);
          const match = current.find(
            (item) => cartItemKey(item.product) === nextKey && cartItemKey(item.product) !== key,
          );
          if (match)
            return current
              .filter((item) => cartItemKey(item.product) !== key)
              .map((item) =>
                cartItemKey(item.product) === nextKey
                  ? { ...item, qty: Math.min(99, item.qty + target.qty) }
                  : item,
              );
          return current.map((item) => (cartItemKey(item.product) === key ? updated : item));
        }),
      clear: () => setItems([]),
      count: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.qty * item.product.price, 0),
    }),
    [items],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCart() {
  const context = useContext(Ctx);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
