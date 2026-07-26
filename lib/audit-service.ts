import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function logAction(
  action: string,
  entity: string,
  entityId: number | null,
  userName: string,
  diff?: { before?: unknown; after?: unknown }
) {
  // A plain `null` (as opposed to `undefined`) makes Prisma throw for optional Json
  // fields ("Expected NullableJsonNullValueInput or InputJsonValue, provided Null") —
  // treat "no snapshot available" the same as "no diff was passed" and omit the field.
  return prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      userName,
      before: diff?.before == null ? undefined : (diff.before as Prisma.InputJsonValue),
      after: diff?.after == null ? undefined : (diff.after as Prisma.InputJsonValue),
    },
  });
}

export async function getRecentAuditLogs(limit = 5) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAuditLogs() {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
  });
}

/** Portal (agent-facing) activity only — logins and quiz submissions — for a compact
 * dashboard feed, separate from the full content-change audit trail at /admin/audit. */
export async function getRecentPortalActivity(limit = 8) {
  return prisma.auditLog.findMany({
    where: { entity: { in: ["PortalUser", "QuizAttempt"] } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAuditLogsForEntity(entity: string, entityId: number) {
  return prisma.auditLog.findMany({
    where: { entity, entityId },
    orderBy: { createdAt: "desc" },
  });
}
