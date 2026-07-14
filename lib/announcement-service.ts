import { prisma } from "@/lib/prisma";

export async function getAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

/** Published announcements for the portal-facing Announcements page — mirrors the Article status convention (Draft/Scheduled never shown to champions). */
export async function getPublishedAnnouncements() {
  return prisma.announcement.findMany({
    where: {
      status: "Published",
    },
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