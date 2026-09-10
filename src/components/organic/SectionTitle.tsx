/** The design's paired lockup: uppercase sans over an italic serif line. */
export default function SectionTitle({
  kicker,
  accent,
  align = "center",
  underline = false,
}: {
  kicker: string;
  accent: string;
  align?: "center" | "left";
  underline?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2 className="t-h2">{kicker}</h2>
      <p
        className={`t-editorial mt-1 ${
          underline ? "inline-block border-b border-black pb-2" : ""
        }`}
      >
        {accent}
      </p>
    </div>
  );
}
