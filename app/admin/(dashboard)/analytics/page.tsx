import Link from "next/link";
import {
  Users,
  BookOpen,
  Folder,
  GraduationCap,
  Eye,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { getDashboardStats } from "@/lib/dashboard-service";
import { getTotalArticleViews, getArticleFeedbackStats } from "@/lib/article-service";
import { getUsers } from "@/lib/user-service";

export default async function AnalyticsPage() {
  const [stats, totalViews, users, feedbackStats] = await Promise.all([
    getDashboardStats(),
    getTotalArticleViews(),
    getUsers(),
    getArticleFeedbackStats(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Analytics"
        description="Real usage counts pulled directly from the database."
      />

      <div className="grid gap-6 md:grid-cols-5">
        <AdminStatCard title="Admin Users" value={users.length} icon={Users} />
        <AdminStatCard title="Articles" value={stats.articles} icon={BookOpen} color="text-blue-700" />
        <AdminStatCard title="Categories" value={stats.categories} icon={Folder} color="text-violet-700" />
        <AdminStatCard title="Training Courses" value={stats.courses} icon={GraduationCap} color="text-emerald-700" />
        <AdminStatCard title="Article Views" value={totalViews} icon={Eye} color="text-amber-700" />
      </div>

      <section className="rounded-3xl bg-white dark:bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
          Article Helpfulness ({feedbackStats.length})
        </h2>

        {feedbackStats.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            No &ldquo;Was this helpful?&rdquo; feedback recorded yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {feedbackStats.map((stat) => (
              <li key={stat.articleId}>
                <Link
                  href={`/admin/articles/${stat.articleId}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-border-subtle px-4 py-3 hover:bg-slate-50 dark:hover:bg-surface-muted"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {stat.title}
                  </span>

                  <span className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                      {stat.helpful} helpful / {stat.notHelpful} not helpful
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        stat.ratio === null
                          ? "bg-slate-100 text-slate-600"
                          : stat.ratio >= 70
                            ? "bg-emerald-100 text-emerald-700"
                            : stat.ratio >= 40
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stat.ratio === null ? "—" : `${stat.ratio}%`}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
