import { prisma } from "@/lib/prisma";

export async function getDisruptions() {
  return prisma.disruption.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveDisruptions() {
  return prisma.disruption.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDisruptionById(id: number) {
  return prisma.disruption.findUnique({
    where: { id },
  });
}

export async function createDisruption(data: {
  airportCode: string;
  message: string;
  level?: string;
  active?: boolean;
}) {
  return prisma.disruption.create({
    data,
  });
}

export async function updateDisruption(
  id: number,
  data: {
    airportCode?: string;
    message?: string;
    level?: string;
    active?: boolean;
  }
) {
  return prisma.disruption.update({
    where: { id },
    data,
  });
}

export async function deleteDisruption(id: number) {
  return prisma.disruption.delete({
    where: { id },
  });
}
