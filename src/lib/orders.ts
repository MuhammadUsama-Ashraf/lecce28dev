import "server-only";

import { db } from "@/lib/db";

/** Order numbers come off a counter in the settings row rather than a database
 *  sequence, so the prefix stays editable and the numbers read like L28-1042.
 *  The update is atomic, so two checkouts cannot take the same number. */
export async function nextOrderNumber() {
  const settings = await db.storeSetting.upsert({
    where: { id: "store" },
    update: { nextOrderNumber: { increment: 1 } },
    create: { id: "store", nextOrderNumber: 1002 },
  });
  // upsert returns the row after the increment, so step back one.
  const used = settings.nextOrderNumber - 1;
  return `${settings.orderPrefix}-${used}`;
}
