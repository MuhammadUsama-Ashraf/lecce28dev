/** Layered dune wave that closes off the sand banner on every page.
 *  Four overlapping crests at rising opacity give the drifting depth the
 *  single-curve version lacked. */
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
      viewBox="0 0 1440 300"
      preserveAspectRatio="none"
      aria-hidden
      className={`pointer-events-none absolute left-0 w-full ${
        position === "bottom" ? "bottom-0" : "top-0 rotate-180"
      } ${className}`}
    >
      <path
        d="M0,96 C210,26 360,168 610,132 C860,96 1010,10 1230,52 C1330,72 1390,132 1440,116 L1440,300 L0,300 Z"
        fill={color}
        opacity="0.22"
      />
      <path
        d="M0,150 C230,74 380,210 630,170 C880,130 1030,46 1250,92 C1345,112 1395,176 1440,158 L1440,300 L0,300 Z"
        fill={color}
        opacity="0.4"
      />
      <path
        d="M0,206 C250,146 400,250 650,214 C900,178 1050,104 1270,146 C1358,164 1400,220 1440,204 L1440,300 L0,300 Z"
        fill={color}
        opacity="0.66"
      />
      <path
        d="M0,258 C260,206 420,286 680,258 C930,230 1080,168 1300,204 C1372,216 1408,266 1440,254 L1440,300 L0,300 Z"
        fill={color}
      />
    </svg>
  );
}
