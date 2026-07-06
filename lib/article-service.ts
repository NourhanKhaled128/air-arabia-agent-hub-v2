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
    },
  });
}

export async function getTrendingArticles(limit = 4) {
  return prisma.article.findMany({
    orderBy: {
      viewCount: "desc",
    },
    take: limit,
  });
}

export async function getArticlesByCategory(category: string) {
  return prisma.article.findMany({
    where: {
      category: {
        equals: category,
        mode: "insensitive",
      },
    },
    orderBy: {
      updatedAt: "desc",
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

interface ArticleSectionsInput {
  procedures?: { title?: string; content: string; image?: string }[];
  dispositions?: { code?: string; content: string }[];
  escalations?: { department?: string; condition?: string; content: string }[];
  notes?: { type?: string; content: string }[];
  references?: { title: string; type?: string; link?: string }[];
  keywords?: string[];
  scenarios?: { situation: string; response: string }[];
  images?: { url: string }[];
  attachments?: { fileName: string; url: string; mimeType: string; size: number }[];
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
      })),
    },
    escalations: {
      create: (body.escalations ?? []).map((item) => ({
        department: item.department || null,
        condition: item.condition || null,
        content: item.content,
      })),
    },
    notes: {
      create: (body.notes ?? []).map((item) => ({
        type: item.type || "Information",
        content: item.content,
      })),
    },
    references: {
      create: (body.references ?? []).map((item) => ({
        title: item.title,
        type: item.type || "Internal SOP",
        link: item.link || null,
      })),
    },
    keywords: {
      create: (body.keywords ?? []).map((value) => ({ value })),
    },
    scenarios: {
      create: (body.scenarios ?? []).map((item) => ({
        situation: item.situation,
        response: item.response,
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