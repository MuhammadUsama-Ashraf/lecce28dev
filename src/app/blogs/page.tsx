import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import SidebarSubscribe from "@/components/layout/SidebarSubscribe";
import Reveal from "@/components/ui/Reveal";
import { journal, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Ingredient education, scent notes and rituals from Lecce 28 — a luxury beauty brand built on naturally derived formulas.",
};

export default function BlogsPage() {
  return (
    <>
      <PageBanner title="Blogs" />

      <div className="mx-auto grid max-w-6xl gap-16 px-5 pb-24 lg:grid-cols-[1.6fr_1fr] lg:gap-20 lg:px-10 lg:pb-32">
        {/* ── Recent stories ─────────────────────────────────────────── */}
        <div>
          <Reveal immediate>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-ink" />
              <span className="eyebrow text-ink-soft">On Top</span>
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-none font-light uppercase">
              Recent Stories
            </h2>
          </Reveal>

          <div className="mt-12 space-y-12">
            {journal.map((post, i) => (
              <Reveal key={post.slug} delay={i * 90} as="article">
                <Link href={`/blogs/${post.slug}`} className="group block">
                  <h3 className="font-sans text-sm font-bold tracking-[0.06em] uppercase group-hover:text-amber-deep">
                    {post.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs tracking-[0.12em] text-ink-soft">
                    {post.date}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                    {post.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Sidebar ────────────────────────────────────────────────── */}
        <aside className="space-y-10 lg:pt-4">
          <Reveal delay={120}>
            <h2 className="text-sm font-bold tracking-[0.08em] uppercase">
              New From Lecce 28
            </h2>
            <ul className="mt-6 space-y-6">
              {journal.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blogs/${post.slug}`} className="group block">
                    <h3 className="text-sm font-bold tracking-[0.05em] uppercase group-hover:text-amber-deep">
                      {post.title}
                    </h3>
                    <p className="mt-2 font-mono text-xs tracking-[0.12em] text-ink-soft">
                      {post.date}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <SidebarSubscribe />
          </Reveal>

          <Reveal delay={280}>
            <p className="text-xs leading-relaxed text-ink-soft">
              Want us to cover a specific ingredient? Write to{" "}
              <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </Reveal>
        </aside>
      </div>
    </>
  );
}
