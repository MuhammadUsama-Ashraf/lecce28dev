import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { readSession, type SessionPayload } from "@/lib/session";
import type { Role } from "@/generated/prisma/enums";

/** Rank so checks read as "at least this much access". */
const RANK: Record<Role, number> = { STAFF: 1, ADMIN: 2, OWNER: 3 };

export function atLeast(role: Role, minimum: Role) {
  return RANK[role] >= RANK[minimum];
}

/** Memoised per render pass — a page and its children share one lookup. */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  return readSession();
});

/** Session plus a database check, so a deactivated account cannot keep using
 *  a cookie that has not expired yet. */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) return null;
  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireRole(minimum: Role) {
  const user = await requireUser();
  if (!atLeast(user.role, minimum)) redirect("/admin?denied=1");
  return user;
}

/** For route handlers and server actions, where redirecting is wrong. */
export async function assertRole(minimum: Role) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  if (!atLeast(user.role, minimum)) throw new Error("You do not have access to that.");
  return user;
}
