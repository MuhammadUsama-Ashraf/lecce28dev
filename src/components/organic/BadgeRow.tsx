import Image from "next/image";
import { badges } from "@/components/home/TrustBadges";

/** The six brand standards as a single centred row under the hero.
 *  A fixed 6-column grid keeps them on one line rather than letting
 *  flex-wrap orphan the last badge. */
export default function BadgeRow() {
  return (
    <section aria-label="Product standards" className="bg-white py-14 lg:py-20">
      <ul className="mx-auto grid max-w-5xl grid-cols-3 items-center justify-items-center gap-x-4 gap-y-8 px-6 sm:grid-cols-6 sm:gap-x-6 lg:gap-x-8">
        {badges.map((badge) => (
          <li key={badge.label} className="w-full">
            <Image
              src={badge.src}
              alt={badge.label}
              title={badge.label}
              width={150}
              height={150}
              className="mx-auto aspect-square w-full max-w-[120px] transition-transform duration-500 hover:scale-105"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
