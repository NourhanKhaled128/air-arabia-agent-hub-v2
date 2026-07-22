"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { recordArticleView } from "@/lib/article-view-service";

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