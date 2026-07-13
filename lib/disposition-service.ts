import { prisma } from "@/lib/prisma";

export async function getDispositionCodes() {
  return prisma.dispositionCode.findMany({
    orderBy: [{ category: "asc" }, { code: "asc" }],
  });
}

export async function getActiveDispositionCodes() {
  return prisma.dispositionCode.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { code: "asc" }],
  });
}

export async function getDispositionCategories() {
  const rows = await prisma.dispositionCode.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((row) => row.category as string);
}

export async function getDispositionCodeById(id: number) {
  return prisma.dispositionCode.findUnique({
    where: { id },
  });
}

export async function createDispositionCode(data: {
  code: string;
  label: string;
  description?: string;
  category?: string;
  active: boolean;
}) {
  return prisma.dispositionCode.create({ data });
}

export async function updateDispositionCode(
  id: number,
  data: Partial<{
    code: string;
    label: string;
    description: string;
    category: string;
    active: boolean;
  }>
) {
  return prisma.dispositionCode.update({
    where: { id },
    data,
  });
}

export async function deleteDispositionCode(id: number) {
  return prisma.dispositionCode.delete({
    where: { id },
  });
}
