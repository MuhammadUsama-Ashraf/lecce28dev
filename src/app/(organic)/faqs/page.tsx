import type { Metadata } from "next";
import OrganicPageHeader from "@/components/organic/OrganicPageHeader";
import Reveal from "@/components/ui/Reveal";
import { faqs, shipping, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Help & FAQs",
  description:
    "Most frequent questions and answers about Lecce 28 products, shipping and returns.",
};

export default function FaqPage() {
  return (
    <main className="flex-1">
      <OrganicPageHeader
        kicker="FAQ's"
        accent="good to know"
        intro="Most frequent questions and answers"
        wave
      />

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-24 lg:px-10 lg:pt-12 lg:pb-32">
        <div className="divide-y divide-black/12 border-y border-black/12">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <h2 className="t-stat">{item.q}</h2>
                  <span className="t-stat shrink-0 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="t-body mt-4 max-w-2xl text-[#7A7A7A]">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h2 className="t-label text-[#7A7A7A]">Delivery time frames</h2>
          <dl className="mt-5 divide-y divide-black/12 border-y border-black/12">
            {shipping.map(([method, time]) => (
              <div key={method} className="t-body flex justify-between gap-6 py-4">
                <dt>{method}</dt>
                <dd className="text-[#7A7A7A]">{time}</dd>
              </div>
            ))}
          </dl>
          <p className="t-body mt-5 text-[#7A7A7A]">
            Our delivery time frames are estimates only and may vary with public holidays,
            possible courier delivery issues, and other influences (such as severe weather
            conditions).
          </p>
        </Reveal>

        <Reveal className="mt-16 rounded-2xl bg-[var(--oc-cream)] p-8">
          <p className="t-body text-[#7A7A7A]">
            Still need help? Email{" "}
            <a
              className="underline underline-offset-4 hover:text-black"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            — Monday to Thursday 9AM – 7PM MST, Friday 9AM – 12PM MST.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
