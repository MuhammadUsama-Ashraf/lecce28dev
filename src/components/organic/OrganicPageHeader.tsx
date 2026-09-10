import Image from "next/image";

/** Inner-page masthead in the front page's language: uppercase sans over an
 *  italic serif line, optionally on a full-bleed image band. */
export default function OrganicPageHeader({
  kicker,
  accent,
  intro,
  image,
  wave = false,
}: {
  kicker: string;
  accent: string;
  intro?: string;
  image?: string;
  /** Silk-textured band closed off by the brand's layered wave. */
  wave?: boolean;
}) {
  if (wave) {
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
        <div className="relative flex min-h-[300px] flex-col items-center justify-center px-6 pt-[84px] pb-24 text-center sm:min-h-[360px] lg:min-h-[400px] lg:pb-28">
          <h1 className="t-h2 text-ink">{kicker}</h1>
          {accent ? <p className="t-editorial mt-1 text-ink">{accent}</p> : null}
          <span className="mt-5 block h-px w-16 bg-ink/60" />
          {intro ? (
            <p className="t-body mx-auto mt-6 max-w-xl text-ink-soft">{intro}</p>
          ) : null}
        </div>

        <svg
          viewBox="0 0 1440 190"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute bottom-0 left-0 h-[90px] w-full lg:h-[130px]"
        >
          <path
            d="M0,120 C220,40 420,180 700,110 C960,45 1180,150 1440,80 L1440,190 L0,190 Z"
            fill="var(--oc-sand)"
            opacity="0.7"
          />
          <path
            d="M0,150 C240,80 440,200 720,140 C980,85 1200,175 1440,120 L1440,190 L0,190 Z"
            fill="#ffffff"
          />
        </svg>
      </section>
    );
  }

  if (image) {
    return (
      <section className="relative overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-[1400px] px-6 pt-40 pb-24 text-center text-white lg:px-10 lg:pt-52 lg:pb-32">
          <h1 className="t-h2">{kicker}</h1>
          <p className="t-editorial mt-1">{accent}</p>
          {intro ? (
            <p className="t-body mx-auto mt-8 max-w-xl text-white/85">{intro}</p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-36 pb-14 text-center lg:px-10 lg:pt-44 lg:pb-16">
      <h1 className="t-h2">{kicker}</h1>
      <p className="t-editorial mt-1">{accent}</p>
      {intro ? (
        <p className="t-body mx-auto mt-8 max-w-xl text-black/65">{intro}</p>
      ) : null}
    </section>
  );
}
