import Link from "next/link";
import { footerLinks, site, SUPPORT_EMAIL } from "@/content/site";

export default function OrganicFooter() {
  return (
    <footer className="bg-[#17120e] text-white">
      <div className="mx-auto max-w-[1400px] px-6 pt-20 pb-10 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="text-3xl leading-none font-light">
              LECCE<span className="font-semibold">28</span>
            </p>
            <p className="mt-6 max-w-xs text-[17px] leading-[1.5] text-white/70">
              {site.tagline}
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-6 inline-block border-b border-white/40 pb-1 text-[15px] text-white/90 hover:border-white"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <FooterCol title="Shop">
            {footerLinks.quick.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[15px] text-white/70 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Support">
            {footerLinks.support.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[15px] text-white/70 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Follow">
            <li>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-[15px] text-white/70 hover:text-white"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-[15px] text-white/70 hover:text-white"
              >
                Instagram
              </a>
            </li>
            <li>
              <Link href="/classic" className="text-[15px] text-white/70 hover:text-white">
                Classic site
              </Link>
            </li>
          </FooterCol>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 text-[13px] text-white/50 lg:flex-row lg:items-center lg:justify-between">
          <p>{site.copyright}</p>
          <p>{site.announcement}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[13px] tracking-[0.18em] text-white/45 uppercase">{title}</h3>
      <ul className="mt-6 space-y-3.5">{children}</ul>
    </div>
  );
}
