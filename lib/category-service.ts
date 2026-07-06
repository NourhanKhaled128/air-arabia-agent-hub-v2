import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({
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
    by: ["category"],
    _count: {
      _all: true,
    },
  });

  return Object.fromEntries(
    counts.map((row) => [row.category, row._count._all])
  );
}