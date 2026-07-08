import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoriesWithFolders() {
  return prisma.category.findMany({
    include: {
      folders: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getVisibleCategoriesForSidebar() {
  return prisma.category.findMany({
    where: {
      visible: true,
    },
    include: {
      folders: {
        where: { visible: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: [
      { group: "asc" },
      { order: "asc" },
    ],
  });
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({
    where: {
      id,
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: {
      slug,
    },
  });
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  visible?: boolean;
  order?: number;
  group?: string;
}) {
  return prisma.category.create({
    data,
  });
}

export async function updateCategory(
  id: number,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
    icon?: string;
    visible?: boolean;
    order?: number;
    group?: string;
  }
) {
  return prisma.category.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({
    where: {
      id,
    },
  });
}

export async function getArticleCountsByCategory() {
  const counts = await prisma.article.groupBy({
    by: ["categoryId"],
    _count: {
      _all: true,
    },
  });

  return Object.fromEntries(
    counts
      .filter((row) => row.categoryId !== null)
      .map((row) => [String(row.categoryId), row._count._all])
  ) as Record<string, number>;
}

export async function getCategoryFolders(categoryId: number) {
  return prisma.categoryFolder.findMany({
    where: { categoryId },
    orderBy: { order: "asc" },
  });
}

export async function getFolderArticleCounts(categoryId: number) {
  const counts = await prisma.article.groupBy({
    by: ["folderId"],
    where: { categoryId },
    _count: {
      _all: true,
    },
  });

  return Object.fromEntries(
    counts
      .filter((row) => row.folderId !== null)
      .map((row) => [String(row.folderId), row._count._all])
  ) as Record<string, number>;
}

export async function createCategoryFolder(data: {
  categoryId: number;
  name: string;
  order?: number;
  visible?: boolean;
}) {
  return prisma.categoryFolder.create({
    data,
  });
}

export async function updateCategoryFolder(
  id: number,
  data: {
    name?: string;
    order?: number;
    visible?: boolean;
  }
) {
  return prisma.categoryFolder.update({
    where: { id },
    data,
  });
}

export async function deleteCategoryFolder(id: number) {
  return prisma.categoryFolder.delete({
    where: { id },
  });
}
