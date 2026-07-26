"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser, requirePermission } from "@/lib/admin-dal";
import { cancelScheduledChange } from "@/lib/scheduled-change-service";
import type { Prisma } from "@prisma/client";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

interface CreateScheduledChangeInput {
  entityType: "Article" | "DecisionTree";
  entityId: number;
  label: string;
  effectiveDate: Date;
  payload: Prisma.InputJsonValue;
}

// Same permission split as the entities' own publish actions: Article publishes are
// gated by manage_articles (app/admin/actions/article-actions.ts:51); DecisionTree
// has no dedicated permission anywhere in the app (app/admin/actions/decision-tree-actions.ts),
// so it falls back to requireAdminUser() like its own publish/unpublish actions do.
export async function createScheduledChangeAction(input: CreateScheduledChangeInput) {
  if (input.entityType === "Article") {
    await requirePermission("manage_articles");
  } else {
    await requireAdminUser();
  }

  const userName = await currentUserName();

  const change = await prisma.scheduledChange.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      label: input.label,
      effectiveDate: input.effectiveDate,
      payload: input.payload,
      createdBy: userName,
    },
  });

  await logAction("Scheduled", change.entityType, change.entityId, userName);

  revalidatePath("/admin/scheduled-changes");

  return change;
}

export async function cancelScheduledChangeAction(id: number) {
  await requireAdminUser();

  const change = await cancelScheduledChange(id);

  await logAction("Cancelled", change.entityType, change.entityId, await currentUserName());

  revalidatePath("/admin/scheduled-changes");
}
