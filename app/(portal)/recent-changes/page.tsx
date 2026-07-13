export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getRecentArticleChanges } from "@/lib/article-service";
import { getCategoryBadgeClasses } from "@/lib/helpers";
import { isSidebarLinkEnabled } from "@/lib/sidebar-service";

const ACTION_LABELS: Record<string, string> = {
  Created: "New article",
  Updated: "Updated",
  Published: "Published",
};

export default async function RecentChangesPage() {
  if (!(await isSidebarLinkEnabled("/recent-changes"))) notFound();

  const changes = await getRecentArticleChanges(20);

  return (
    <>
      <PageHeader
        title="Recent Changes"
        subtitle="What's changed in the Knowledge Base recently — check before assuming an article you read a while ago is still current."
      />

      {changes.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-gray-500 dark:text-slate-400">No recent changes recorded.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {changes.map((change, i) => (
            <Link
              key={i}
              href={`/Knowledge/${change.article.slug}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-5 shadow-sm transition hover:border-red-300"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-gray-100 dark:bg-background px-3 py-1 text-xs font-semibold text-gray-600 dark:text-slate-400">
                  {ACTION_LABELS[change.action] ?? change.action}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryBadgeClasses(change.article.category)}`}>
                  {change.article.category}
                </span>
                <span className="font-semibold text-gray-900 dark:text-slate-100">{change.article.title}</span>
              </div>

              <span className="text-sm text-gray-500 dark:text-slate-400">
                {change.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
