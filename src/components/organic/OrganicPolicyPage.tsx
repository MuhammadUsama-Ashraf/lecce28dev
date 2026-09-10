import OrganicPageHeader from "./OrganicPageHeader";
import Reveal from "@/components/ui/Reveal";
import type { PolicySection } from "@/content/policies";
import { SUPPORT_EMAIL } from "@/content/site";

export default function OrganicPolicyPage({
  kicker,
  accent,
  intro = [],
  sections,
}: {
  kicker: string;
  accent: string;
  intro?: string[];
  sections: PolicySection[];
}) {
  return (
    <main className="flex-1">
      <OrganicPageHeader kicker={kicker} accent={accent} wave />

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-24 lg:px-10 lg:pt-12 lg:pb-32">
        {intro.length ? (
          <Reveal className="space-y-4">
            {intro.map((p) => (
              <p key={p.slice(0, 24)} className="t-body text-[#7A7A7A]">
                {p}
              </p>
            ))}
          </Reveal>
        ) : null}

        <div className="mt-12 space-y-12">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 50} as="section">
              <h2 className="t-h3">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="t-body mt-4 text-[#7A7A7A]">
                  {p}
                </p>
              ))}
              {s.list ? (
                <ol className="mt-4 space-y-3">
                  {s.list.map((item, n) => (
                    <li key={item.slice(0, 24)} className="t-body flex gap-4 text-[#7A7A7A]">
                      <span className="shrink-0 tabular-nums text-black/40">{n + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 rounded-2xl bg-[var(--oc-cream)] p-8">
          <p className="t-body text-[#7A7A7A]">
            Contact us at{" "}
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
