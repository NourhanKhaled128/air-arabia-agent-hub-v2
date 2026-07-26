"use server";

import { revalidatePath } from "next/cache";
import {
  createQualityReview,
  updateQualityReview,
  deleteQualityReview,
} from "@/lib/quality-review-service";
import { logAction } from "@/lib/audit-service";
import { requirePermission } from "@/lib/admin-dal";

function readRatingAndComment(formData: FormData) {
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!Number.isFinite(rating) || rating < 0 || rating > 100 || !comment) {
    throw new Error("A score (0-100) and a comment are required.");
  }

  return { rating, comment };
}

export async function createQualityReviewAction(portalUserId: number, formData: FormData) {
  const reviewer = await requirePermission("manage_quality");

  const { rating, comment } = readRatingAndComment(formData);

  await createQualityReview({
    portalUserId,
    rating,
    comment,
    reviewerName: reviewer.name,
  });

  await logAction("Created", "QualityReview", portalUserId, reviewer.name);

  revalidatePath(`/admin/portal-users/${portalUserId}/activity`);
  revalidatePath("/admin/quality-feedback");
}

export async function updateQualityReviewAction(
  id: number,
  portalUserId: number,
  formData: FormData
) {
  const reviewer = await requirePermission("manage_quality");

  const { rating, comment } = readRatingAndComment(formData);

  await updateQualityReview(id, { rating, comment });

  await logAction("Updated", "QualityReview", portalUserId, reviewer.name);

  revalidatePath(`/admin/portal-users/${portalUserId}/activity`);
  revalidatePath("/admin/quality-feedback");
}

export async function deleteQualityReviewAction(id: number, portalUserId: number) {
  const reviewer = await requirePermission("manage_quality");

  await deleteQualityReview(id);

  await logAction("Deleted", "QualityReview", id, reviewer.name);

  revalidatePath(`/admin/portal-users/${portalUserId}/activity`);
  revalidatePath("/admin/quality-feedback");
}
