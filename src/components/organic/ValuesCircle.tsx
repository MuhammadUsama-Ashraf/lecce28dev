import Image from "next/image";
import { badges } from "@/components/home/TrustBadges";
import { pillars } from "@/content/site";

const PLACEMENT = [
  "lg:absolute lg:top-4 lg:left-0 lg:w-[262px]",
  "lg:absolute lg:top-[42%] lg:right-0 lg:w-[262px]",
  "lg:absolute lg:bottom-8 lg:left-[6%] lg:w-[262px]",
  "lg:absolute lg:-bottom-4 lg:left-1/2 lg:w-[262px]",
];

/** Circular portrait with the four pillar cards floating around it. */
export default function ValuesCircle() {
  return (
    <div className="relative mx-auto mt-14 max-w-5xl lg:mt-20 lg:h-[560px]">
      <div className="relative mx-auto h-[300px] w-[300px] overflow-hidden rounded-full sm:h-[380px] sm:w-[380px] lg:h-[440px] lg:w-[440px]">
        <Image
          src="/template/values.jpg"
          alt=""
          fill
          sizes="440px"
          className="object-cover"
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:block">
        {pillars.map((pillar, i) => (
          <div
            key={pillar.title}
            className={`rounded-2xl bg-[var(--oc-cream)] p-6 text-center ${PLACEMENT[i]}`}
          >
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white">
              <Image
                src={badges[i % badges.length].src}
                alt=""
                width={150}
                height={150}
                className="h-5 w-5"
              />
            </span>
            <h3 className="t-label mt-4">{pillar.title}</h3>
            <p className="t-body mt-3 text-black/65">{pillar.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
