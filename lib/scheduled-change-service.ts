import { prisma } from "@/lib/prisma";
import { buildArticleSectionsReplaceData } from "@/lib/article-service";
import { updateDecisionTree, type DecisionTreeInput } from "@/lib/decision-tree-service";
import { logAction } from "@/lib/audit-service";
import type { ScheduledChange } from "@prisma/client";

export interface ArticleChangePayload {
  title: string;
  categoryId?: number | null;
  folderId?: number | null;
  description: string;
  overview: string;
  author: string;
  status: string;
  coverImage?: string | null;
  procedures?: { title?: string; content: string; image?: string }[];
  dispositions?: { category?: string; code?: string; content: string; scenario?: string; images?: string[] }[];
  escalations?: { department?: string; condition?: string; content: string; images?: string[] }[];
  notes?: { type?: string; content: string; images?: string[] }[];
  references?: { title: string; type?: string; link?: string; images?: string[] }[];
  keywords?: string[];
  scenarios?: { situation: string; response: string; images?: string[] }[];
  images?: { url: string }[];
  attachments?: { fileName: string; url: string; mimeType: string; size: number }[];
  chatTemplates?: { title: string; content: string }[];
  emailTemplates?: { title: string; subject: string; body: string }[];
  updates?: { title: string; content: string; userName?: string }[];
}

export async function getPendingScheduledChanges() {
  return prisma.scheduledChange.findMany({
    where: { status: "Pending" },
    orderBy: { effectiveDate: "asc" },
  });
}

export async function getAllScheduledChanges() {
  return prisma.scheduledChange.findMany({
    orderBy: { effectiveDate: "asc" },
  });
}

export async function getDueScheduledChanges() {
  return prisma.scheduledChange.findMany({
    where: { status: "Pending", effectiveDate: { lte: new Date() } },
    orderBy: { effectiveDate: "asc" },
  });
}

export async function cancelScheduledChange(id: number) {
  return prisma.scheduledChange.update({ where: { id }, data: { status: "Cancelled" } });
}

/** Applies one due ScheduledChange, isolated in its own try/catch so a bad item
 * (e.g. a referenced category deleted since scheduling) can't abort the rest of the
 * cron's batch — it's marked Failed with a reason instead. Returns whether it succeeded,
 * so the cron route can report accurate counts without a second query. */
export async function applyScheduledChange(change: ScheduledChange): Promise<boolean> {
  try {
    if (change.entityType === "Article") {
      await applyArticleChange(change.entityId, change.payload as unknown as ArticleChangePayload);
    } else if (change.entityType === "DecisionTree") {
      await applyDecisionTreeChange(change.entityId, change.payload as unknown as DecisionTreeInput);
    } else {
      throw new Error(`Unknown ScheduledChange.entityType: ${change.entityType}`);
    }

    await prisma.scheduledChange.update({
      where: { id: change.id },
      data: { status: "Applied", appliedAt: new Date(), failureReason: null },
    });
    await logAction("Applied", change.entityType, change.entityId, "System");
    return true;
  } catch (error) {
    await prisma.scheduledChange.update({
      where: { id: change.id },
      data: { status: "Failed", failureReason: error instanceof Error ? error.message : String(error) },
    });
    await logAction("Failed", change.entityType, change.entityId, "System");
    return false;
  }
}

// Mirrors app/api/articles/[id]/route.ts's PUT handler exactly, so a scheduled edit
// applies identically to a manual save — just reusing buildArticleSectionsReplaceData
// rather than reimplementing it. The one addition: re-checking categoryId/folderId
// still exist (both onDelete: SetNull on Article), since the payload was staged
// earlier and either could have been deleted in the meantime.
async function applyArticleChange(articleId: number, payload: ArticleChangePayload) {
  let categoryId = payload.categoryId ?? null;
  if (categoryId != null && !(await prisma.category.findUnique({ where: { id: categoryId } }))) {
    categoryId = null;
  }
  let folderId = payload.folderId ?? null;
  if (folderId != null && !(await prisma.categoryFolder.findUnique({ where: { id: folderId } }))) {
    folderId = null;
  }

  await prisma.article.update({
    where: { id: articleId },
    data: {
      title: payload.title,
      categoryId,
      folderId,
      description: payload.description,
      overview: payload.overview,
      author: payload.author,
      status: payload.status,
      coverImage: payload.coverImage ?? null,
      ...buildArticleSectionsReplaceData({
        ...payload,
        updates: (payload.updates ?? []).map((item) => ({ ...item, userName: item.userName ?? "System" })),
      }),
    },
  });
}

// Mirrors app/api/decision-trees/[id]/route.ts's PUT handler — same re-validation
// reasoning for sourceArticleId (onDelete: SetNull on DecisionTree).
async function applyDecisionTreeChange(treeId: number, payload: DecisionTreeInput) {
  let sourceArticleId = payload.sourceArticleId ?? null;
  if (sourceArticleId != null && !(await prisma.article.findUnique({ where: { id: sourceArticleId } }))) {
    sourceArticleId = null;
  }

  await updateDecisionTree(treeId, { ...payload, sourceArticleId });
}
