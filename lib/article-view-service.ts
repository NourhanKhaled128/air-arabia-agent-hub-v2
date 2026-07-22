import { prisma } from "@/lib/prisma";
import { CUSTOMER_SUPPORT_TEAM_GROUP } from "@/lib/customer-support-team";
import { TRADE_SUPPORT_TEAM_GROUP } from "@/lib/trade-support-team";

/** Upserted per agent/article pair — viewedAt always reflects the latest visit. */
export async function recordArticleView(portalUserId: number, articleId: number) {
  await prisma.articleView.upsert({
    where: { portalUserId_articleId: { portalUserId, articleId } },
    update: { viewedAt: new Date() },
    create: { portalUserId, articleId, viewedAt: new Date() },
  });
}

/** An article's "home" section is determined by its category's group, not by
 * whichever route it happened to be clicked from — Knowledge/CustomerSupportTeam/
 * TradeSupportTeam are separate routes for the same article, so linking back to the
 * wrong one drops the agent into the wrong breadcrumb/sidebar context. */
function basePathForGroup(group: string | undefined) {
  if (group === CUSTOMER_SUPPORT_TEAM_GROUP) return "/CustomerSupportTeam";
  if (group === TRADE_SUPPORT_TEAM_GROUP) return "/TradeSupportTeam";
  return "/Knowledge";
}

/** Batched (not N+1) lookup of when this agent last viewed each of the given articles. */
export async function getViewedTimestamps(portalUserId: number, articleIds: number[]) {
  if (articleIds.length === 0) return new Map<number, Date>();

  const views = await prisma.articleView.findMany({
    where: { portalUserId, articleId: { in: articleIds } },
    select: { articleId: true, viewedAt: true },
  });

  return new Map(views.map((v) => [v.articleId, v.viewedAt]));
}

export async function getRecentlyViewedArticles(portalUserId: number, limit: number) {
  const views = await prisma.articleView.findMany({
    where: { portalUserId },
    include: {
      article: {
        select: { id: true, title: true, slug: true, category: { select: { group: true } } },
      },
    },
    orderBy: { viewedAt: "desc" },
    take: limit,
  });

  return views.map((v) => ({
    articleId: v.article.id,
    title: v.article.title,
    slug: v.article.slug,
    viewedAt: v.viewedAt,
    basePath: basePathForGroup(v.article.category?.group),
  }));
}
