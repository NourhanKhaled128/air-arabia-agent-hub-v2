import { prisma } from "@/lib/prisma";
import { updateDecisionTree, type DecisionTreeInput } from "@/lib/decision-tree-service";
import { logAction } from "@/lib/audit-service";
import type { ScheduledChange } from "@prisma/client";

// Deliberately narrow: a scheduled Article change only appends text after the
// article's Overview — it never replaces the article wholesale. Read at apply time,
// not schedule time, so it composes safely with any other edits made to the article
// in between (the append target is always the *current* overview, not a stale
// snapshot from when this was scheduled).
export interface ArticleChangePayload {
  appendToOverview: string;
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

// Appends to whatever the article's overview reads *right now* — not a snapshot taken
// when this was scheduled — so a concurrent manual edit to the rest of the article
// (or even the overview itself) between scheduling and the effective date is preserved.
async function applyArticleChange(articleId: number, payload: ArticleChangePayload) {
  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { overview: true } });
  if (!article) throw new Error(`Article ${articleId} not found`);

  await prisma.article.update({
    where: { id: articleId },
    data: { overview: `${article.overview}\n\n${payload.appendToOverview}` },
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
