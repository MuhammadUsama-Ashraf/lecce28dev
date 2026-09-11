import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray package-lock.json sits above this folder.
  turbopack: { root: path.resolve(__dirname) },

  // Deployed to Netlify, whose Next.js runtime does not support Next 16. Every
  // route here is prerendered and there are no server features, so the site
  // exports to plain HTML in out/ and needs no runtime at all.
  // Cost: next/image optimisation is off, so assets ship at their authored size.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
