import Image from "next/image";
import { badges } from "@/components/home/TrustBadges";

/** The six brand standards on a single line. On phones the row scrolls
 *  horizontally rather than wrapping to a second row; from sm up all six fit
 *  and the row simply centres. */
export default function BadgeRow() {
  return (
    <section aria-label="Product standards" className="bg-white py-12 lg:py-20">
      <ul
        className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-1 sm:justify-center sm:gap-7 lg:gap-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {badges.map((badge) => (
          <li key={badge.label} className="shrink-0 snap-start">
            <Image
              src={badge.src}
              alt={badge.label}
              title={badge.label}
              width={150}
              height={150}
              className="h-[112px] w-[112px] transition-transform duration-500 hover:scale-105 sm:h-[120px] sm:w-[120px] lg:h-[150px] lg:w-[150px]"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
