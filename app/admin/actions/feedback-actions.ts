"use server";

import { revalidatePath } from "next/cache";
import {
  markFeedbackReviewed,
  deleteFeedback,
  deleteManyFeedback,
} from "@/lib/feedback-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function markFeedbackReviewedAction(id: number) {
  await requireAdminUser();

  await markFeedbackReviewed(id);

  await logAction("Reviewed", "Feedback", id, await currentUserName());

  revalidatePath("/admin/feedback");
}

export async function deleteFeedbackAction(id: number) {
  await requireAdminUser();

  await deleteFeedback(id);

  await logAction("Deleted", "Feedback", id, await currentUserName());

  revalidatePath("/admin/feedback");
}

export async function deleteManyFeedbackAction(ids: number[]) {
  await requireAdminUser();

  await deleteManyFeedback(ids);

  await logAction("Deleted", "Feedback", null, await currentUserName());

  revalidatePath("/admin/feedback");
}
