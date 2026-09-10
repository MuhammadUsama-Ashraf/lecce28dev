import Image from "next/image";

/** Scattered portrait tiles, centre tile largest — the design's follow row. */
const TILES = [
  { src: "/template/follow-1.jpg", w: "w-[86px]", h: "h-[112px]", y: "translate-y-2", r: "-rotate-3" },
  { src: "/template/follow-2.jpg", w: "w-[104px]", h: "h-[136px]", y: "translate-y-8", r: "rotate-2" },
  { src: "/template/follow-3.jpg", w: "w-[112px]", h: "h-[144px]", y: "-translate-y-2", r: "-rotate-2" },
  { src: "/template/follow-4.jpg", w: "w-[188px]", h: "h-[236px]", y: "translate-y-0", r: "rotate-0" },
  { src: "/template/follow-5.jpg", w: "w-[112px]", h: "h-[144px]", y: "-translate-y-1", r: "rotate-2" },
  { src: "/template/follow-6.jpg", w: "w-[104px]", h: "h-[136px]", y: "translate-y-8", r: "-rotate-2" },
  { src: "/template/follow-7.jpg", w: "w-[86px]", h: "h-[112px]", y: "translate-y-3", r: "rotate-3" },
];

export default function FollowStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {TILES.map((t, i) => (
        <div
          key={t.src}
          className={`relative overflow-hidden rounded-md ${t.w} ${t.h} ${t.y} ${t.r} shrink-0`}
        >
          <Image
            src={t.src}
            alt=""
            fill
            sizes="200px"
            className="object-cover"
            priority={i === 3}
          />
        </div>
      ))}
    </div>
  );
}
