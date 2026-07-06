"use server";

import { prisma } from "@/lib/prisma";

interface ArticleData {
  title: string;
  category: string;
  description: string;
  overview: string;
  author: string;
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function createArticle(data: ArticleData) {
  return prisma.article.create({
    data: {
      title: data.title,
      slug: generateSlug(data.title),
      category: data.category,
      description: data.description,
      overview: data.overview,
      author: data.author,
      status: "Draft",
    },
  });
}