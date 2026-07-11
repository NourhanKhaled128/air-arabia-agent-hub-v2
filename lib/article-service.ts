import { prisma } from "@/lib/prisma";

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
    where: { status: "Published" },
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

interface ArticleSectionsInput {
  procedures?: { title?: string; content: string; image?: string }[];
  dispositions?: { code?: string; content: string; images?: string[] }[];
  escalations?: { department?: string; condition?: string; content: string; images?: string[] }[];
  notes?: { type?: string; content: string; images?: string[] }[];
  references?: { title: string; type?: string; link?: string; images?: string[] }[];
  keywords?: string[];
  scenarios?: { situation: string; response: string; images?: string[] }[];
  images?: { url: string }[];
  attachments?: { fileName: string; url: string; mimeType: string; size: number }[];
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
        code: item.code || null,
        content: item.content,
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
