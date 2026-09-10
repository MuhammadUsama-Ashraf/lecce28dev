import Image from "next/image";
import Link from "next/link";
import { footerLinks, site, SUPPORT_EMAIL } from "@/content/site";

export default function Footer() {
  return (
    <footer className="bg-sand-50">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10 lg:px-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo.png"
              alt="Lecce 28"
              width={300}
              height={76}
              className="h-10 w-auto lg:h-12"
            />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-ink-soft">
              {site.tagline}
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-6 inline-flex items-center gap-3 text-[15px] text-ink-soft hover:text-ink"
            >
              <svg viewBox="0 0 20 16" className="h-4 w-5 shrink-0" fill="currentColor">
                <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h17A1.5 1.5 0 0 1 20 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 0 13.5v-11Zm2.2.5L10 8.4 17.8 3H2.2Zm16.3 1.4-8.1 5.6a.7.7 0 0 1-.8 0L1.5 4.4V13.5h17V4.4Z" />
              </svg>
              Email: {SUPPORT_EMAIL}
            </a>
          </div>

          <FooterColumn title="Quick Links">
            {footerLinks.quick.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[15px] text-ink-soft hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Support">
            {footerLinks.support.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[15px] text-ink-soft hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Social">
            <li>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[15px] text-ink-soft hover:text-ink"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07Z" />
                </svg>
                Facebook
              </a>
            </li>
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[15px] text-ink-soft hover:text-ink"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                  <circle cx="12" cy="12" r="4.2" />
                  <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            </li>
          </FooterColumn>
        </div>
      </div>

      <div className="border-t border-dashed border-ink/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-7 lg:flex-row lg:justify-between lg:px-10">
          <p className="text-sm tracking-[0.02em] text-ink uppercase">
            Copyright © 2024 by Lecce 28. All Rights Reserved.
          </p>
          <Image
            src="/images/payments.png"
            alt="Visa, MasterCard, Maestro, American Express, Discover, JCB, Diners Club, UnionPay, Apple Pay, Google Pay and Amazon Pay accepted"
            width={1024}
            height={82}
            className="h-6 w-auto lg:h-7"
          />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-base font-bold tracking-[0.04em] uppercase">{title}</h3>
      <span className="mt-2 block h-0.5 w-8 bg-ink" />
      <ul className="mt-6 space-y-4">{children}</ul>
    </div>
  );
}
