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