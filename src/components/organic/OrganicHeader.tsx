"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, SUPPORT_EMAIL } from "@/content/site";
import { useCart } from "@/components/cart/CartProvider";

/** Solid on phones, where a transparent nav is unreadable against the hero
 *  artwork. From lg up it floats over the banner so the artwork runs to the
 *  top of the page, turning solid once scrolling puts content behind it. */
export default function OrganicHeader() {
  const { count, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const tone = "text-black";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "bg-white/92 backdrop-blur-md"
          : "bg-white/95 backdrop-blur-md lg:bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-8 px-6 py-5 lg:px-10">
        <Link href="/" aria-label="Lecce 28 home" className={`shrink-0 ${tone}`}>
          <Image
            src="/images/logo.png"
            alt="Lecce 28"
            width={261}
            height={67}
            priority
            className="h-[44px] w-auto sm:h-[66.55px]"
          />
        </Link>

        <nav className="hidden items-center lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-[20px] py-[13px] text-[16px] transition-opacity hover:opacity-70 ${tone}`}
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
            className="t-nav group flex items-center gap-2 rounded-full border border-black px-6 py-2 text-black transition-colors hover:bg-black hover:text-white"
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
            className="t-body py-4 text-[#7A7A7A]"
          >
            {SUPPORT_EMAIL}
          </a>
        </nav>
      </div>
    </header>
  );
}
