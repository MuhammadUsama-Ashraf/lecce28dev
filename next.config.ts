import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray package-lock.json sits above this folder.
  turbopack: { root: path.resolve(__dirname) },

  // Every route here is prerendered and there are no server features, so the
  // site exports to plain HTML. That also sidesteps Netlify's Next.js runtime,
  // which does not yet support Next 16.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
