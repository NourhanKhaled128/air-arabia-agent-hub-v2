"use server";

import { revalidatePath } from "next/cache";
import { createContentSuggestion } from "@/lib/content-suggestion-service";
import { requirePortalUser } from "@/lib/portal-dal";

export async function submitContentSuggestionAction(data: { articleId: number; description: string }) {
  if (!data.description.trim()) {
    throw new Error("Description cannot be empty");
  }

  const user = await requirePortalUser();

  await createContentSuggestion({
    articleId: data.articleId,
    portalUserId: user.id,
    description: data.description.trim(),
  });

  revalidatePath("/admin/content-suggestions");
}
