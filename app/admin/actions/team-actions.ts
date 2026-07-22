"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createTeam, deleteTeam, updateTeam } from "@/lib/team-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createTeamAction(formData: FormData) {
  await requireAdminUser();

  const team = await createTeam({ name: formData.get("name") as string });

  await logAction("Created", "Team", team.id, await currentUserName());

  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function updateTeamAction(id: number, formData: FormData) {
  await requireAdminUser();

  await updateTeam(id, { name: formData.get("name") as string });

  await logAction("Updated", "Team", id, await currentUserName());

  revalidatePath("/admin/teams");
  redirect("/admin/teams");
}

export async function deleteTeamAction(id: number) {
  await requireAdminUser();

  await deleteTeam(id);

  await logAction("Deleted", "Team", id, await currentUserName());

  revalidatePath("/admin/teams");
}

export async function deleteManyTeamsAction(ids: number[]) {
  await requireAdminUser();

  await prisma.team.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Team", null, await currentUserName());

  revalidatePath("/admin/teams");
}
