import Image from "next/image";

/** The silk-textured banner with the white wave that tops every inner page. */
export default function PageBanner({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-sand-300">
      <Image
        src="/images/about-2.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="relative flex h-[340px] flex-col items-center justify-center px-5 pb-16 text-center sm:h-[400px] lg:h-[430px]">
        <h1 className="font-display text-[clamp(2.25rem,5.5vw,4rem)] leading-none font-light tracking-[0.06em] text-ink uppercase">
          {title}
        </h1>
        <span className="mt-6 block h-px w-16 bg-ink/60" />
        {subtitle ? (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-soft">{subtitle}</p>
        ) : null}
      </div>

      {/* Layered wave that dissolves the banner into the page */}
      <svg
        viewBox="0 0 1440 190"
        preserveAspectRatio="none"
        aria-hidden
        className="absolute bottom-0 left-0 h-[110px] w-full lg:h-[150px]"
      >
        <path
          d="M0,120 C220,40 420,180 700,110 C960,45 1180,150 1440,80 L1440,190 L0,190 Z"
          fill="var(--color-sand-100)"
          opacity="0.65"
        />
        <path
          d="M0,150 C240,80 440,200 720,140 C980,85 1200,175 1440,120 L1440,190 L0,190 Z"
          fill="var(--color-sand-50)"
        />
      </svg>
    </section>
  );
}
