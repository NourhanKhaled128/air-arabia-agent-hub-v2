import { prisma } from "@/lib/prisma";

export async function getQualityReviewsForAgent(portalUserId: number) {
  return prisma.qualityReview.findMany({
    where: { portalUserId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllQualityReviews() {
  return prisma.qualityReview.findMany({
    orderBy: { createdAt: "desc" },
    include: { portalUser: { select: { id: true, name: true, email: true } } },
  });
}

export async function getAgentQualityStats(portalUserId: number) {
  const result = await prisma.qualityReview.aggregate({
    where: { portalUserId },
    _avg: { rating: true },
    _count: { _all: true },
  });

  return {
    count: result._count._all,
    avgRating: result._avg.rating != null ? Math.round(result._avg.rating * 10) / 10 : null,
  };
}

export async function createQualityReview(data: {
  portalUserId: number;
  rating: number;
  comment: string;
  reviewerName: string;
}) {
  return prisma.qualityReview.create({ data });
}

export async function deleteQualityReview(id: number) {
  return prisma.qualityReview.delete({ where: { id } });
}
