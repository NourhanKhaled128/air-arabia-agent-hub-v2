import { prisma } from "./prisma";

export async function getArticles() {
  return prisma.article.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getArticle(slug: string) {
  return prisma.article.findUnique({
    where: {
      slug,
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