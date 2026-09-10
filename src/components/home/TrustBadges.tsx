import Image from "next/image";

export const badges = [
  { src: "/images/badge-01.webp", label: "Made In The USA" },
  { src: "/images/badge-02.webp", label: "Paraben Free" },
  { src: "/images/badge-03.webp", label: "Cruelty Free" },
  { src: "/images/badge-04.webp", label: "No Harsh Chemicals" },
  { src: "/images/badge-05.webp", label: "Sulfate Free" },
  { src: "/images/badge-06-2.webp", label: "Phthalate Free" },
];

export default function TrustBadges() {
  return (
    <section aria-label="Product standards" className="bg-sand-50 py-12 lg:py-16">
      <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-8 px-5 sm:gap-x-12">
        {badges.map((badge) => (
          <li key={badge.label} className="shrink-0">
            <Image
              src={badge.src}
              alt={badge.label}
              width={150}
              height={150}
              className="h-16 w-16 transition-transform duration-500 hover:scale-110 sm:h-[72px] sm:w-[72px]"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
