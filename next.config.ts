import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray package-lock.json sits above this folder.
  turbopack: { root: path.resolve(__dirname) },

  // The store runs on Vercel's Node runtime — the admin, checkout and Stripe
  // webhook all need a server, so the old static export is gone and image
  // optimisation is back on.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },

  // Prisma's query engine must not be bundled into the server chunks.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
