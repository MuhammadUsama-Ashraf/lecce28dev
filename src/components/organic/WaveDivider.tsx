/** Layered dune wave used to close off the sand-toned bands across the site.
 *  Four overlapping crests at rising opacity give the soft, drifting depth
 *  rather than a single hard curve. */
export default function WaveDivider({
  color = "#ffffff",
  position = "bottom",
  className = "",
}: {
  /** Colour the wave resolves into — i.e. the section that follows. */
  color?: string;
  /** "bottom" closes a band; "top" opens one (the shape is mirrored). */
  position?: "bottom" | "top";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      aria-hidden
      className={`pointer-events-none absolute left-0 w-full ${
        position === "bottom" ? "bottom-0" : "top-0 rotate-180"
      } ${className}`}
    >
      <path
        d="M0,88 C170,36 300,148 520,116 C755,84 900,16 1120,54 C1282,82 1362,138 1440,116 L1440,240 L0,240 Z"
        fill={color}
        opacity="0.25"
      />
      <path
        d="M0,132 C195,74 340,180 560,148 C800,114 940,54 1160,92 C1300,116 1372,166 1440,146 L1440,240 L0,240 Z"
        fill={color}
        opacity="0.42"
      />
      <path
        d="M0,176 C215,126 360,212 580,184 C820,156 980,106 1200,138 C1322,156 1382,196 1440,182 L1440,240 L0,240 Z"
        fill={color}
        opacity="0.68"
      />
      <path
        d="M0,212 C240,172 380,236 620,212 C860,188 1020,146 1240,176 C1342,190 1392,222 1440,212 L1440,240 L0,240 Z"
        fill={color}
      />
    </svg>
  );
}
