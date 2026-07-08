"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createMediaFile, deleteMediaFile } from "@/lib/media-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createMediaFileAction(data: {
  name: string;
  url: string;
  mimeType: string;
  size: number;
}) {
  const file = await createMediaFile(data);

  await logAction("Uploaded", "Media File", file.id, await currentUserName());

  revalidatePath("/admin/media");
}

export async function deleteMediaFileAction(id: number) {
  await deleteMediaFile(id);

  await logAction("Deleted", "Media File", id, await currentUserName());

  revalidatePath("/admin/media");
}

export async function deleteManyMediaFilesAction(ids: number[]) {
  await prisma.mediaFile.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Media File", null, await currentUserName());

  revalidatePath("/admin/media");
}
