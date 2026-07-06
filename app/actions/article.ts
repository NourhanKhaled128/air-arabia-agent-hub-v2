"use server";

import { prisma } from "@/lib/prisma";

export interface CreateArticleData {
  title: string;
  category: string;
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

export async function createArticle(data: CreateArticleData) {
  if (!data.title.trim()) {
    throw new Error("Title is required");
  }

  const slug = slugify(data.title);

  return prisma.article.create({
    data: {
      title: data.title,
      slug,
      category: data.category || "",
      description: data.description || "",
      overview: data.overview || "",
      author: data.author || "Unknown",
      status: "Draft",
    },
  });
}