import Link from "next/link";
import DashboardCards from "@/components/AdminDashboardCard";
import AgentQuickFind from "@/components/admin/AgentQuickFind";
import QuizTrendChart from "@/components/admin/QuizTrendChart";
import {
  getDashboardStats,
  getLatestArticles,
  getLatestAnnouncements,
  getModerationCounts,
  getAgentEngagementSummary,
} from "@/lib/dashboard-service";
import { getStaleAgentCount, getRecentAgents, getPortalUsers } from "@/lib/portal-user-service";
import { getQuizPassRateTrend } from "@/lib/quiz-service";
import { getRecentPortalActivity } from "@/lib/audit-service";

const modules = [
  {
    title: "Knowledge Base",
    description: "Create, edit, publish and archive knowledge articles.",
    href: "/admin/articles",
    color: "bg-red-700",
  },
  {
    title: "Categories",
    description: "Manage article categories and organization.",
    href: "/admin/categories",
    color: "bg-blue-700",
  },
  {
    title: "Announcements",
    description: "Publish announcements for all champions.",
    href: "/admin/announcements",
    color: "bg-amber-600",
  },
  {
    title: "Training",
    description: "Manage training courses and lessons.",
    href: "/admin/training",
    color: "bg-emerald-700",
  },
  {
    title: "Users",
    description: "Manage users, supervisors and administrators.",
    href: "/admin/users",
    color: "bg-violet-700",
  },
  {
    title: "Settings",
    description: "Configure the Champion Hub platform.",
    href: "/admin/settings",
    color: "bg-slate-700",
  },
];

export default async function AdminDashboard() {
  const [
    stats,
    latestArticles,
    latestAnnouncements,
    moderationCounts,
    staleAgentCount,
    engagement,
    recentAgents,
    quizTrend,
    recentPortalActivity,
    agents,
  ] = await Promise.all([
    getDashboardStats(),
    getLatestArticles(),
    getLatestAnnouncements(),
    getModerationCounts(),
    getStaleAgentCount(),
    getAgentEngagementSummary(),
    getRecentAgents(),
    getQuizPassRateTrend(),
    getRecentPortalActivity(),
    getPortalUsers(),
  ]);

  const activity = [
    ...latestArticles.map((article) => ({
      key: `article-${article.id}`,
      label: `Article: ${article.title}`,
      date: article.createdAt,
      href: `/admin/articles/${article.id}`,
    })),
    ...latestAnnouncements.map((announcement) => ({
      key: `announcement-${announcement.id}`,
      label: `Announcement: ${announcement.title}`,
      date: announcement.createdAt,
      href: `/admin/announcements/${announcement.id}`,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Air Arabia Champion Hub
          </h1>

          <p className="mt-3 max-w-3xl text-slate-500">
            Manage articles, categories, announcements, training,
            users, media and system configuration from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/articles/new"
            className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
          >
            New Article
          </Link>

          <Link
            href="/admin/articles"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-50"
          >
            Manage Articles
          </Link>
        </div>
      </div>

      <DashboardCards stats={stats} />

      {(staleAgentCount > 0 || moderationCounts.pendingComments > 0 || moderationCounts.newFeedback > 0) && (
        <div className="grid gap-4 sm:grid-cols-3">
          {staleAgentCount > 0 && (
            <Link
              href="/admin/portal-users"
              className="rounded-2xl border border-amber-200 bg-amber-50 p-5 hover:bg-amber-100"
            >
              <p className="text-3xl font-bold text-amber-800">{staleAgentCount}</p>
              <p className="mt-1 font-semibold text-amber-700">Agent{staleAgentCount === 1 ? "" : "s"} inactive 30+ days</p>
            </Link>
          )}
          {moderationCounts.pendingComments > 0 && (
            <Link
              href="/admin/comments"
              className="rounded-2xl border border-blue-200 bg-blue-50 p-5 hover:bg-blue-100"
            >
              <p className="text-3xl font-bold text-blue-800">{moderationCounts.pendingComments}</p>
              <p className="mt-1 font-semibold text-blue-700">Comment{moderationCounts.pendingComments === 1 ? "" : "s"} pending review</p>
            </Link>
          )}
          {moderationCounts.newFeedback > 0 && (
            <Link
              href="/admin/feedback"
              className="rounded-2xl border border-violet-200 bg-violet-50 p-5 hover:bg-violet-100"
            >
              <p className="text-3xl font-bold text-violet-800">{moderationCounts.newFeedback}</p>
              <p className="mt-1 font-semibold text-violet-700">New feedback item{moderationCounts.newFeedback === 1 ? "" : "s"}</p>
            </Link>
          )}
        </div>
      )}

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Agent Insights</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Logins this week</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{engagement.loginsThisWeek}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Quizzes submitted this week</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{engagement.quizSubmissionsThisWeek}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Most active team this week</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {engagement.topTeam ? `${engagement.topTeam.name} (${engagement.topTeam.attempts})` : "—"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Quiz Pass-Rate Trend</h3>
            <QuizTrendChart data={quizTrend} />
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Recently Created Agents</h3>
            {recentAgents.length === 0 ? (
              <p className="text-slate-500">No agent accounts yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentAgents.map((agent) => (
                  <li key={agent.id}>
                    <Link
                      href={`/admin/portal-users/${agent.id}/activity`}
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50"
                    >
                      <span className="font-medium text-slate-800">{agent.name}</span>
                      <span className="text-sm text-slate-500">
                        {agent.createdAt.toLocaleDateString("en-GB")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Find an Agent</h3>
            <AgentQuickFind agents={agents} />
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900">Recent Portal Activity</h3>
            {recentPortalActivity.length === 0 ? (
              <p className="text-slate-500">No portal activity yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentPortalActivity.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                  >
                    <span className="font-medium text-slate-800">
                      {log.action} {log.entity} — {log.userName}
                    </span>
                    <span className="text-sm text-slate-500">
                      {log.createdAt.toLocaleString("en-GB")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Administration Modules
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-6 h-3 w-20 rounded-full ${module.color}`}
              />

              <h3 className="text-xl font-bold text-slate-900">
                {module.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {module.description}
              </p>

              <div className="mt-8 font-semibold text-red-700">
                Open Module →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            Recent Activity
          </h2>

          {activity.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No recent activity available.
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {activity.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-5 py-4 hover:bg-slate-50"
                  >
                    <span className="font-medium text-slate-800">
                      {item.label}
                    </span>

                    <span className="text-sm text-slate-500">
                      {item.date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            Quick Actions
          </h2>

          <div className="mt-6 grid gap-4">
            <Link
              href="/admin/articles/new"
              className="rounded-xl bg-red-700 px-5 py-4 text-center font-semibold text-white hover:bg-red-800"
            >
              Create New Knowledge Article
            </Link>

            <Link
              href="/admin/categories"
              className="rounded-xl border px-5 py-4 text-center font-semibold hover:bg-slate-50"
            >
              Manage Categories
            </Link>

            <Link
              href="/admin/announcements"
              className="rounded-xl border px-5 py-4 text-center font-semibold hover:bg-slate-50"
            >
              Publish Announcement
            </Link>

            <Link
              href="/admin/training"
              className="rounded-xl border px-5 py-4 text-center font-semibold hover:bg-slate-50"
            >
              Training Center
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}