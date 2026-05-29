import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  kind: "ticket" | "food" | "beverage" | "merch";
  name: string;
  detail?: string;
  price: number;
  qty: number;
};

type Ctx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "esx.cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add: Ctx["add"] = (item) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  };
  const remove = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)));
  const clear = () => setItems([]);

  const { total, count } = useMemo(() => {
    return {
      total: items.reduce((a, b) => a + b.price * b.qty, 0),
      count: items.reduce((a, b) => a + b.qty, 0),
    };
  }, [items]);

  return (
    <CartCtx.Provider value={{ items, add, remove, setQty, clear, total, count }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
