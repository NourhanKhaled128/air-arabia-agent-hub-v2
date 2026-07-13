import { prisma } from "@/lib/prisma";

export async function getComments() {
  return prisma.comment.findMany({
    include: { article: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApprovedCommentsForArticle(articleId: number) {
  return prisma.comment.findMany({
    where: { articleId, status: "Approved" },
    orderBy: { createdAt: "desc" },
  });
}

export async function createComment(data: {
  articleId: number;
  authorName?: string;
  content: string;
}) {
  return prisma.comment.create({
    data: {
      articleId: data.articleId,
      authorName: data.authorName?.trim() || "Champion",
      content: data.content,
    },
  });
}

export async function approveComment(id: number) {
  return prisma.comment.update({
    where: { id },
    data: { status: "Approved" },
  });
}

export async function deleteComment(id: number) {
  return prisma.comment.delete({ where: { id } });
}

export async function deleteManyComments(ids: number[]) {
  return prisma.comment.deleteMany({ where: { id: { in: ids } } });
}
