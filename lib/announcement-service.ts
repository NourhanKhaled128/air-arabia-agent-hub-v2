import { prisma } from "@/lib/prisma";

export async function getAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

/** Published announcements for the portal-facing Announcements page — mirrors the Article status convention (Draft/Scheduled never shown to champions). `teamId` is the viewing agent's own team — pass null if they have none. */
export async function getPublishedAnnouncements(teamId?: number | null) {
  return prisma.announcement.findMany({
    where: {
      status: "Published",
      ...(teamId !== undefined ? { OR: [{ teamId: null }, { teamId }] } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getPlatformUpdates() {
  return prisma.announcement.findMany({
    where: { isPlatformUpdate: true, status: "Published" },
    orderBy: { createdAt: "desc" },
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
  teamId?: number | null;
  isPlatformUpdate?: boolean;
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
    teamId: number | null;
    isPlatformUpdate: boolean;
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