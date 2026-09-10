"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site, SUPPORT_EMAIL } from "@/content/site";
import { useCart } from "@/components/cart/CartProvider";

export default function Header() {
  const pathname = usePathname();
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Announcement bar — free shipping message from the live site */}
      <div className="relative overflow-hidden bg-ink text-sand-50">
        <div className="flex w-max animate-marquee py-2">
          {Array.from({ length: 2 }).map((_, group) => (
            <div key={group} className="flex shrink-0">
              {Array.from({ length: 6 }).map((__, i) => (
                <span
                  key={i}
                  className="eyebrow px-8 whitespace-nowrap text-sand-200"
                >
                  {site.announcement}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "border-ink/10 bg-sand-50/85 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-10">
          <Link href="/" aria-label="Lecce 28 home" className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="Lecce 28"
              width={150}
              height={38}
              priority
              className="h-6 w-auto lg:h-7"
            />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`eyebrow relative py-1 transition-colors ${
                    active ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-ink transition-all duration-400 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/shop"
              aria-label="Search products"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/50 transition-colors hover:bg-ink hover:text-sand-50"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="9" cy="9" r="5.5" />
                <path d="M13.2 13.2 17.5 17.5" strokeLinecap="round" />
              </svg>
            </Link>

            <button
              onClick={open}
              aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ink/50 transition-colors hover:bg-ink hover:text-sand-50"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M2.5 5h2l1.6 8.2a1.4 1.4 0 0 0 1.4 1.1h6.6a1.4 1.4 0 0 0 1.4-1.1L17 7.5H5.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="17" r="1" fill="currentColor" stroke="none" />
                <circle cx="14.5" cy="17" r="1" fill="currentColor" stroke="none" />
              </svg>
              {count > 0 ? (
                <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] tabular-nums text-sand-50">
                  {count}
                </span>
              ) : null}
            </button>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              aria-label={`Email ${SUPPORT_EMAIL}`}
              title={SUPPORT_EMAIL}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/50 transition-colors hover:bg-ink hover:text-sand-50"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="10" cy="7" r="3" />
                <path d="M4 16.5c0-2.8 2.7-4.5 6-4.5s6 1.7 6 4.5" strokeLinecap="round" />
              </svg>
            </a>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="ml-1 flex flex-col gap-1.5 lg:hidden"
            >
              <span
                className={`block h-px w-6 bg-ink transition-transform ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span className={`block h-px w-6 bg-ink ${menuOpen ? "opacity-0" : ""}`} />
              <span
                className={`block h-px w-6 bg-ink transition-transform ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-ink/10 bg-sand-50 lg:hidden ${
            menuOpen ? "max-h-96" : "max-h-0"
          } transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}
        >
          <nav className="flex flex-col px-5 py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="eyebrow border-b border-ink/5 py-4 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              onClick={() => setMenuOpen(false)}
              className="py-4 text-xs text-ink-soft"
            >
              {SUPPORT_EMAIL}
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
