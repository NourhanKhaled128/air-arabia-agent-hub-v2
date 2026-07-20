"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function deleteDecisionTreeAction(id: number) {
  await requireAdminUser();

  await prisma.decisionTree.delete({ where: { id } });

  await logAction("Deleted", "DecisionTree", id, await currentUserName());

  revalidatePath("/admin/decision-trees");
}

export async function deleteManyDecisionTreesAction(ids: number[]) {
  await requireAdminUser();

  await prisma.decisionTree.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "DecisionTree", null, await currentUserName());

  revalidatePath("/admin/decision-trees");
}

export async function publishDecisionTreeAction(id: number) {
  await requireAdminUser();

  await prisma.decisionTree.update({ where: { id }, data: { status: "Published" } });

  await logAction("Published", "DecisionTree", id, await currentUserName());

  revalidatePath("/admin/decision-trees");
}

export async function unpublishDecisionTreeAction(id: number) {
  await requireAdminUser();

  await prisma.decisionTree.update({ where: { id }, data: { status: "Draft" } });

  await logAction("Unpublished", "DecisionTree", id, await currentUserName());

  revalidatePath("/admin/decision-trees");
}
