export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Clock, Bookmark, MessageSquare, ThumbsUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getAgentQuizStats } from "@/lib/quiz-service";
import { getCommentsByPortalUser } from "@/lib/comment-service";
import { getFeedbackByPortalUser } from "@/lib/feedback-service";
import { getBookmarkedArticles } from "@/lib/article-bookmark-service";

function formatLastActive(date: Date | null) {
  if (!date) return "Never";
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default async function AccountPage() {
  const user = await getCurrentPortalUser();
  if (!user) redirect("/login");

  const [stats, comments, feedback, bookmarks] = await Promise.all([
    getAgentQuizStats(user.email),
    getCommentsByPortalUser(user.id),
    getFeedbackByPortalUser(user.id),
    getBookmarkedArticles(user.id),
  ]);

  return (
    <>
      <PageHeader title="My Account" subtitle="Your identity, activity, and saved articles." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-brand">
              <User size={22} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-slate-100">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-slate-400">Team</dt>
              <dd className="font-semibold text-gray-900 dark:text-slate-100">{user.team?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-slate-400">Last active</dt>
              <dd className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-slate-100">
                <Clock size={14} />
                {formatLastActive(user.lastLoginAt)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500 dark:text-slate-400">Member since</dt>
              <dd className="font-semibold text-gray-900 dark:text-slate-100">
                {user.createdAt.toLocaleDateString("en-GB")}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-slate-100">Quiz Progress</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 dark:border-border-subtle p-4">
              <p className="text-sm text-gray-500 dark:text-slate-400">Completed</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.completed}</p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-border-subtle p-4">
              <p className="text-sm text-gray-500 dark:text-slate-400">Passed</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.passed}</p>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-border-subtle p-4">
              <p className="text-sm text-gray-500 dark:text-slate-400">Average Score</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-slate-100">
                {stats.avgPercentage != null ? `${stats.avgPercentage}%` : "—"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-slate-100">
            <Bookmark size={18} />
            Bookmarks ({bookmarks.length})
          </h2>
          {bookmarks.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-slate-400">No bookmarked articles yet.</p>
          ) : (
            <ul className="space-y-2">
              {bookmarks.map((b) => (
                <li key={b.articleId}>
                  <Link
                    href={`/Knowledge/${b.slug}`}
                    className="block truncate rounded-lg px-2 py-1.5 font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
                  >
                    {b.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-slate-100">
            <MessageSquare size={18} />
            Your Comments ({comments.length})
          </h2>
          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-slate-400">No comments yet.</p>
          ) : (
            <ul className="space-y-2">
              {comments.map((c) => (
                <li key={c.id} className="rounded-lg border border-gray-200 dark:border-border-subtle p-3 text-sm">
                  <p className="text-gray-500 dark:text-slate-400">{c.article.title}</p>
                  <p className="mt-1 text-gray-800 dark:text-slate-200">{c.content}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm lg:col-span-1">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-slate-100">
            <ThumbsUp size={18} />
            Your Feedback ({feedback.length})
          </h2>
          {feedback.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-slate-400">No feedback submitted yet.</p>
          ) : (
            <ul className="space-y-2">
              {feedback.map((f) => (
                <li key={f.id} className="rounded-lg border border-gray-200 dark:border-border-subtle p-3 text-sm">
                  <p className="text-gray-500 dark:text-slate-400">
                    {f.article.title} · {f.helpful ? "Helpful" : "Not helpful"}
                  </p>
                  {f.message && <p className="mt-1 text-gray-800 dark:text-slate-200">{f.message}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
