"use server";

import { prisma } from "@/lib/prisma";
import { requirePortalUser } from "@/lib/portal-dal";

/** Marks the whole unified feed (notifications, announcements, disruptions) as seen
 * for this agent's account — read state follows the account across devices instead
 * of resetting per-browser. Disruptions share the `notificationsSeenAt` timestamp
 * rather than getting a third column, since they're alert-like in the same way. */
export async function markNotificationsSeenAction() {
  const user = await requirePortalUser();
  const now = new Date();

  await prisma.portalUser.update({
    where: { id: user.id },
    data: { notificationsSeenAt: now, announcementsSeenAt: now },
  });

  return now.toISOString();
}
