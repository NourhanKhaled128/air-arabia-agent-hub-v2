"use server";

import { prisma } from "@/lib/prisma";

export async function createArticle(formData: {
  title: string;
  slug: string;
  category: string;
  description: string;
  overview: string;
  author: string;
}) {

  return await prisma.article.create({

    data: {

      title: formData.title,

      slug: formData.slug,

      category: formData.category,

      description: formData.description,

      overview: formData.overview,

      author: formData.author,

      status: "Draft",

    },

  });

}