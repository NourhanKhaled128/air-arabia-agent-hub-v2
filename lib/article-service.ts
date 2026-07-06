import { prisma } from "@/lib/prisma";

export async function getArticles() {
  return prisma.article.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getArticle(id: number) {
  return prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      procedures: true,
      dispositions: true,
      escalations: true,
      notes: true,
      references: true,
      keywords: true,
      images: true,
    },
  });
}