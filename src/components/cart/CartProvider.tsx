"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products } from "@/content/products";

export type CartLine = { slug: string; qty: number };

type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "lecce28.cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  // Rehydrate after paint so the server and client agree on first render.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setLines(JSON.parse(raw) as CartLine[]);
      } catch {
        /* storage unavailable — cart just starts empty */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) {
        return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { slug, qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
    );
  }, []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => {
      const p = products.find((x) => x.slug === l.slug);
      return sum + (p ? p.price * l.qty : 0);
    }, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      add,
      remove,
      setQty,
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  }, [lines, isOpen, add, remove, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
