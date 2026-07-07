import { prisma } from "@/lib/prisma";

export async function getDispositionCodes() {
  return prisma.dispositionCode.findMany({
    orderBy: { code: "asc" },
  });
}

export async function getActiveDispositionCodes() {
  return prisma.dispositionCode.findMany({
    where: { active: true },
    orderBy: { code: "asc" },
  });
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
