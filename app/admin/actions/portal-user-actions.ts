"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createPortalUser,
  deletePortalUser,
  updatePortalUser,
  isAllowedPortalEmailDomain,
} from "@/lib/portal-user-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requirePermission } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

function parseTeamId(formData: FormData): number | null {
  const raw = formData.get("teamId") as string;
  return raw ? Number(raw) : null;
}

export async function createPortalUserAction(formData: FormData) {
  await requirePermission("manage_users");

  const user = await createPortalUser({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    status: (formData.get("status") as string) || "Active",
    teamId: parseTeamId(formData),
  });

  await logAction("Created", "PortalUser", user.id, await currentUserName());

  revalidatePath("/admin/portal-users");
  redirect("/admin/portal-users");
}

export async function updatePortalUserAction(id: number, formData: FormData) {
  await requirePermission("manage_users");

  const password = formData.get("password") as string;

  await updatePortalUser(id, {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    status: (formData.get("status") as string) || "Active",
    teamId: parseTeamId(formData),
    ...(password ? { password } : {}),
  });

  await logAction("Updated", "PortalUser", id, await currentUserName());

  revalidatePath("/admin/portal-users");
  redirect("/admin/portal-users");
}

export async function deletePortalUserAction(id: number) {
  await requirePermission("manage_users");

  await deletePortalUser(id);

  await logAction("Deleted", "PortalUser", id, await currentUserName());

  revalidatePath("/admin/portal-users");
}

export async function bulkCreatePortalUsersAction(data: {
  rows: { name: string; email: string }[];
  password: string;
}) {
  await requirePermission("manage_users");

  let created = 0;
  let skippedDuplicate = 0;
  let rejectedDomain = 0;

  for (const row of data.rows) {
    const name = row.name?.trim();
    const email = row.email?.trim();
    if (!name || !email) continue;

    if (!isAllowedPortalEmailDomain(email)) {
      rejectedDomain++;
      continue;
    }

    const existing = await prisma.portalUser.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      skippedDuplicate++;
      continue;
    }

    await createPortalUser({ name, email, password: data.password, status: "Active" });
    created++;
  }

  await logAction("Bulk created", "PortalUser", null, await currentUserName());

  revalidatePath("/admin/portal-users");

  return { created, skippedDuplicate, rejectedDomain };
}

export async function deleteManyPortalUsersAction(ids: number[]) {
  await requirePermission("manage_users");

  await prisma.portalUser.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "PortalUser", null, await currentUserName());

  revalidatePath("/admin/portal-users");
}
