"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createUser, deleteUser, updateUser } from "@/lib/user-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requirePermission } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createUserAction(formData: FormData) {
  await requirePermission("manage_users");

  const user = await createUser({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    roleId: Number(formData.get("roleId")),
    status: (formData.get("status") as string) || "Active",
  });

  await logAction("Created", "User", user.id, await currentUserName());

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserAction(id: number, formData: FormData) {
  await requirePermission("manage_users");

  const password = formData.get("password") as string;

  await updateUser(id, {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    roleId: Number(formData.get("roleId")),
    status: (formData.get("status") as string) || "Active",
    ...(password ? { password } : {}),
  });

  await logAction("Updated", "User", id, await currentUserName());

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUserAction(id: number) {
  await requirePermission("manage_users");

  await deleteUser(id);

  await logAction("Deleted", "User", id, await currentUserName());

  revalidatePath("/admin/users");
}

export async function deleteManyUsersAction(ids: number[]) {
  await requirePermission("manage_users");

  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "User", null, await currentUserName());

  revalidatePath("/admin/users");
}
