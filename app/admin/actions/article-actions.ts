"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteArticleAction(id: number) {
  await prisma.article.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/articles");
}

export async function publishArticleAction(id: number) {
  await prisma.article.update({
    where: {
      id,
    },
    data: {
      status: "Published",
    },
  });

  revalidatePath("/admin/articles");
}

export async function archiveArticleAction(id: number) {
  await prisma.article.update({
    where: {
      id,
    },
    data: {
      status: "Archived",
    },
  });

  revalidatePath("/admin/articles");
}

export async function duplicateArticleAction(id: number) {
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      procedures: true,
      keywords: true,
      notes: true,
      references: true,
      escalations: true,
      dispositions: true,
      images: true,
    },
  });

  if (!article) {
    throw new Error("Article not found.");
  }

  const {
    id: _id,
    createdAt,
    updatedAt,
    procedures,
    keywords,
    notes,
    references,
    escalations,
    dispositions,
    images,
    ...articleData
  } = article;

  await prisma.article.create({
    data: {
      ...articleData,
      title: `${article.title} (Copy)`,
      slug: `${article.slug}-copy-${Date.now()}`,
      status: "Draft",

      procedures: {
        create: procedures.map((item: typeof procedures[number]) => ({
          stepNo: item.stepNo,
          title: item.title,
          content: item.content,
          image: item.image,
        })),
      },

      keywords: {
        create: keywords.map((item: typeof keywords[number]) => ({
          value: item.value,
        })),
      },

      notes: {
        create: notes.map((item: typeof notes[number]) => ({
          content: item.content,
        })),
      },

      references: {
        create: references.map((item: typeof references[number]) => ({
          title: item.title,
          link: item.link,
        })),
      },

      escalations: {
        create: escalations.map((item: typeof escalations[number]) => ({
          content: item.content,
        })),
      },

      dispositions: {
        create: dispositions.map((item: typeof dispositions[number]) => ({
          content: item.content,
        })),
      },

      images: {
        create: images.map((item: typeof images[number]) => ({
          image: item.image,
        })),
      },
    },
  });

  revalidatePath("/admin/articles");
}