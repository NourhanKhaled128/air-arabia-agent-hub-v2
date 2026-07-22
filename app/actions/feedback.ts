"use server";

import { revalidatePath } from "next/cache";
import { createFeedback } from "@/lib/feedback-service";
import { requirePortalUser } from "@/lib/portal-dal";

export async function submitFeedbackAction(data: {
  articleId: number;
  slug: string;
  helpful: boolean;
  message?: string;
}) {
  const user = await requirePortalUser();

  await createFeedback({
    articleId: data.articleId,
    helpful: data.helpful,
    message: data.message,
    authorName: user.name,
    portalUserId: user.id,
  });

  revalidatePath(`/Knowledge/${data.slug}`);
}
