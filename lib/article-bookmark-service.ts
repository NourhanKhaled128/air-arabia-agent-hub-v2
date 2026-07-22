import { prisma } from "@/lib/prisma";

export async function isBookmarked(portalUserId: number, articleId: number) {
  const existing = await prisma.articleBookmark.findUnique({
    where: { portalUserId_articleId: { portalUserId, articleId } },
  });
  return !!existing;
}

/** Returns the new bookmarked state after toggling. */
export async function toggleBookmark(portalUserId: number, articleId: number) {
  const existing = await prisma.articleBookmark.findUnique({
    where: { portalUserId_articleId: { portalUserId, articleId } },
  });

  if (existing) {
    await prisma.articleBookmark.delete({ where: { id: existing.id } });
    return false;
  }

  await prisma.articleBookmark.create({ data: { portalUserId, articleId } });
  return true;
}

export async function getBookmarkedArticles(portalUserId: number) {
  const bookmarks = await prisma.articleBookmark.findMany({
    where: { portalUserId },
    include: { article: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return bookmarks.map((b) => ({
    articleId: b.article.id,
    title: b.article.title,
    slug: b.article.slug,
  }));
}
