import { prisma } from "@/lib/prisma";

export async function getSentNotifications(limit = 20) {
  return prisma.notification.findMany({
    where: { sent: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
