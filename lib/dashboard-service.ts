import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    articles,
    categories,
    announcements,
    courses,
    activeAlerts,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.category.count(),
    prisma.announcement.count(),
    prisma.trainingCourse.count(),
    prisma.disruption.count({ where: { active: true } }),
  ]);

  return {
    articles,
    categories,
    announcements,
    courses,
    activeAlerts,
  };
}

export async function getLatestArticles() {
  return prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

/** `teamId` is the viewing agent's own team — pass null if they have none. */
export async function getLatestAnnouncements(teamId?: number | null) {
  return prisma.announcement.findMany({
    where: teamId !== undefined ? { OR: [{ teamId: null }, { teamId }] } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

export async function getModerationCounts() {
  const [pendingComments, newFeedback] = await Promise.all([
    prisma.comment.count({ where: { status: "Pending" } }),
    prisma.feedback.count({ where: { status: "New" } }),
  ]);
  return { pendingComments, newFeedback };
}

/** Logins/quiz submissions in the last 7 days, plus the most active team by attempt
 * count — a lightweight weekly pulse for the admin dashboard, not a full analytics view. */
export async function getAgentEngagementSummary() {
  const weekAgo = new Date(Date.now() - 7 * 86_400_000);

  const [loginsThisWeek, quizSubmissionsThisWeek, teams] = await Promise.all([
    prisma.auditLog.count({
      where: { entity: "PortalUser", action: "Login", createdAt: { gte: weekAgo } },
    }),
    prisma.quizAttempt.count({
      where: { status: "Submitted", submittedAt: { gte: weekAgo } },
    }),
    prisma.team.findMany({ include: { members: { select: { email: true } } } }),
  ]);

  let topTeam: { name: string; attempts: number } | null = null;
  for (const team of teams) {
    const emails = team.members.map((m) => m.email);
    if (emails.length === 0) continue;

    const attempts = await prisma.quizAttempt.count({
      where: {
        email: { in: emails, mode: "insensitive" },
        status: "Submitted",
        submittedAt: { gte: weekAgo },
      },
    });

    if (attempts > 0 && (!topTeam || attempts > topTeam.attempts)) {
      topTeam = { name: team.name, attempts };
    }
  }

  return { loginsThisWeek, quizSubmissionsThisWeek, topTeam };
}