import { prisma } from "@/lib/prisma";

export async function createContentSuggestion(data: {
  articleId: number;
  portalUserId?: number;
  description: string;
}) {
  return prisma.contentSuggestion.create({ data });
}

export async function getContentSuggestions() {
  return prisma.contentSuggestion.findMany({
    include: { article: { select: { title: true, slug: true } }, portalUser: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewContentSuggestionCount() {
  return prisma.contentSuggestion.count({ where: { status: "New" } });
}

export async function resolveContentSuggestion(id: number) {
  return prisma.contentSuggestion.update({ where: { id }, data: { status: "Resolved" } });
}

export async function deleteContentSuggestion(id: number) {
  return prisma.contentSuggestion.delete({ where: { id } });
}
