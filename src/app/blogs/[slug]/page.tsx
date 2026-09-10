import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import { getJournalPost, journal, SUPPORT_EMAIL } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return journal.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-20 lg:px-10 lg:py-28">
      <Reveal immediate>
        <Link href="/blogs" className="eyebrow text-ink-soft hover:text-ink">
          ← Blogs
        </Link>
        <span className="eyebrow mt-8 block text-ink-soft">{post.date}</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] font-light">
          {post.title}
        </h1>
      </Reveal>

      <div className="mt-10 space-y-6">
        {post.body.map((p, i) => (
          <Reveal key={p.slice(0, 24)} delay={i * 60}>
            <p className="text-[15px] leading-[1.95] text-ink-soft">{p}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 border-t hairline pt-8">
        <p className="text-sm text-ink-soft">
          Questions about a formula? Email{" "}
          <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block border border-ink px-8 py-4 text-[11px] uppercase tracking-[0.26em] transition-colors hover:bg-ink hover:text-sand-50"
        >
          Shop the collection
        </Link>
      </Reveal>
    </article>
  );
}
