import { prisma } from "@/lib/prisma";

export async function getImportantLinks() {
  return prisma.importantLink.findMany({
    orderBy: { order: "asc" },
  });
}

export async function getVisibleImportantLinks() {
  return prisma.importantLink.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
}

export async function getImportantLinkById(id: number) {
  return prisma.importantLink.findUnique({
    where: { id },
  });
}

export async function createImportantLink(data: {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  order?: number;
  visible?: boolean;
}) {
  return prisma.importantLink.create({
    data,
  });
}

export async function updateImportantLink(
  id: number,
  data: {
    title?: string;
    url?: string;
    description?: string;
    icon?: string;
    order?: number;
    visible?: boolean;
  }
) {
  return prisma.importantLink.update({
    where: { id },
    data,
  });
}

export async function deleteImportantLink(id: number) {
  return prisma.importantLink.delete({
    where: { id },
  });
}
