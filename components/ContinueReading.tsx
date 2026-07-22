import Link from "next/link";
import { BookOpen, History } from "lucide-react";
import { getCurrentPortalUser } from "@/lib/portal-dal";
import { getRecentlyViewedArticles } from "@/lib/article-view-service";

export default async function ContinueReading() {
  const user = await getCurrentPortalUser();
  if (!user) return null;

  const recent = await getRecentlyViewedArticles(user.id, 6);
  if (recent.length === 0) return null;

  const [latest, ...rest] = recent;

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <Link
        href={`${latest.basePath}/${latest.slug}`}
        className="flex items-center gap-4 rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm transition hover:shadow-lg"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-brand">
          <BookOpen size={26} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Continue Reading</p>
          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-slate-100">{latest.title}</p>
        </div>
      </Link>

      {rest.length > 0 && (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-slate-400">
            <History size={16} />
            Recently Viewed
          </p>
          <ul className="space-y-2">
            {rest.map((article) => (
              <li key={article.articleId}>
                <Link
                  href={`${article.basePath}/${article.slug}`}
                  className="block truncate rounded-lg px-2 py-1.5 font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
