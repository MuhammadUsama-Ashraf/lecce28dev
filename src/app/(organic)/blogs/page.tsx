import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OrganicPageHeader from "@/components/organic/OrganicPageHeader";
import Reveal from "@/components/ui/Reveal";
import { journal, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Ingredient education, scent notes and rituals from Lecce 28 — a luxury beauty brand built on naturally derived formulas.",
};

const covers = [
  "/template/journal-1.jpg",
  "/template/journal-2.jpg",
  "/template/service.jpg",
];

export default function BlogsPage() {
  return (
    <main className="flex-1">
      <OrganicPageHeader kicker="Blogs" accent="" wave />

      <section className="mx-auto max-w-[1400px] px-6 pt-8 pb-24 lg:px-10 lg:pt-12 lg:pb-32">
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-black" />
            <span className="text-[13px] tracking-[0.18em] text-black uppercase">On Top</span>
          </div>
          <h2 className="t-h2 mt-3">Recent Stories</h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {journal.map((post, i) => (
            <Reveal key={post.slug} delay={i * 100} as="article">
              <Link href={`/blogs/${post.slug}`} className="group block">
                <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
                  <Image
                    src={covers[i % covers.length]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                </div>
                <p className="t-body mt-5 text-[#7A7A7A]">
                  {post.date} · {post.time}
                </p>
                <h2 className="t-h3 mt-2">{post.title}</h2>
                <p className="t-body mt-3 text-[#7A7A7A]">{post.excerpt}</p>
                <span className="t-body mt-4 inline-block border-b border-black pb-0.5">
                  Read More
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 rounded-2xl bg-[var(--oc-cream)] p-8 text-center">
          <p className="t-body text-[#7A7A7A]">
            Want us to cover a specific ingredient? Write to{" "}
            <a
              className="underline underline-offset-4 hover:text-black"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </Reveal>
      </section>
    </main>
  );
}
