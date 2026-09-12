import "server-only";

import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

type Entry = {
  userId?: string | null;
  action: "created" | "updated" | "deleted" | "status_changed" | "signed_in" | "refunded";
  entity: "product" | "promo_code" | "sale" | "order" | "user" | "settings";
  entityId: string;
  summary?: string;
  meta?: Prisma.InputJsonValue;
};

/** Best-effort: an audit write must never take down the action it records. */
export async function logAudit(entry: Entry) {
  try {
    await db.auditLog.create({
      data: {
        userId: entry.userId ?? null,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        summary: entry.summary,
        meta: entry.meta,
      },
    });
  } catch (error) {
    console.error("audit log failed", error);
  }
}
