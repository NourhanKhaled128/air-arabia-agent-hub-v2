import { prisma } from "@/lib/prisma";

export async function logAction(
  action: string,
  entity: string,
  entityId: number | null,
  userName: string
) {
  return prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      userName,
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
