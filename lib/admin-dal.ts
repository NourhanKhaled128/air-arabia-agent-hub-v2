import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export const getCurrentAdminUser = cache(async () => {
  const session = await verifySession();
  if (!session?.userId) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    include: { role: true },
  });
});

// Server actions are independently callable endpoints, not protected by page-level
// redirects — every mutating admin action must call this before touching data.
export async function requireAdminUser() {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new Error("Unauthorized: no active admin session.");
  }

  return user;
}

/** Gates high-risk areas (Users, Roles, Settings, Agent Accounts) — routine content
 * actions (articles, quizzes, etc.) intentionally keep using requireAdminUser() alone. */
export async function requirePermission(key: string) {
  const user = await requireAdminUser();

  if (!user.role.permissions.includes(key)) {
    throw new Error(`Unauthorized: missing "${key}" permission.`);
  }

  return user;
}
