import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

function flattenCategory<T extends { category: { name: string } | null }>(
  article: T
): Omit<T, "category"> & { category: string } {
  const { category, ...rest } = article;
  return { ...rest, category: category?.name ?? "Uncategorized" };
}

export async function getTotalArticleViews() {
  const result = await prisma.article.aggregate({
    _sum: { viewCount: true },
  });

  return result._sum.viewCount ?? 0;
}

/** Ranks articles by "Was this helpful?" feedback volume, most-reviewed first. */
export async function getArticleFeedbackStats(limit = 10) {
  const grouped = await prisma.feedback.groupBy({
    by: ["articleId", "helpful"],
    _count: { _all: true },
  });

  const byArticle = new Map<number, { helpful: number; notHelpful: number }>();

  for (const row of grouped) {
    const entry = byArticle.get(row.articleId) ?? { helpful: 0, notHelpful: 0 };
    if (row.helpful) {
      entry.helpful += row._count._all;
    } else {
      entry.notHelpful += row._count._all;
    }
    byArticle.set(row.articleId, entry);
  }

  const articleIds = Array.from(byArticle.keys());
  const articles = articleIds.length
    ? await prisma.article.findMany({
        where: { id: { in: articleIds } },
        select: { id: true, title: true },
      })
    : [];
  const titleById = new Map(articles.map((a) => [a.id, a.title]));

  return Array.from(byArticle.entries())
    .map(([articleId, { helpful, notHelpful }]) => {
      const total = helpful + notHelpful;
      return {
        articleId,
        title: titleById.get(articleId) ?? "Untitled",
        helpful,
        notHelpful,
        total,
        ratio: total > 0 ? Math.round((helpful / total) * 100) : null,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export async function getAllArticles(opts?: { publishedOnly?: boolean }) {
  const articles = await prisma.article.findMany({
    where: opts?.publishedOnly ? { status: "Published" } : undefined,
    include: {
      category: { select: { name: true } },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return articles.map(flattenCategory);
}

export async function getArticleById(
  id: number
) {
  return prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      procedures: {
        orderBy: { stepNo: "asc" },
      },
      dispositions: true,
      escalations: true,
      notes: true,
      references: true,
      keywords: true,
      scenarios: true,
      images: true,
      attachments: true,
      chatTemplates: true,
      emailTemplates: true,
      updates: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getTrendingArticles(limit = 4) {
  const articles = await prisma.article.findMany({
    where: { status: "Published" },
    include: {
      category: { select: { name: true } },
    },
    orderBy: {
      viewCount: "desc",
    },
    take: limit,
  });

  return articles.map(flattenCategory);
}

export async function getArticlesForSearch() {
  const articles = await prisma.article.findMany({
    where: {
      status: "Published",
      OR: [{ categoryId: null }, { category: { name: { not: "Training" } } }],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: { select: { name: true } },
      overview: true,
      keywords: { select: { value: true } },
      scenarios: { select: { situation: true } },
      procedures: { select: { content: true } },
      dispositions: { select: { content: true } },
      escalations: { select: { content: true } },
      notes: { select: { content: true } },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return articles.map(flattenCategory);
}

export async function getArticlesByCategoryName(name: string) {
  const category = await prisma.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (!category) return [];

  return getArticlesByCategoryId(category.id, undefined, { publishedOnly: true });
}

export async function getArticlesByCategoryAndFolderName(
  categoryName: string,
  folderName: string
) {
  const category = await prisma.category.findFirst({
    where: { name: { equals: categoryName, mode: "insensitive" } },
  });

  if (!category) return [];

  const folder = await prisma.categoryFolder.findFirst({
    where: { categoryId: category.id, name: { equals: folderName, mode: "insensitive" } },
  });

  if (!folder) return [];

  return getArticlesByCategoryId(category.id, folder.id, { publishedOnly: true });
}

export async function getArticlesByCategoryId(
  categoryId: number,
  folderId?: number | null,
  opts?: { publishedOnly?: boolean }
) {
  const articles = await prisma.article.findMany({
    where: {
      categoryId,
      ...(folderId !== undefined ? { folderId } : {}),
      ...(opts?.publishedOnly ? { status: "Published" } : {}),
    },
    include: {
      category: { select: { name: true } },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return articles.map(flattenCategory);
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

/**
 * A shuffled batch of real situation/response pairs from published articles, for practice/role-play
 * mode. Beyond the dedicated Scenario records, this also draws from Dispositions (their `scenario` +
 * `content` fields) and Escalations (their `condition` + `content` fields) — all real, human-authored
 * "if this happens, do this" content already living on the article, just surfaced as practice questions
 * instead of hand-written a second time. Omit `count` to get the full site-wide pool, shuffled, with no repeats.
 */
export async function getRandomScenariosForPractice(count?: number) {
  const articles = await prisma.article.findMany({
    where: {
      status: "Published",
      OR: [
        { scenarios: { some: {} } },
        { dispositions: { some: { scenario: { not: null } } } },
        { escalations: { some: { condition: { not: null } } } },
      ],
    },
    select: {
      title: true,
      slug: true,
      category: { select: { name: true } },
      scenarios: { select: { id: true, situation: true, response: true } },
      dispositions: { select: { id: true, scenario: true, content: true } },
      escalations: { select: { id: true, condition: true, content: true } },
    },
  });

  const all = articles.flatMap((a) => {
    const category = a.category?.name ?? "Uncategorized";
    const base = { articleTitle: a.title, articleSlug: a.slug, category };

    const fromScenarios = a.scenarios.map((s) => ({
      id: `scenario:${s.id}`,
      situation: s.situation,
      response: s.response,
      ...base,
    }));
    const fromDispositions = a.dispositions
      .filter((d) => d.scenario?.trim())
      .map((d) => ({
        id: `disposition:${d.id}`,
        situation: d.scenario!.trim(),
        response: d.content,
        ...base,
      }));
    const fromEscalations = a.escalations
      .filter((e) => e.condition?.trim())
      .map((e) => ({
        id: `escalation:${e.id}`,
        situation: e.condition!.trim(),
        response: e.content,
        ...base,
      }));

    return [...fromScenarios, ...fromDispositions, ...fromEscalations];
  });

  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return count === undefined ? all : all.slice(0, count);
}

/** Recent Published-article Created/Updated audit events, resolved to their current title/slug/category — for a shift-change digest. */
export async function getRecentArticleChanges(limit = 15) {
  const logs = await prisma.auditLog.findMany({
    where: { entity: "Article", action: { in: ["Created", "Updated", "Published"] } },
    orderBy: { createdAt: "desc" },
    take: limit * 3,
  });

  const ids = Array.from(new Set(logs.map((l) => l.entityId).filter((id): id is number => id !== null)));

  const articles = await prisma.article.findMany({
    where: { id: { in: ids }, status: "Published" },
    include: { category: { select: { name: true } } },
  });
  const byId = new Map(articles.map((a) => [a.id, a]));

  const seen = new Set<number>();
  const results: { action: string; userName: string; createdAt: Date; article: { title: string; slug: string; category: string } }[] = [];

  for (const log of logs) {
    if (log.entityId === null || seen.has(log.entityId)) continue;
    const article = byId.get(log.entityId);
    if (!article) continue;

    seen.add(log.entityId);
    results.push({
      action: log.action,
      userName: log.userName,
      createdAt: log.createdAt,
      article: { title: article.title, slug: article.slug, category: article.category?.name ?? "Uncategorized" },
    });

    if (results.length >= limit) break;
  }

  return results;
}

/** Per-article change feed, reusing the same AuditLog data as getRecentArticleChanges
 * (the ArticleUpdate model is legacy/unused — no code populates it any more). */
export async function getArticleChangeHistory(articleId: number, limit = 10) {
  const logs = await prisma.auditLog.findMany({
    where: { entity: "Article", entityId: articleId, action: { in: ["Created", "Updated", "Published"] } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return logs.map((log) => ({ action: log.action, userName: log.userName, createdAt: log.createdAt }));
}

interface ArticleSectionsInput {
  procedures?: { title?: string; content: string; image?: string }[];
  dispositions?: { category?: string; code?: string; content: string; scenario?: string; images?: string[] }[];
  escalations?: { department?: string; condition?: string; content: string; images?: string[] }[];
  notes?: { type?: string; content: string; images?: string[] }[];
  references?: { title: string; type?: string; link?: string; images?: string[] }[];
  keywords?: string[];
  scenarios?: { situation: string; response: string; images?: string[] }[];
  images?: { url: string }[];
  attachments?: { fileName: string; url: string; mimeType: string; size: number }[];
  chatTemplates?: { title: string; content: string }[];
  emailTemplates?: { title: string; subject: string; body: string }[];
  updates?: { title: string; content: string; userName: string }[];
}

export function buildArticleSectionsCreateData(body: ArticleSectionsInput) {
  return {
    procedures: {
      create: (body.procedures ?? []).map((step, index) => ({
        stepNo: index + 1,
        title: step.title || null,
        content: step.content,
        image: step.image || null,
      })),
    },
    dispositions: {
      create: (body.dispositions ?? []).map((item) => ({
        category: item.category || null,
        code: item.code || null,
        content: item.content,
        scenario: item.scenario || null,
        images: item.images ?? [],
      })),
    },
    escalations: {
      create: (body.escalations ?? []).map((item) => ({
        department: item.department || null,
        condition: item.condition || null,
        content: item.content,
        images: item.images ?? [],
      })),
    },
    notes: {
      create: (body.notes ?? []).map((item) => ({
        type: item.type || "Information",
        content: item.content,
        images: item.images ?? [],
      })),
    },
    references: {
      create: (body.references ?? []).map((item) => ({
        title: item.title,
        type: item.type || "Internal SOP",
        link: item.link || null,
        images: item.images ?? [],
      })),
    },
    keywords: {
      create: (body.keywords ?? []).map((value) => ({ value })),
    },
    scenarios: {
      create: (body.scenarios ?? []).map((item) => ({
        situation: item.situation,
        response: item.response,
        images: item.images ?? [],
      })),
    },
    images: {
      create: (body.images ?? []).map((item) => ({
        image: item.url,
      })),
    },
    attachments: {
      create: (body.attachments ?? []).map((item) => ({
        fileName: item.fileName,
        url: item.url,
        mimeType: item.mimeType,
        size: item.size,
      })),
    },
    chatTemplates: {
      create: (body.chatTemplates ?? []).map((item) => ({
        title: item.title,
        content: item.content,
      })),
    },
    emailTemplates: {
      create: (body.emailTemplates ?? []).map((item) => ({
        title: item.title,
        subject: item.subject,
        body: item.body,
      })),
    },
    updates: {
      create: (body.updates ?? []).map((item) => ({
        title: item.title,
        content: item.content,
        userName: item.userName,
      })),
    },
  };
}

export function buildArticleSectionsReplaceData(body: ArticleSectionsInput) {
  const createData = buildArticleSectionsCreateData(body);

  return Object.fromEntries(
    Object.entries(createData).map(([relation, value]) => [
      relation,
      { deleteMany: {}, ...value },
    ])
  ) as {
    [K in keyof typeof createData]: { deleteMany: Record<string, never> } & (typeof createData)[K];
  };
}

// ---- Admin: Excel export ----

/** Export-only — deliberately no matching import. Article content is spread across
 * ~10 related tables (see getArticleById above), so a round-trip CSV/Excel import
 * risks silently corrupting structured content; the nested column here is for
 * reporting/backup, not re-import. */
export async function exportArticlesWorkbook(): Promise<Buffer> {
  const articles = await prisma.article.findMany({
    include: {
      category: { select: { name: true } },
      procedures: { orderBy: { stepNo: "asc" } },
      dispositions: true,
      escalations: true,
      notes: true,
      references: true,
      scenarios: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Articles");

  sheet.columns = [
    { header: "Title", key: "title", width: 40 },
    { header: "Slug", key: "slug", width: 30 },
    { header: "Category", key: "category", width: 24 },
    { header: "Status", key: "status", width: 12 },
    { header: "Author", key: "author", width: 20 },
    { header: "Views", key: "views", width: 10 },
    { header: "Last Updated", key: "updatedAt", width: 18 },
    { header: "Description", key: "description", width: 40 },
    { header: "Overview", key: "overview", width: 50 },
    { header: "Structured Content (JSON, not re-importable)", key: "content", width: 60 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const article of articles) {
    sheet.addRow({
      title: article.title,
      slug: article.slug,
      category: article.category?.name ?? "Uncategorized",
      status: article.status,
      author: article.author,
      views: article.viewCount,
      updatedAt: article.updatedAt.toLocaleString("en-GB"),
      description: article.description,
      overview: article.overview,
      content: JSON.stringify({
        procedures: article.procedures,
        dispositions: article.dispositions,
        escalations: article.escalations,
        notes: article.notes,
        references: article.references,
        scenarios: article.scenarios,
      }),
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
