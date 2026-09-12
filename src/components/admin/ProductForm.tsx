"use client";

import { useActionState } from "react";
import {
  createProduct,
  updateProduct,
  type ProductFormState,
} from "@/app/admin/actions/products";
import {
  Button,
  Card,
  Checkbox,
  Field,
  FormMessage,
  Input,
  Select,
  Textarea,
} from "@/components/admin/ui";
import { centsToInput } from "@/lib/money";
import type { Role } from "@/generated/prisma/enums";

export type ProductFormValues = {
  id?: string;
  slug: string;
  name: string;
  status: string;
  priceCents: number;
  compareAtCents: number | null;
  scent: string | null;
  tagline: string | null;
  description: string | null;
  ingredients: string | null;
  directions: string | null;
  includes: string[];
  fragranceTop: string | null;
  fragranceMiddle: string | null;
  fragranceBase: string | null;
  sizeLabel: string | null;
  weight: string | null;
  dimensions: string | null;
  vessel: string | null;
  accent: string | null;
  labelKicker: string | null;
  labelTitle: string | null;
  heroImage: string | null;
  rating: number | null;
  reviewCount: number;
  stock: number;
  trackStock: boolean;
  featured: boolean;
  position: number;
};

export const BLANK_PRODUCT: ProductFormValues = {
  slug: "",
  name: "",
  status: "DRAFT",
  priceCents: 0,
  compareAtCents: null,
  scent: "Fumo di Cocco",
  tagline: null,
  description: null,
  ingredients: null,
  directions: null,
  includes: [],
  fragranceTop: null,
  fragranceMiddle: null,
  fragranceBase: null,
  sizeLabel: null,
  weight: null,
  dimensions: null,
  vessel: "jar",
  accent: "#A2662B",
  labelKicker: null,
  labelTitle: null,
  heroImage: null,
  rating: null,
  reviewCount: 0,
  stock: 0,
  trackStock: true,
  featured: false,
  position: 0,
};

export default function ProductForm({
  product,
  role,
}: {
  product: ProductFormValues;
  role: Role;
}) {
  const isNew = !product.id;
  const [state, action, pending] = useActionState<ProductFormState, FormData>(
    isNew ? createProduct : updateProduct,
    null,
  );
  // Staff keep stock straight; pricing and copy are admin work.
  const locked = role === "STAFF" && !isNew;

  return (
    <form action={action} className="space-y-5">
      {product.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <FormMessage state={state} />

      {locked ? (
        <p className="rounded-lg bg-blue-50 px-4 py-3 text-[13px] text-blue-900">
          Your role can update stock. Pricing, copy and publishing are limited to admins.
        </p>
      ) : null}

      <Card title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input name="name" defaultValue={product.name} required disabled={locked} />
          </Field>
          <Field label="URL slug" hint="Appears as /product/your-slug">
            <Input name="slug" defaultValue={product.slug} required disabled={locked} />
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={product.status} disabled={locked}>
              <option value="DRAFT">Draft — hidden from the shop</option>
              <option value="ACTIVE">Active — on sale</option>
              <option value="ARCHIVED">Archived — kept for order history</option>
            </Select>
          </Field>
          <Field label="Scent">
            <Input name="scent" defaultValue={product.scent ?? ""} disabled={locked} />
          </Field>
          <Field label="Tagline" className="sm:col-span-2">
            <Input name="tagline" defaultValue={product.tagline ?? ""} disabled={locked} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea name="description" defaultValue={product.description ?? ""} rows={4} disabled={locked} />
          </Field>
        </div>
      </Card>

      <Card title="Pricing and stock">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Price" hint="In dollars, e.g. 48 or 48.50">
            <Input
              name="price"
              inputMode="decimal"
              defaultValue={centsToInput(product.priceCents)}
              required
              disabled={locked}
            />
          </Field>
          <Field label="Compare-at price" hint="Optional struck-through price">
            <Input
              name="compareAt"
              inputMode="decimal"
              defaultValue={centsToInput(product.compareAtCents)}
              disabled={locked}
            />
          </Field>
          <Field label="Stock on hand">
            <Input name="stock" type="number" min={0} defaultValue={product.stock} />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <Checkbox name="trackStock" label="Track stock" defaultChecked={product.trackStock} />
          <Checkbox name="featured" label="Feature on the home page" defaultChecked={product.featured} disabled={locked} />
        </div>
      </Card>

      <Card title="Product detail" description="Everything the product page prints.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Size" hint="e.g. 16 fl. oz. / 473 ml">
            <Input name="sizeLabel" defaultValue={product.sizeLabel ?? ""} disabled={locked} />
          </Field>
          <Field label="Weight">
            <Input name="weight" defaultValue={product.weight ?? ""} disabled={locked} />
          </Field>
          <Field label="Dimensions">
            <Input name="dimensions" defaultValue={product.dimensions ?? ""} disabled={locked} />
          </Field>
          <Field label="Bundle contents" hint="One item per line — leave empty for single products">
            <Textarea name="includes" defaultValue={product.includes.join("\n")} rows={3} disabled={locked} />
          </Field>
          <Field label="Ingredients" className="sm:col-span-2">
            <Textarea name="ingredients" defaultValue={product.ingredients ?? ""} rows={4} disabled={locked} />
          </Field>
          <Field label="Directions" className="sm:col-span-2">
            <Textarea name="directions" defaultValue={product.directions ?? ""} rows={3} disabled={locked} />
          </Field>
          <Field label="Fragrance — top notes">
            <Input name="fragranceTop" defaultValue={product.fragranceTop ?? ""} disabled={locked} />
          </Field>
          <Field label="Fragrance — middle notes">
            <Input name="fragranceMiddle" defaultValue={product.fragranceMiddle ?? ""} disabled={locked} />
          </Field>
          <Field label="Fragrance — base notes" className="sm:col-span-2">
            <Input name="fragranceBase" defaultValue={product.fragranceBase ?? ""} disabled={locked} />
          </Field>
        </div>
      </Card>

      <Card title="Presentation" description="Drives the 3D vessel and the printed label lockup.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Vessel">
            <Select name="vessel" defaultValue={product.vessel ?? "jar"} disabled={locked}>
              <option value="jar">Jar</option>
              <option value="pump">Pump bottle</option>
              <option value="trio">Trio / bundle</option>
            </Select>
          </Field>
          <Field label="Accent colour" hint="Hex, e.g. #A2662B">
            <Input name="accent" defaultValue={product.accent ?? "#A2662B"} disabled={locked} />
          </Field>
          <Field label="Label kicker" hint="Small line above the label title">
            <Input name="labelKicker" defaultValue={product.labelKicker ?? ""} disabled={locked} />
          </Field>
          <Field label="Label title">
            <Input name="labelTitle" defaultValue={product.labelTitle ?? ""} disabled={locked} />
          </Field>
          <Field label="Hero image URL" hint="Set automatically when you upload an image" className="sm:col-span-2">
            <Input name="heroImage" defaultValue={product.heroImage ?? ""} disabled={locked} />
          </Field>
          <Field label="Rating" hint="0–5, leave empty for no rating">
            <Input name="rating" type="number" step="0.1" min={0} max={5} defaultValue={product.rating ?? ""} disabled={locked} />
          </Field>
          <Field label="Review count">
            <Input name="reviewCount" type="number" min={0} defaultValue={product.reviewCount} disabled={locked} />
          </Field>
          <Field label="Sort position" hint="Lower numbers come first in the shop">
            <Input name="position" type="number" min={0} defaultValue={product.position} disabled={locked} />
          </Field>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isNew ? "Create product" : "Save changes"}
        </Button>
        <span className="text-[13px] text-neutral-500">
          {isNew ? "You can upload images once the product exists." : null}
        </span>
      </div>
    </form>
  );
}
