import { prisma } from "@/lib/prisma";

/** Upserted per agent/article pair — viewedAt always reflects the latest visit. */
export async function recordArticleView(portalUserId: number, articleId: number) {
  await prisma.articleView.upsert({
    where: { portalUserId_articleId: { portalUserId, articleId } },
    update: { viewedAt: new Date() },
    create: { portalUserId, articleId, viewedAt: new Date() },
  });
}

export async function getRecentlyViewedArticles(portalUserId: number, limit: number) {
  const views = await prisma.articleView.findMany({
    where: { portalUserId },
    include: { article: { select: { id: true, title: true, slug: true } } },
    orderBy: { viewedAt: "desc" },
    take: limit,
  });

  return views.map((v) => ({
    articleId: v.article.id,
    title: v.article.title,
    slug: v.article.slug,
    viewedAt: v.viewedAt,
  }));
}
