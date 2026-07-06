import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    articles,
    categories,
    announcements,
    courses,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.announcement.count(),
    prisma.trainingCourse.count(),
  ]);

  return {
    articles,
    categories,
    announcements,
    courses,
  };
}

export async function getLatestArticles() {
  return prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

export async function getLatestAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}