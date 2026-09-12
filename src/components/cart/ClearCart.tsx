"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";

/** Empties the bag once the customer lands on the thank-you page. */
export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    // Only on mount: clear() changes identity whenever the cart does, and
    // depending on it would empty the bag in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
