import Image from "next/image";
import WaveDivider from "./WaveDivider";

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
        {/* Title and rule only — the live banners carry nothing else. */}
        <div className="relative flex min-h-[380px] flex-col items-center justify-start px-6 pt-[196px] pb-[210px] text-center sm:min-h-[440px] lg:min-h-[500px] lg:pt-[226px] lg:pb-[260px]">
          <h1 className="t-h1 text-ink">{kicker}</h1>
          <span className="mt-5 block h-px w-16 bg-ink/60" />
        </div>

        <WaveDivider color="#ffffff" className="h-[190px] lg:h-[280px]" />
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
        <div className="relative mx-auto max-w-[1400px] px-6 pt-52 pb-24 text-center text-white lg:px-10 lg:pt-64 lg:pb-32">
          <h1 className="t-h1">{kicker}</h1>
          <p className="t-editorial mt-1">{accent}</p>
          {intro ? (
            <p className="t-body mx-auto mt-8 max-w-xl text-white/85">{intro}</p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-48 pb-14 text-center lg:px-10 lg:pt-56 lg:pb-16">
      <h1 className="t-h1">{kicker}</h1>
      <p className="t-editorial mt-1">{accent}</p>
      {intro ? (
        <p className="t-body mx-auto mt-8 max-w-xl text-[#7A7A7A]">{intro}</p>
      ) : null}
    </section>
  );
}
