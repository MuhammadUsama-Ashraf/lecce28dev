"use client";

import Image from "next/image";
import { useActionState, useTransition } from "react";
import {
  deleteProductImage,
  makeHeroImage,
  uploadProductImage,
  type ProductFormState,
} from "@/app/admin/actions/products";
import { Button, Card, FormMessage, Input } from "@/components/admin/ui";

export default function ProductImages({
  productId,
  heroImage,
  images,
  canEdit,
}: {
  productId: string;
  heroImage: string | null;
  images: { id: string; url: string; alt: string | null }[];
  canEdit: boolean;
}) {
  const [state, action, pending] = useActionState<ProductFormState, FormData>(
    uploadProductImage,
    null,
  );
  const [busy, startTransition] = useTransition();

  return (
    <Card title="Images" description="The first image is the one the shop grid uses." className="h-fit">
      <div className="space-y-3">
        {images.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-center text-[13px] text-neutral-500">
            No images yet.
          </p>
        ) : (
          images.map((image) => (
            <div key={image.id} className="flex items-center gap-3 rounded-lg border border-neutral-200 p-2">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                <Image src={image.url} alt={image.alt ?? ""} fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] text-neutral-500">{image.url.split("/").pop()}</p>
                {heroImage === image.url ? (
                  <p className="mt-1 text-[12px] font-medium text-emerald-700">Hero image</p>
                ) : canEdit ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => startTransition(() => void makeHeroImage(image.id))}
                    className="mt-1 text-[12px] text-neutral-600 hover:underline"
                  >
                    Make hero
                  </button>
                ) : null}
              </div>
              {canEdit ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => startTransition(() => void deleteProductImage(image.id))}
                  className="shrink-0 rounded-md px-2 py-1 text-[12px] text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>

      {canEdit ? (
        <form action={action} className="mt-4 space-y-3 border-t border-neutral-200 pt-4">
          <input type="hidden" name="productId" value={productId} />
          <FormMessage state={state} />
          <Input type="file" name="file" accept="image/*" required />
          <Button type="submit" tone="secondary" disabled={pending} className="w-full">
            {pending ? "Uploading…" : "Upload image"}
          </Button>
          <p className="text-[12px] text-neutral-500">
            JPEG, PNG or WebP up to 8MB. Stored on Vercel Blob.
          </p>
        </form>
      ) : null}
    </Card>
  );
}
