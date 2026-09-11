import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray package-lock.json sits above this folder.
  turbopack: { root: path.resolve(__dirname) },

  // Every route is prerendered and there are no server features, so the site
  // exports to plain HTML in out/.
  //
  // Keep this while the Vercel project expects an `out/` directory. To let
  // Vercel run Next natively (and restore next/image optimisation), first set
  // Framework Preset = Next.js and clear the Output Directory override in the
  // project settings, then delete the two options below.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
