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
