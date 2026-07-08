"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createImportantLink,
  deleteImportantLink,
  updateImportantLink,
} from "@/lib/important-link-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createImportantLinkAction(formData: FormData) {
  const link = await createImportantLink({
    title: formData.get("title") as string,
    url: formData.get("url") as string,
    description: formData.get("description") as string,
    icon: (formData.get("icon") as string) || "Link2",
    order: Number(formData.get("order") ?? 0),
    visible: formData.get("visible") === "on",
  });

  await logAction("Created", "Important Link", link.id, await currentUserName());

  revalidatePath("/admin/important-links");
  revalidatePath("/", "layout");
  redirect("/admin/important-links");
}

export async function updateImportantLinkAction(
  id: number,
  formData: FormData
) {
  await updateImportantLink(id, {
    title: formData.get("title") as string,
    url: formData.get("url") as string,
    description: formData.get("description") as string,
    icon: (formData.get("icon") as string) || "Link2",
    order: Number(formData.get("order") ?? 0),
    visible: formData.get("visible") === "on",
  });

  await logAction("Updated", "Important Link", id, await currentUserName());

  revalidatePath("/admin/important-links");
  revalidatePath("/", "layout");
  redirect("/admin/important-links");
}

export async function deleteImportantLinkAction(id: number) {
  await deleteImportantLink(id);

  await logAction("Deleted", "Important Link", id, await currentUserName());

  revalidatePath("/admin/important-links");
  revalidatePath("/", "layout");
}

export async function deleteManyImportantLinksAction(ids: number[]) {
  await prisma.importantLink.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Important Link", null, await currentUserName());

  revalidatePath("/admin/important-links");
  revalidatePath("/", "layout");
}
