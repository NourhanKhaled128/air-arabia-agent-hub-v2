import { prisma } from "@/lib/prisma";

export async function getMediaFiles() {
  return prisma.mediaFile.findMany({
    orderBy: { uploadedAt: "desc" },
  });
}

export async function createMediaFile(data: {
  name: string;
  url: string;
  mimeType: string;
  size: number;
}) {
  return prisma.mediaFile.create({
    data,
  });
}

export async function deleteMediaFile(id: number) {
  return prisma.mediaFile.delete({
    where: { id },
  });
}
