import type { Metadata } from "next";
import PageBanner from "@/components/layout/PageBanner";
import Reveal from "@/components/ui/Reveal";
import { faqs, shipping, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Help & FAQs",
  description: "Most frequent questions and answers about Lecce 28 products, shipping and returns.",
};

export default function FaqPage() {
  return (
    <>
      <PageBanner title="FAQ's" subtitle="Most frequent questions and answers" />
      <div className="mx-auto max-w-4xl px-5 pb-24 lg:px-10 lg:pb-32">
      <div className=" divide-y hairline border-y hairline">
        {faqs.map((item, i) => (
          <Reveal key={item.q} delay={i * 60}>
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <h2 className="font-display text-xl leading-snug">{item.q}</h2>
                <span className="mt-1 shrink-0 text-lg transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-[1.9] text-ink-soft">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <h2 className="eyebrow text-ink-soft">Delivery time frames</h2>
        <dl className="mt-5 divide-y hairline border-y hairline">
          {shipping.map(([method, time]) => (
            <div key={method} className="flex justify-between gap-6 py-4 text-sm">
              <dt>{method}</dt>
              <dd className="text-ink-soft">{time}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-ink-soft">
          Our delivery time frames are estimates only and may vary with public holidays,
          possible courier delivery issues, and other influences (such as severe weather
          conditions).
        </p>
      </Reveal>

      <Reveal className="mt-16 border-t hairline pt-8">
        <p className="text-sm text-ink-soft">
          Still need help? Email{" "}
          <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>{" "}
          — Monday to Thursday 9AM – 7PM MST, Friday 9AM – 12PM MST.
        </p>
      </Reveal>
      </div>
    </>
  );
}
