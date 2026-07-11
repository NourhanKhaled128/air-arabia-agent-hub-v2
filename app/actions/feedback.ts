"use server";

import { revalidatePath } from "next/cache";
import { createFeedback } from "@/lib/feedback-service";

export async function submitFeedbackAction(data: {
  articleId: number;
  slug: string;
  helpful: boolean;
  message?: string;
  authorName?: string;
}) {
  await createFeedback({
    articleId: data.articleId,
    helpful: data.helpful,
    message: data.message,
    authorName: data.authorName,
  });

  revalidatePath(`/Knowledge/${data.slug}`);
}
