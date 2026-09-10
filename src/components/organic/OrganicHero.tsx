import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

/** Full-bleed portrait, bottom-left copy, oversized wordmark on the base line. */
export default function OrganicHero() {
  return (
    <section className="relative flex h-screen min-h-[600px] flex-col overflow-hidden">
      <Image
        src="/template/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />

      <div className="relative mt-auto w-full px-6 pb-6 lg:px-10 lg:pb-3">
        <p className="t-body max-w-sm text-white">{site.tagline}</p>
        <Link
          href="/shop"
          className="t-body mt-3 inline-block border-b border-white pb-0.5 text-white transition-opacity hover:opacity-80"
        >
          Shop the collection
        </Link>
      </div>

      <div className="relative w-full overflow-hidden px-4 lg:px-6">
        <span className="t-display block w-full text-center tracking-[-0.015em] text-white select-none">
          LECCE 28
        </span>
      </div>
    </section>
  );
}
