import type { Metadata } from "next";
import Link from "next/link";
import OrganicPageHeader from "@/components/organic/OrganicPageHeader";
import ContactForm from "@/components/ui/ContactForm";
import Reveal from "@/components/ui/Reveal";
import { site, SUPPORT_EMAIL } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `We welcome you to submit an online inquiry by filling out the contact form, or email ${SUPPORT_EMAIL}.`,
};

export default function ContactPage() {
  return (
    <main className="flex-1">
      <OrganicPageHeader kicker="Contact Us" accent="" wave />

      <section className="mx-auto max-w-[1400px] px-6 pt-8 pb-24 lg:px-10 lg:pt-12 lg:pb-32">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={120} className="space-y-10">
            <div className="rounded-2xl bg-[var(--oc-cream)] p-8">
              <h2 className="t-label text-[#7A7A7A]">Email</h2>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="t-stat mt-3 block hover:opacity-70"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="border-t border-black/12 pt-6">
              <h2 className="t-label text-[#7A7A7A]">Hours of Operation</h2>
              <dl className="mt-4 space-y-2">
                {site.hours.map(([day, time]) => (
                  <div key={day} className="t-body flex justify-between gap-6 text-[#7A7A7A]">
                    <dt>{day}</dt>
                    <dd className="tabular-nums">{time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border-t border-black/12 pt-6">
              <h2 className="t-h2">Explore Our Help Center</h2>
            <p className="t-body mt-4 text-[#7A7A7A]">
              We welcome you to submit an online inquiry by filling out the contact form.
            </p>
              <ul className="mt-4 space-y-2">
                {[
                  { href: "/faqs", label: "Help & FAQs" },
                  { href: "/privacy-policy", label: "Privacy Policy" },
                  { href: "/terms-conditions", label: "Terms & Conditions" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="t-body text-[#7A7A7A] hover:text-black">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-black/12 pt-6">
              <h2 className="t-label text-[#7A7A7A]">Social</h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="t-body text-[#7A7A7A] hover:text-black"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="t-body text-[#7A7A7A] hover:text-black"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
