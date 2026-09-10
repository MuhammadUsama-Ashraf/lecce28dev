"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { journal } from "@/content/site";

/** "LATEST BLOGS" — rotated heading beside a chevron-paged post slider. */
export default function LatestBlogs() {
  const [index, setIndex] = useState(0);

  const step = useCallback((delta: number) => {
    setIndex((i) => (i + delta + journal.length) % journal.length);
  }, []);

  const post = journal[index];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
      <div className="flex items-center gap-6 lg:gap-12">
        <h2
          className="shrink-0 text-[clamp(1.75rem,4vw,3.25rem)] leading-none font-light tracking-[0.04em] uppercase"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Latest Blogs
        </h2>

        <button
          onClick={() => step(-1)}
          aria-label="Previous post"
          className="shrink-0 p-2 text-3xl leading-none text-ink/30 transition-colors hover:text-ink"
        >
          ‹
        </button>

        <div className="min-h-[180px] flex-1">
          <Link key={post.slug} href={`/blogs/${post.slug}`} className="group block">
            <h3 className="max-w-2xl text-base font-bold tracking-[0.04em] uppercase group-hover:text-amber-deep">
              {post.title}
            </h3>
            <div className="mt-6 flex flex-wrap items-center gap-6 font-mono text-xs tracking-[0.1em] text-ink-soft">
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M4 0h1.5v1.5h5V0H12v1.5h2.5A1.5 1.5 0 0 1 16 3v11.5A1.5 1.5 0 0 1 14.5 16h-13A1.5 1.5 0 0 1 0 14.5V3a1.5 1.5 0 0 1 1.5-1.5H4V0Zm10.5 5.5h-13v9h13v-9Z" />
                </svg>
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="7" />
                  <path d="M8 4v4.2l2.8 1.8" strokeLinecap="round" />
                </svg>
                {post.time}
              </span>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {post.excerpt}
            </p>
          </Link>
        </div>

        <button
          onClick={() => step(1)}
          aria-label="Next post"
          className="shrink-0 p-2 text-3xl leading-none text-ink/30 transition-colors hover:text-ink"
        >
          ›
        </button>
      </div>
    </section>
  );
}
