import Image from "next/image";
import { badges } from "@/components/home/TrustBadges";
import { pillars } from "@/content/site";

// Courier sets wider than the previous face, so the cards run taller; these
// bands keep all four clear of each other and of the portrait.
const PLACEMENT = [
  "lg:absolute lg:top-0 lg:left-0 lg:w-[268px]",
  "lg:absolute lg:top-[24%] lg:right-0 lg:w-[268px]",
  "lg:absolute lg:bottom-[6%] lg:left-[2%] lg:w-[268px]",
  "lg:absolute lg:bottom-0 lg:left-[42%] lg:w-[268px]",
];

/** The brand badge that best matches each pillar, by index into `badges`:
 *  0 Made In The USA · 1 Paraben Free · 2 Cruelty Free
 *  3 No Harsh Chemicals · 4 Sulfate Free · 5 Phthalate Free */
const PILLAR_BADGE = [3, 2, 1, 5];

/** Circular portrait with the four pillar cards floating around it. */
export default function ValuesCircle() {
  return (
    <div className="relative mx-auto mt-14 max-w-5xl lg:mt-20 lg:h-[720px]">
      <div className="relative mx-auto aspect-square w-[min(300px,78vw)] overflow-hidden rounded-full sm:w-[380px] lg:w-[440px]">
        <Image
          src="/template/values.jpg"
          alt=""
          fill
          sizes="440px"
          className="object-cover"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:block">
        {pillars.map((pillar, i) => {
          const badge = badges[PILLAR_BADGE[i] ?? i];
          return (
            <div
              key={pillar.title}
              className={`rounded-2xl bg-[var(--oc-cream)] p-6 text-center ${PLACEMENT[i]}`}
            >
              <Image
                src={badge.src}
                alt={badge.label}
                title={badge.label}
                width={150}
                height={150}
                className="mx-auto h-12 w-12"
              />
              <h3 className="t-label mt-4">{pillar.title}</h3>
              <p className="t-body mt-3 text-black/65">{pillar.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
