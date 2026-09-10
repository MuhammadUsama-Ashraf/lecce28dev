import Image from "next/image";
import Link from "next/link";
import WaveDivider from "./WaveDivider";
import { footerLinks, site, SUPPORT_EMAIL } from "@/content/site";
import FooterSubscribe from "./FooterSubscribe";

export default function OrganicFooter() {
  return (
    <>
      {/* Sand band the dune wave resolves into, ahead of the footer proper */}
      <section className="relative overflow-hidden bg-sand-300">
        <WaveDivider color="#ffffff" position="top" className="h-[120px] lg:h-[180px]" />
        <div className="relative flex flex-col items-center px-6 pt-[150px] pb-20 text-center lg:pt-[220px] lg:pb-24">
          <h2 className="t-h2 text-ink">Get In Touch With Us</h2>
          <Link
            href="/contact-us"
            className="t-nav mt-8 rounded-full border border-ink px-9 py-3 text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.5fr_0.7fr_1.1fr]">
          <div>
            <h3 className="t-label">Contact Us</h3>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="t-body mt-3 block text-white/70 hover:text-white"
            >
              {SUPPORT_EMAIL}
            </a>
            <div className="t-body mt-6 space-y-1 text-white/70">
              {site.hours.map(([day, time]) => (
                <p key={day}>
                  {day}: {time}
                </p>
              ))}
            </div>
          </div>

          <ul className="space-y-3">
            {footerLinks.quick.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="t-body text-white/70 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="space-y-3">
            {footerLinks.support.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="t-body text-white/70 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/classic" className="t-body text-white/70 hover:text-white">
                Classic site
              </Link>
            </li>
          </ul>

          <div>
            <h3 className="t-label">Stay In The Know</h3>
            <p className="t-body mt-3 text-white/70">
              Join our community today and stay up-to-date on the latest Lecce28 news and
              promotions.
            </p>
            <FooterSubscribe />
            <div className="t-body mt-6 flex gap-6 text-white/70">
              <a href={site.social.facebook} target="_blank" rel="noreferrer" className="hover:text-white">
                Facebook
              </a>
              <a href={site.social.instagram} target="_blank" rel="noreferrer" className="hover:text-white">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex w-full justify-center">
          <Image
            src="/images/logo.png"
            alt="Lecce 28"
            width={274}
            height={70}
            className="h-12 w-auto brightness-0 invert lg:h-16"
          />
        </div>

        <p className="t-body py-8 text-center text-white/50">{site.copyright}</p>
      </div>
      </footer>
    </>
  );
}
