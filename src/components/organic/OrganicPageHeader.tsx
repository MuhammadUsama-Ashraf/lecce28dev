import Image from "next/image";

/** Inner-page masthead in the front page's language: uppercase sans over an
 *  italic serif line, optionally on a full-bleed image band. */
export default function OrganicPageHeader({
  kicker,
  accent,
  intro,
  image,
}: {
  kicker: string;
  accent: string;
  intro?: string;
  image?: string;
}) {
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
