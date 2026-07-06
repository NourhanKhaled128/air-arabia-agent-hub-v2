import { prisma } from "@/lib/prisma";

export async function getAllArticles() {
  return prisma.article.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function getArticleById(
  id: number
) {
  return prisma.article.findUnique({
    where: {
      id,
    },
  });
}

export async function deleteArticle(
  id: number
) {
  return prisma.article.delete({
    where: {
      id,
    },
  });
}