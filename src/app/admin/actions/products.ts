"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put, del } from "@vercel/blob";
import { z } from "zod";
import { db } from "@/lib/db";
import { assertRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { parseMoneyToCents } from "@/lib/money";
import { ProductStatus } from "@/generated/prisma/enums";

export type ProductFormState = { error?: string; success?: string } | null;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const schema = z.object({
  slug: z
    .string()
    .min(2, "Give the product a URL slug.")
    .max(80)
    .regex(slugPattern, "Slug can use lower-case letters, numbers and hyphens only."),
  name: z.string().min(2, "Give the product a name.").max(140),
  status: z.enum(ProductStatus),
  priceCents: z.number().int().min(0, "Price cannot be negative."),
  compareAtCents: z.number().int().min(0).nullable(),
  scent: z.string().max(120).nullable(),
  tagline: z.string().max(240).nullable(),
  description: z.string().max(4000).nullable(),
  ingredients: z.string().max(4000).nullable(),
  directions: z.string().max(4000).nullable(),
  includes: z.array(z.string().min(1)).max(30),
  fragranceTop: z.string().max(300).nullable(),
  fragranceMiddle: z.string().max(300).nullable(),
  fragranceBase: z.string().max(300).nullable(),
  sizeLabel: z.string().max(80).nullable(),
  weight: z.string().max(80).nullable(),
  dimensions: z.string().max(120).nullable(),
  vessel: z.enum(["pump", "jar", "trio"]).nullable(),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Accent must be a hex colour like #A2662B.")
    .nullable(),
  labelKicker: z.string().max(120).nullable(),
  labelTitle: z.string().max(120).nullable(),
  heroImage: z.string().max(500).nullable(),
  rating: z.number().min(0).max(5).nullable(),
  reviewCount: z.number().int().min(0),
  stock: z.number().int().min(0),
  trackStock: z.boolean(),
  featured: z.boolean(),
  position: z.number().int().min(0),
});

function text(form: FormData, key: string): string | null {
  const value = form.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function num(form: FormData, key: string, fallback: number): number {
  const value = Number(text(form, key));
  return Number.isFinite(value) ? value : fallback;
}

function parseForm(form: FormData) {
  return schema.safeParse({
    slug: (text(form, "slug") ?? "").toLowerCase(),
    name: text(form, "name") ?? "",
    status: text(form, "status") ?? ProductStatus.ACTIVE,
    priceCents: parseMoneyToCents(text(form, "price")) ?? 0,
    compareAtCents: parseMoneyToCents(text(form, "compareAt")),
    scent: text(form, "scent"),
    tagline: text(form, "tagline"),
    description: text(form, "description"),
    ingredients: text(form, "ingredients"),
    directions: text(form, "directions"),
    includes: (text(form, "includes") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    fragranceTop: text(form, "fragranceTop"),
    fragranceMiddle: text(form, "fragranceMiddle"),
    fragranceBase: text(form, "fragranceBase"),
    sizeLabel: text(form, "sizeLabel"),
    weight: text(form, "weight"),
    dimensions: text(form, "dimensions"),
    vessel: text(form, "vessel"),
    accent: text(form, "accent"),
    labelKicker: text(form, "labelKicker"),
    labelTitle: text(form, "labelTitle"),
    heroImage: text(form, "heroImage"),
    rating: text(form, "rating") === null ? null : num(form, "rating", 0),
    reviewCount: num(form, "reviewCount", 0),
    stock: num(form, "stock", 0),
    trackStock: form.get("trackStock") === "on",
    featured: form.get("featured") === "on",
    position: num(form, "position", 0),
  });
}

export async function createProduct(
  _prev: ProductFormState,
  form: FormData,
): Promise<ProductFormState> {
  const user = await assertRole("ADMIN");
  const parsed = parseForm(form);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const clash = await db.product.findUnique({ where: { slug: parsed.data.slug } });
  if (clash) return { error: `The slug "${parsed.data.slug}" is already taken.` };

  const product = await db.product.create({ data: parsed.data });
  await logAudit({
    userId: user.id,
    action: "created",
    entity: "product",
    entityId: product.id,
    summary: product.name,
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect(`/admin/products/${product.id}?created=1`);
}

export async function updateProduct(
  _prev: ProductFormState,
  form: FormData,
): Promise<ProductFormState> {
  const user = await assertRole("STAFF");
  const id = String(form.get("id") ?? "");
  if (!id) return { error: "Missing product id." };

  const before = await db.product.findUnique({ where: { id } });
  if (!before) return { error: "That product no longer exists." };

  const parsed = parseForm(form);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  // Staff can keep the shelves straight but not move prices or publish.
  const data =
    user.role === "STAFF"
      ? { stock: parsed.data.stock, trackStock: parsed.data.trackStock }
      : parsed.data;

  if (user.role !== "STAFF" && parsed.data.slug !== before.slug) {
    const clash = await db.product.findUnique({ where: { slug: parsed.data.slug } });
    if (clash) return { error: `The slug "${parsed.data.slug}" is already taken.` };
  }

  await db.product.update({ where: { id }, data });
  await logAudit({
    userId: user.id,
    action: "updated",
    entity: "product",
    entityId: id,
    summary: before.name,
    meta:
      before.priceCents !== parsed.data.priceCents
        ? { priceCents: { from: before.priceCents, to: parsed.data.priceCents } }
        : undefined,
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
  revalidatePath(`/product/${before.slug}`);
  return { success: user.role === "STAFF" ? "Stock updated." : "Product saved." };
}

export async function setProductStatus(id: string, status: ProductStatus) {
  const user = await assertRole("ADMIN");
  const product = await db.product.update({ where: { id }, data: { status } });
  await logAudit({
    userId: user.id,
    action: "status_changed",
    entity: "product",
    entityId: id,
    summary: `${product.name} → ${status.toLowerCase()}`,
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteProduct(id: string) {
  const user = await assertRole("ADMIN");
  const product = await db.product.findUnique({
    where: { id },
    include: { _count: { select: { orderItems: true } } },
  });
  if (!product) return;

  // A product that has been ordered is archived, never removed — deleting it
  // would tear the history out of past orders.
  if (product._count.orderItems > 0) {
    await db.product.update({ where: { id }, data: { status: ProductStatus.ARCHIVED } });
    await logAudit({
      userId: user.id,
      action: "status_changed",
      entity: "product",
      entityId: id,
      summary: `${product.name} archived (has orders)`,
    });
  } else {
    await db.product.delete({ where: { id } });
    await logAudit({
      userId: user.id,
      action: "deleted",
      entity: "product",
      entityId: id,
      summary: product.name,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

/** Uploads to Vercel Blob and attaches the result to the product. */
export async function uploadProductImage(
  _prev: ProductFormState,
  form: FormData,
): Promise<ProductFormState> {
  const user = await assertRole("ADMIN");
  const productId = String(form.get("productId") ?? "");
  const file = form.get("file");

  if (!productId) return { error: "Missing product." };
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image first." };
  if (!file.type.startsWith("image/")) return { error: "That file is not an image." };
  if (file.size > 8 * 1024 * 1024) return { error: "Images must be 8MB or smaller." };
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { error: "BLOB_READ_WRITE_TOKEN is not set, so uploads are disabled." };
  }

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) return { error: "That product no longer exists." };

  const blob = await put(`products/${product.slug}/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  const count = await db.productImage.count({ where: { productId } });
  await db.productImage.create({
    data: { productId, url: blob.url, alt: product.name, position: count },
  });
  if (!product.heroImage) {
    await db.product.update({ where: { id: productId }, data: { heroImage: blob.url } });
  }

  await logAudit({
    userId: user.id,
    action: "updated",
    entity: "product",
    entityId: productId,
    summary: `image added to ${product.name}`,
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath(`/product/${product.slug}`);
  return { success: "Image uploaded." };
}

export async function deleteProductImage(imageId: string) {
  await assertRole("ADMIN");
  const image = await db.productImage.findUnique({
    where: { id: imageId },
    include: { product: true },
  });
  if (!image) return;

  // Only blobs we uploaded live on Vercel; seeded paths are static files.
  if (image.url.includes(".public.blob.vercel-storage.com")) {
    try {
      await del(image.url);
    } catch (error) {
      console.error("blob delete failed", error);
    }
  }

  await db.productImage.delete({ where: { id: imageId } });
  if (image.product.heroImage === image.url) {
    const next = await db.productImage.findFirst({
      where: { productId: image.productId },
      orderBy: { position: "asc" },
    });
    await db.product.update({
      where: { id: image.productId },
      data: { heroImage: next?.url ?? null },
    });
  }

  revalidatePath(`/admin/products/${image.productId}`);
  revalidatePath(`/product/${image.product.slug}`);
}

export async function makeHeroImage(imageId: string) {
  await assertRole("ADMIN");
  const image = await db.productImage.findUnique({ where: { id: imageId } });
  if (!image) return;
  await db.product.update({ where: { id: image.productId }, data: { heroImage: image.url } });
  revalidatePath(`/admin/products/${image.productId}`);
}
