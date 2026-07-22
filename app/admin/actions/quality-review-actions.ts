"use server";

import { revalidatePath } from "next/cache";
import { createQualityReview, deleteQualityReview } from "@/lib/quality-review-service";
import { logAction } from "@/lib/audit-service";
import { requirePermission } from "@/lib/admin-dal";

export async function createQualityReviewAction(portalUserId: number, formData: FormData) {
  const reviewer = await requirePermission("manage_quality");

  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) {
    throw new Error("A rating (1-5) and a comment are required.");
  }

  await createQualityReview({
    portalUserId,
    rating,
    comment,
    reviewerName: reviewer.name,
  });

  await logAction("Created", "QualityReview", portalUserId, reviewer.name);

  revalidatePath(`/admin/portal-users/${portalUserId}/activity`);
}

export async function deleteQualityReviewAction(id: number, portalUserId: number) {
  const reviewer = await requirePermission("manage_quality");

  await deleteQualityReview(id);

  await logAction("Deleted", "QualityReview", id, reviewer.name);

  revalidatePath(`/admin/portal-users/${portalUserId}/activity`);
}
