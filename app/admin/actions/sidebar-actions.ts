"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSidebarLink,
  deleteSidebarLink,
  updateSidebarLink,
} from "@/lib/sidebar-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createSidebarLinkAction(formData: FormData) {
  const link = await createSidebarLink({
    label: formData.get("label") as string,
    href: formData.get("href") as string,
    icon: (formData.get("icon") as string) || "Link2",
    section: (formData.get("section") as string) || "tools",
    order: Number(formData.get("order") ?? 0),
    visible: formData.get("visible") === "on",
  });

  await logAction("Created", "Sidebar Link", link.id, await currentUserName());

  revalidatePath("/admin/sidebar");
  revalidatePath("/", "layout");
  redirect("/admin/sidebar");
}

export async function updateSidebarLinkAction(
  id: number,
  formData: FormData
) {
  await updateSidebarLink(id, {
    label: formData.get("label") as string,
    href: formData.get("href") as string,
    icon: (formData.get("icon") as string) || "Link2",
    section: (formData.get("section") as string) || "tools",
    order: Number(formData.get("order") ?? 0),
    visible: formData.get("visible") === "on",
  });

  await logAction("Updated", "Sidebar Link", id, await currentUserName());

  revalidatePath("/admin/sidebar");
  revalidatePath("/", "layout");
  redirect("/admin/sidebar");
}

export async function deleteSidebarLinkAction(id: number) {
  await deleteSidebarLink(id);

  await logAction("Deleted", "Sidebar Link", id, await currentUserName());

  revalidatePath("/admin/sidebar");
  revalidatePath("/", "layout");
}
