import { prisma } from "@/lib/prisma";

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
