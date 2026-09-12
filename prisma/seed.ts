/**
 * Seeds a fresh database from the catalogue the storefront shipped with, plus
 * the first owner account and the store settings row.
 *
 * Safe to re-run: products are upserted by slug and nothing is deleted.
 *
 *   npm run db:seed
 */
import { config as loadEnv } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { products } from "../src/content/products";

loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("Set DATABASE_URL / DIRECT_URL before seeding.");

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  await db.storeSetting.upsert({
    where: { id: "store" },
    update: {},
    create: { id: "store", freeShippingOverCents: 10_000, flatShippingCents: 900 },
  });
  console.log("· store settings ready");

  const email = (process.env.SEED_ADMIN_EMAIL ?? "support@lecce28.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`· owner ${email} already exists, left untouched`);
  } else {
    await db.user.create({
      data: {
        email,
        name: process.env.SEED_ADMIN_NAME ?? "Lecce 28",
        passwordHash: await bcrypt.hash(password, 12),
        role: "OWNER",
      },
    });
    console.log(`· owner created: ${email} / ${password}  ← change this password`);
  }

  let index = 0;
  for (const p of products) {
    const priceCents = Math.round(p.price * 100);
    const data = {
      name: p.name,
      status: "ACTIVE" as const,
      priceCents,
      scent: p.scent,
      tagline: p.tagline,
      description: p.description,
      ingredients: p.ingredients,
      directions: p.directions,
      includes: p.includes ?? [],
      fragranceTop: p.fragrance?.top ?? null,
      fragranceMiddle: p.fragrance?.middle ?? null,
      fragranceBase: p.fragrance?.base ?? null,
      sizeLabel: p.size ?? null,
      weight: p.weight,
      dimensions: p.dimensions,
      vessel: p.vessel,
      accent: p.accent,
      labelKicker: p.label.kicker,
      labelTitle: p.label.title,
      heroImage: p.image,
      rating: p.rating,
      reviewCount: p.reviews,
      stock: 25,
      position: index++,
    };

    const product = await db.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });

    const hasImage = await db.productImage.findFirst({
      where: { productId: product.id, url: p.image },
    });
    if (!hasImage) {
      await db.productImage.create({
        data: { productId: product.id, url: p.image, alt: p.name, position: 0 },
      });
    }
  }
  console.log(`· ${products.length} products upserted`);

  const promoCount = await db.promoCode.count();
  if (promoCount === 0) {
    await db.promoCode.create({
      data: {
        code: "WELCOME10",
        description: "10% off a first order",
        discountType: "PERCENT",
        value: 10,
        minSubtotalCents: 5_000,
        isActive: true,
      },
    });
    console.log("· example promo code WELCOME10 created");
  }
}

main()
  .then(() => console.log("seed complete"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
