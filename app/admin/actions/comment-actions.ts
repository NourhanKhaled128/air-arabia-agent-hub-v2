"use server";

import { revalidatePath } from "next/cache";
import {
  approveComment,
  deleteComment,
  deleteManyComments,
} from "@/lib/comment-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function approveCommentAction(id: number) {
  await requireAdminUser();

  await approveComment(id);

  await logAction("Approved", "Comment", id, await currentUserName());

  revalidatePath("/admin/comments");
}

export async function deleteCommentAction(id: number) {
  await requireAdminUser();

  await deleteComment(id);

  await logAction("Deleted", "Comment", id, await currentUserName());

  revalidatePath("/admin/comments");
}

export async function deleteManyCommentsAction(ids: number[]) {
  await requireAdminUser();

  await deleteManyComments(ids);

  await logAction("Deleted", "Comment", null, await currentUserName());

  revalidatePath("/admin/comments");
}
