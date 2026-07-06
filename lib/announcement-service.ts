import { prisma } from "@/lib/prisma";

export async function getAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAnnouncementById(id: number) {
  return prisma.announcement.findUnique({
    where: {
      id,
    },
  });
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  priority: string;
  status: string;
  audience?: string;
  publishDate?: Date;
  expiryDate?: Date;
}) {
  return prisma.announcement.create({
    data,
  });
}

export async function updateAnnouncement(
  id: number,
  data: Partial<{
    title: string;
    content: string;
    priority: string;
    status: string;
    audience: string;
    publishDate: Date;
    expiryDate: Date;
  }>
) {
  return prisma.announcement.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteAnnouncement(id: number) {
  return prisma.announcement.delete({
    where: {
      id,
    },
  });
}