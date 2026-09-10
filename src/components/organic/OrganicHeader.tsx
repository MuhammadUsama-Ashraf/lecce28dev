"use client";

import Link from "next/link";
import { useState } from "react";
import { nav, SUPPORT_EMAIL } from "@/content/site";
import { useCart } from "@/components/cart/CartProvider";

/** Solid nav on every route — the hero slides are light-toned artwork, so
 *  white nav text would be unreadable over them. */
export default function OrganicHeader() {
  const { count, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const solid = true;
  const tone = "text-black";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-white/92 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-8 px-6 py-5 lg:px-10">
        <Link href="/" aria-label="Lecce 28 home" className={`shrink-0 ${tone}`}>
          <span className="t-nav text-[26px] leading-none font-semibold tracking-[0.01em]">
            LECCE<span className="font-semibold">28</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`t-nav transition-opacity hover:opacity-70 ${tone}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className={`t-body hidden transition-opacity hover:opacity-70 xl:inline ${tone}`}
          >
            {SUPPORT_EMAIL}
          </a>
          <button
            onClick={open}
            className={`t-nav group flex items-center gap-2 rounded-full border px-6 py-2 transition-colors ${
              solid
                ? "border-black text-black hover:bg-black hover:text-white"
                : "border-white/70 text-white hover:bg-white hover:text-ink"
            }`}
          >
            Cart{count > 0 ? ` (${count})` : ""}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className={`flex flex-col gap-1.5 lg:hidden ${tone}`}
          >
            <span
              className={`block h-px w-6 bg-current transition-transform ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span className={`block h-px w-6 bg-current ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-px w-6 bg-current transition-transform ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden bg-white lg:hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        } transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}
      >
        <nav className="flex flex-col px-6 py-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="t-nav border-b border-black/10 py-4 text-black last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            onClick={() => setMenuOpen(false)}
            className="t-body py-4 text-black/60"
          >
            {SUPPORT_EMAIL}
          </a>
        </nav>
      </div>
    </header>
  );
}
