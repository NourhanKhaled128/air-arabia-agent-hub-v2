"use server";

import { prisma } from "@/lib/prisma";

export async function createArticle(data: {
  title: string;
  slug: string;
  category: string;
  description: string;
  overview: string;
  author: string;
}) {
  return await prisma.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      category: data.category,
      description: data.description,
      overview: data.overview,
      author: data.author,
      status: "Draft",
    },
  });
}