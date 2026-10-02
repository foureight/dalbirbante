"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLineDetail = {
  baseName?: string;
  glutenFree?: boolean;
  extras?: string[];
};

export type CartLine = {
  key: string;
  name: string;
  unitPrice: number;
  qty: number;
  image?: string;
  categoryId?: string;
  detail?: CartLineDetail;
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartLine, "qty" | "key"> & { qty?: number }) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "db_cart_v1";

function lineKey(name: string, unitPrice: number, detail?: CartLineDetail) {
  const extras = detail?.extras?.slice().sort().join(",") || "";
  const gf = detail?.glutenFree ? "gf" : "classic";
  return `${name}__${unitPrice}__${gf}__${extras}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartLine, "qty" | "key"> & { qty?: number }) => {
      const key = lineKey(item.name, item.unitPrice, item.detail);
      const qty = item.qty ?? 1;
      setItems((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) =>
            l.key === key ? { ...l, qty: l.qty + qty } : l,
          );
        }
        return [...prev, { ...item, key, qty }];
      });
      setOpen(true);
    },
    [],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
    return {
      items,
      count,
      total,
      open,
      setOpen,
      addItem,
      setQty,
      removeItem,
      clear,
    };
  }, [items, open, addItem, setQty, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
