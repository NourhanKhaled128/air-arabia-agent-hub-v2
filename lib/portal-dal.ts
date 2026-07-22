import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { verifyPortalSession } from "@/lib/portal-session";

export const getCurrentPortalUser = cache(async () => {
  const session = await verifyPortalSession();
  if (!session?.portalUserId) return null;

  return prisma.portalUser.findUnique({ where: { id: session.portalUserId } });
});

// Server actions are independently callable endpoints, not protected by page-level
// redirects — every mutating portal action must call this before touching data.
export async function requirePortalUser() {
  const user = await getCurrentPortalUser();

  if (!user) {
    throw new Error("Unauthorized: no active portal session.");
  }

  return user;
}
