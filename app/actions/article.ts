"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentPortalUser, requirePortalUser } from "@/lib/portal-dal";
import { recordArticleView } from "@/lib/article-view-service";
import { toggleBookmark, isBookmarked } from "@/lib/article-bookmark-service";

export interface CreateArticleData {
  title: string;
  categoryId?: number;
  description: string;
  overview: string;
  author: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function incrementArticleViewAction(articleId: number) {
  await prisma.article.update({
    where: { id: articleId },
    data: { viewCount: { increment: 1 } },
  });

  const user = await getCurrentPortalUser();
  if (user) await recordArticleView(user.id, articleId);
}

export async function toggleBookmarkAction(articleId: number) {
  const user = await requirePortalUser();
  return toggleBookmark(user.id, articleId);
}

export async function getIsBookmarkedAction(articleId: number) {
  const user = await getCurrentPortalUser();
  if (!user) return false;
  return isBookmarked(user.id, articleId);
}

export async function createArticle(data: CreateArticleData) {
  if (!data.title.trim()) {
    throw new Error("Title is required");
  }

  const slug = slugify(data.title);

  return prisma.article.create({
    data: {
      title: data.title,
      slug,
      categoryId: data.categoryId ?? null,
      description: data.description || "",
      overview: data.overview || "",
      author: data.author || "Unknown",
      status: "Draft",
    },
  });
}