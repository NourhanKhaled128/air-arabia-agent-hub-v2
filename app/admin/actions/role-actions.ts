"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createRole, deleteRole, updateRole } from "@/lib/role-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createRoleAction(formData: FormData) {
  await requireAdminUser();

  const role = await createRole({
    name: formData.get("name") as string,
    color: formData.get("color") as string,
    permissions: formData.getAll("permissions") as string[],
  });

  await logAction("Created", "Role", role.id, await currentUserName());

  revalidatePath("/admin/roles");
  redirect("/admin/roles");
}

export async function updateRoleAction(id: number, formData: FormData) {
  await requireAdminUser();

  await updateRole(id, {
    name: formData.get("name") as string,
    color: formData.get("color") as string,
    permissions: formData.getAll("permissions") as string[],
  });

  await logAction("Updated", "Role", id, await currentUserName());

  revalidatePath("/admin/roles");
  redirect("/admin/roles");
}

export async function deleteRoleAction(id: number) {
  await requireAdminUser();

  await deleteRole(id);

  await logAction("Deleted", "Role", id, await currentUserName());

  revalidatePath("/admin/roles");
}

export async function deleteManyRolesAction(ids: number[]) {
  await requireAdminUser();

  await prisma.role.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Role", null, await currentUserName());

  revalidatePath("/admin/roles");
}
