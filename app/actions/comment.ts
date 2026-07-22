"use server";

import { revalidatePath } from "next/cache";
import { createComment } from "@/lib/comment-service";
import { requirePortalUser } from "@/lib/portal-dal";

export async function submitCommentAction(data: {
  articleId: number;
  slug: string;
  content: string;
}) {
  if (!data.content.trim()) {
    throw new Error("Comment cannot be empty");
  }

  const user = await requirePortalUser();

  await createComment({
    articleId: data.articleId,
    authorName: user.name,
    content: data.content.trim(),
  });

  revalidatePath(`/Knowledge/${data.slug}`);
}
