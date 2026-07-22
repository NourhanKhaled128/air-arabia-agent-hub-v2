"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { resolveContentSuggestion, deleteContentSuggestion } from "@/lib/content-suggestion-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function resolveContentSuggestionAction(id: number) {
  await requireAdminUser();

  await resolveContentSuggestion(id);

  await logAction("Resolved", "ContentSuggestion", id, await currentUserName());

  revalidatePath("/admin/content-suggestions");
}

export async function deleteContentSuggestionAction(id: number) {
  await requireAdminUser();

  await deleteContentSuggestion(id);

  await logAction("Deleted", "ContentSuggestion", id, await currentUserName());

  revalidatePath("/admin/content-suggestions");
}

export async function deleteManyContentSuggestionsAction(ids: number[]) {
  await requireAdminUser();

  await prisma.contentSuggestion.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "ContentSuggestion", null, await currentUserName());

  revalidatePath("/admin/content-suggestions");
}
