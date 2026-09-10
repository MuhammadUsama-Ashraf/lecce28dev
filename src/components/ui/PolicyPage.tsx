import PageBanner from "@/components/layout/PageBanner";
import Reveal from "./Reveal";
import type { PolicySection } from "@/content/policies";
import { SUPPORT_EMAIL } from "@/content/site";

export default function PolicyPage({
  title,
  intro = [],
  sections,
}: {
  title: string;
  intro?: string[];
  sections: PolicySection[];
}) {
  return (
    <>
      <PageBanner title={title} />
      <div className="mx-auto max-w-3xl px-5 pb-24 lg:px-10 lg:pb-32">
      <Reveal immediate>
        {intro.map((p) => (
          <p key={p.slice(0, 24)} className="text-[15px] leading-[1.9] text-ink-soft">
            {p}
          </p>
        ))}
      </Reveal>

      <div className="mt-12 space-y-12">
        {sections.map((s, i) => (
          <Reveal key={s.heading} delay={i * 50} as="section">
            <h2 className="font-display text-xl leading-snug">{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mt-4 text-sm leading-[1.9] text-ink-soft">
                {p}
              </p>
            ))}
            {s.list ? (
              <ol className="mt-4 space-y-3 text-sm leading-[1.9] text-ink-soft">
                {s.list.map((item, n) => (
                  <li key={item.slice(0, 24)} className="flex gap-4">
                    <span className="shrink-0 text-gold tabular-nums">{n + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            ) : null}
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 border-t hairline pt-8">
        <p className="text-sm text-ink-soft">
          Contact us at{" "}
          <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </Reveal>
      </div>
    </>
  );
}
