import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import { getJournalPost, journal, SUPPORT_EMAIL } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

const covers = [
  "/template/journal-1.jpg",
  "/template/journal-2.jpg",
  "/template/service.jpg",
];

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

  const cover = covers[journal.findIndex((p) => p.slug === slug) % covers.length];
  const more = journal.filter((p) => p.slug !== slug);

  return (
    <main className="flex-1">
      <article className="mx-auto max-w-3xl px-6 pt-36 pb-24 lg:px-10 lg:pt-44 lg:pb-32">
        <Reveal immediate>
          <Link href="/blogs" className="t-body text-black/55 hover:text-black">
            ← Blogs
          </Link>
          <p className="t-body mt-8 text-black/50">
            {post.date} · {post.time}
          </p>
          <h1 className="t-h2 mt-3">{post.title}</h1>
        </Reveal>

        <Reveal delay={80} className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={cover}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
          />
        </Reveal>

        <div className="mt-12 space-y-6">
          {post.body.map((p, i) => (
            <Reveal key={p.slice(0, 24)} delay={i * 60}>
              <p className="t-body text-black/75">{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 rounded-2xl bg-[var(--oc-cream)] p-8">
          <p className="t-body text-black/70">
            Questions about a formula? Email{" "}
            <a
              className="underline underline-offset-4 hover:text-black"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <Link
            href="/shop"
            className="t-nav mt-6 inline-block rounded-full bg-black px-8 py-3 text-white transition-opacity hover:opacity-85"
          >
            Shop the collection
          </Link>
        </Reveal>

        {more.length ? (
          <section className="mt-20 border-t border-black/12 pt-10">
            <h2 className="t-h3">Keep reading</h2>
            <ul className="mt-6 space-y-5">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blogs/${p.slug}`} className="group block">
                    <p className="t-body text-black/50">{p.date}</p>
                    <p className="t-stat group-hover:opacity-70">{p.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </main>
  );
}
