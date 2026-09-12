import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next.js reads .env.local for the app; the Prisma CLI does not, so load it
// here too and keep one file per environment instead of two.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  // Migrations run over the direct (unpooled) connection — pgbouncer cannot
  // hold the advisory locks Prisma Migrate takes out.
  datasource: { url: env("DIRECT_URL") },
  migrations: { seed: "tsx prisma/seed.ts" },
});
