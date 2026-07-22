"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createPortalUser, deletePortalUser, updatePortalUser } from "@/lib/portal-user-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createPortalUserAction(formData: FormData) {
  await requireAdminUser();

  const user = await createPortalUser({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    status: (formData.get("status") as string) || "Active",
  });

  await logAction("Created", "PortalUser", user.id, await currentUserName());

  revalidatePath("/admin/portal-users");
  redirect("/admin/portal-users");
}

export async function updatePortalUserAction(id: number, formData: FormData) {
  await requireAdminUser();

  const password = formData.get("password") as string;

  await updatePortalUser(id, {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    status: (formData.get("status") as string) || "Active",
    ...(password ? { password } : {}),
  });

  await logAction("Updated", "PortalUser", id, await currentUserName());

  revalidatePath("/admin/portal-users");
  redirect("/admin/portal-users");
}

export async function deletePortalUserAction(id: number) {
  await requireAdminUser();

  await deletePortalUser(id);

  await logAction("Deleted", "PortalUser", id, await currentUserName());

  revalidatePath("/admin/portal-users");
}

export async function deleteManyPortalUsersAction(ids: number[]) {
  await requireAdminUser();

  await prisma.portalUser.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "PortalUser", null, await currentUserName());

  revalidatePath("/admin/portal-users");
}
