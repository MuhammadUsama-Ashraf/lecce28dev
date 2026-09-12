/** Shapes shared by the pricing engine and the browser. Kept apart from
 *  pricing.ts so the client can import them without pulling in server code. */

export type QuoteLine = {
  slug: string;
  name: string;
  imageUrl: string | null;
  qty: number;
  listCents: number;
  unitCents: number;
  lineTotalCents: number;
  saleBadge: string | null;
};

export type QuotePromo =
  | { ok: true; code: string; label: string; discountCents: number }
  | { ok: false; reason: string };

export type CartQuote = {
  lines: QuoteLine[];
  subtotalCents: number;
  saleSavingsCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  promo: QuotePromo | null;
  freeShippingOverCents: number;
};

export const EMPTY_QUOTE: CartQuote = {
  lines: [],
  subtotalCents: 0,
  saleSavingsCents: 0,
  discountCents: 0,
  shippingCents: 0,
  taxCents: 0,
  totalCents: 0,
  currency: "usd",
  promo: null,
  freeShippingOverCents: 10_000,
};
