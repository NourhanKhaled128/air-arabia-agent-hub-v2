"use server";

import { revalidatePath } from "next/cache";
import { createComment } from "@/lib/comment-service";

export async function submitCommentAction(data: {
  articleId: number;
  slug: string;
  authorName?: string;
  content: string;
}) {
  if (!data.content.trim()) {
    throw new Error("Comment cannot be empty");
  }

  await createComment({
    articleId: data.articleId,
    authorName: data.authorName,
    content: data.content.trim(),
  });

  revalidatePath(`/Knowledge/${data.slug}`);
}
