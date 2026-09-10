import Image from "next/image";
import Link from "next/link";
import { footerLinks, site, SUPPORT_EMAIL } from "@/content/site";

/** Footer measured off the live site: white ground, 16px black column
 *  headings over a short rule, 15px #54595F links, dotted divider, then the
 *  uppercase copyright beside the accepted payment methods. */
export default function OrganicFooter() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/images/logo.png"
              alt="Lecce 28"
              width={274}
              height={70}
              className="h-[48px] w-auto sm:h-[69.77px]"
            />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-[#54595F]">
              {site.tagline}
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-5 inline-flex items-center gap-3 text-[15px] text-[#54595F] hover:text-black"
            >
              <svg viewBox="0 0 20 16" className="h-4 w-5 shrink-0" fill="currentColor">
                <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h17A1.5 1.5 0 0 1 20 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 0 13.5v-11Zm2.2.5L10 8.4 17.8 3H2.2Zm16.3 1.4-8.1 5.6a.7.7 0 0 1-.8 0L1.5 4.4V13.5h17V4.4Z" />
              </svg>
              Email: {SUPPORT_EMAIL}
            </a>
          </div>

          <FooterCol title="Quick Links">
            {footerLinks.quick.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[15px] text-[#54595F] hover:text-black">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Support">
            {footerLinks.support.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[15px] text-[#54595F] hover:text-black">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Social">
            <li>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[15px] text-[#54595F] hover:text-black"
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
                className="flex items-center gap-3 text-[15px] text-[#54595F] hover:text-black"
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
            <li>
              <Link href="/classic" className="text-[15px] text-[#54595F] hover:text-black">
                Classic site
              </Link>
            </li>
          </FooterCol>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-[1400px] border-t border-dotted border-black/40 px-6 lg:px-10">
        <div className="flex flex-col items-center gap-6 py-7 lg:flex-row lg:justify-between">
          <p className="text-[15px] tracking-[0.02em] text-black uppercase">
            {site.copyright}
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

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[16px] font-bold tracking-[0.02em] text-black uppercase">
        {title}
      </h2>
      <span className="mt-2 block h-0.5 w-10 bg-black" />
      <ul className="mt-6 space-y-4">{children}</ul>
    </div>
  );
}
