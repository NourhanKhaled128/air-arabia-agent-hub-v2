import { prisma } from "@/lib/prisma";

export async function getDraftNotificationCount() {
  return prisma.notification.count({ where: { status: "Draft" } });
}

export async function getSentNotifications(limit = 20) {
  return prisma.notification.findMany({
    where: {
      OR: [
        { status: "Sent" },
        { status: "Scheduled", sendDate: { lte: new Date() } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export interface UnifiedNotification {
  id: string;
  type: "notification" | "announcement" | "disruption";
  title: string;
  message: string;
  href: string | null;
  createdAt: Date;
}

export async function getUnifiedNotifications(limit = 20): Promise<UnifiedNotification[]> {
  const now = new Date();

  const [notifications, announcements, disruptions] = await Promise.all([
    getSentNotifications(limit),

    prisma.announcement.findMany({
      where: {
        status: "Published",
        AND: [
          { OR: [{ publishDate: null }, { publishDate: { lte: now } }] },
          { OR: [{ expiryDate: null }, { expiryDate: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),

    prisma.disruption.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
  ]);

  const merged: UnifiedNotification[] = [
    ...notifications.map((n) => ({
      id: `notification-${n.id}`,
      type: "notification" as const,
      title: n.title,
      message: n.message,
      href: null,
      createdAt: n.createdAt,
    })),

    ...announcements.map((a) => ({
      id: `announcement-${a.id}`,
      type: "announcement" as const,
      title: a.title,
      message: a.content,
      href: "/",
      createdAt: a.createdAt,
    })),

    ...disruptions.map((d) => ({
      id: `disruption-${d.id}`,
      type: "disruption" as const,
      title: `Disruption: ${d.airportCode}`,
      message: d.message,
      href: "/disruptions",
      createdAt: d.createdAt,
    })),
  ];

  return merged
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

export async function getNotifications() {
  return prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getNotificationById(id: number) {
  return prisma.notification.findUnique({
    where: { id },
  });
}

export async function createNotification(data: {
  title: string;
  message: string;
  audience?: string;
  status: string;
  sendDate?: Date;
}) {
  return prisma.notification.create({
    data: {
      ...data,
      sent: data.status === "Sent",
    },
  });
}

export async function updateNotification(
  id: number,
  data: Partial<{
    title: string;
    message: string;
    audience: string;
    status: string;
    sendDate: Date | null;
  }>
) {
  return prisma.notification.update({
    where: { id },
    data: {
      ...data,
      ...(data.status ? { sent: data.status === "Sent" } : {}),
    },
  });
}

export async function deleteNotification(id: number) {
  return prisma.notification.delete({
    where: { id },
  });
}
