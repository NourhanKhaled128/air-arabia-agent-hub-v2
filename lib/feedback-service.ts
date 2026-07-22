import { prisma } from "@/lib/prisma";

export async function getFeedback() {
  return prisma.feedback.findMany({
    include: { article: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFeedback(data: {
  articleId: number;
  authorName?: string;
  portalUserId?: number;
  helpful: boolean;
  message?: string;
}) {
  return prisma.feedback.create({
    data: {
      articleId: data.articleId,
      authorName: data.authorName?.trim() || null,
      portalUserId: data.portalUserId,
      helpful: data.helpful,
      message: data.message?.trim() || null,
    },
  });
}

export async function getFeedbackByPortalUser(portalUserId: number) {
  return prisma.feedback.findMany({
    where: { portalUserId },
    include: { article: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function markFeedbackReviewed(id: number) {
  return prisma.feedback.update({
    where: { id },
    data: { status: "Reviewed" },
  });
}

export async function deleteFeedback(id: number) {
  return prisma.feedback.delete({ where: { id } });
}

export async function deleteManyFeedback(ids: number[]) {
  return prisma.feedback.deleteMany({ where: { id: { in: ids } } });
}
