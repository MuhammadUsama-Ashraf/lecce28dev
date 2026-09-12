"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EMPTY_QUOTE, type CartQuote } from "@/lib/quoteTypes";

export type CartLine = { slug: string; qty: number };

type CartState = {
  lines: CartLine[];
  count: number;
  /** Server-priced bag: names, sale prices, discount, shipping and total. */
  quote: CartQuote;
  /** Dollars, kept for the pieces of the UI that predate the quote. */
  subtotal: number;
  pricing: boolean;
  promoCode: string | null;
  promoError: string | null;
  isOpen: boolean;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  applyPromo: (code: string) => void;
  clearPromo: () => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "lecce28.cart";
const PROMO_KEY = "lecce28.promo";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [quote, setQuote] = useState<CartQuote>(EMPTY_QUOTE);
  const [pricing, setPricing] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const hydrated = useRef(false);

  // Rehydrate after paint so the server and client agree on first render.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) setLines(JSON.parse(raw) as CartLine[]);
        const promo = window.localStorage.getItem(PROMO_KEY);
        if (promo) setPromoCode(promo);
      } catch {
        /* storage unavailable — cart just starts empty */
      }
      hydrated.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      if (promoCode) window.localStorage.setItem(PROMO_KEY, promoCode);
      else window.localStorage.removeItem(PROMO_KEY);
    } catch {
      /* ignore */
    }
  }, [lines, promoCode]);

  // Every price on screen is the server's answer, never arithmetic done here.
  useEffect(() => {
    const controller = new AbortController();
    let live = true;

    async function price() {
      if (lines.length === 0) {
        setQuote(EMPTY_QUOTE);
        return;
      }
      setPricing(true);
      try {
        const response = await fetch("/api/cart/quote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ lines, promoCode }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("quote failed");
        const data = (await response.json()) as CartQuote;
        if (live) setQuote(data);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") console.error(error);
      } finally {
        if (live) setPricing(false);
      }
    }

    void price();
    return () => {
      live = false;
      controller.abort();
    };
  }, [lines, promoCode]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
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
        : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    return {
      lines,
      count,
      quote,
      subtotal: quote.subtotalCents / 100,
      pricing,
      promoCode,
      promoError: quote.promo && !quote.promo.ok ? quote.promo.reason : null,
      isOpen,
      add,
      remove,
      setQty,
      applyPromo: (code: string) => setPromoCode(code.trim().toUpperCase() || null),
      clearPromo: () => setPromoCode(null),
      clear: () => {
        setLines([]);
        setPromoCode(null);
      },
      open: () => setOpen(true),
      close: () => setOpen(false),
    };
  }, [lines, quote, pricing, promoCode, isOpen, add, remove, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
