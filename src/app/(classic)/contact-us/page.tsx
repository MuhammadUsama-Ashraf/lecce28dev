import type { Metadata } from "next";
import Link from "next/link";
import PageBanner from "@/components/layout/PageBanner";
import ContactForm from "@/components/ui/ContactForm";
import Reveal from "@/components/ui/Reveal";
import { site, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `We welcome you to submit an online inquiry by filling out the contact form, or email ${SUPPORT_EMAIL}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageBanner
        title="Contact Us"
        subtitle="We welcome you to submit an online inquiry by filling out the contact form."
      />
      <div className="mx-auto grid max-w-7xl px-5 pb-24 lg:px-10 lg:pb-32"><div className="grid grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <Reveal>
          <ContactForm />
        </Reveal>

        <Reveal delay={140} className="space-y-10">
          <div className="border-t hairline pt-6">
            <h2 className="eyebrow text-ink-soft">Email</h2>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-3 block font-display text-2xl hover:text-amber-deep"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="border-t hairline pt-6">
            <h2 className="eyebrow text-ink-soft">Hours of Operation</h2>
            <dl className="mt-4 space-y-2 text-sm text-ink-soft">
              {site.hours.map(([day, time]) => (
                <div key={day} className="flex justify-between gap-6">
                  <dt>{day}</dt>
                  <dd className="tabular-nums">{time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-t hairline pt-6">
            <h2 className="eyebrow text-ink-soft">Explore Our Help Center</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/faqs" className="hover:underline">
                  Help &amp; FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:underline">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="border-t hairline pt-6">
            <h2 className="eyebrow text-ink-soft">Social</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={site.social.facebook} target="_blank" rel="noreferrer" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href={site.social.instagram} target="_blank" rel="noreferrer" className="hover:underline">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </Reveal>
      </div></div>
    </>
  );
}
