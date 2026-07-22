import Link from "next/link";
import { Folder } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Breadcrumb from "@/components/Breadcrumb";
import ArticleCard from "@/components/ArticleCard";

interface FolderItem {
  id: number;
  name: string;
}

interface ArticleItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  updatedAt: Date;
  folderId: number | null;
}

interface Props {
  categoryName: string;
  categorySlug: string;
  basePath: string;
  categoryHref: string;
  breadcrumbRoot: { label: string; href: string };
  folders: FolderItem[];
  articles: ArticleItem[];
  folderParam?: string;
  viewedAt: Map<number, Date>;
  hasPortalUser: boolean;
}

export default function CategoryBrowser({
  categoryName,
  basePath,
  categoryHref,
  breadcrumbRoot,
  folders,
  articles,
  folderParam,
  viewedAt,
  hasPortalUser,
}: Props) {
  const folderCounts = new Map<number, number>();
  let noFolderCount = 0;
  for (const article of articles) {
    if (article.folderId) {
      folderCounts.set(article.folderId, (folderCounts.get(article.folderId) ?? 0) + 1);
    } else {
      noFolderCount++;
    }
  }

  const hasFolders = folders.length > 0;
  const showPicker = hasFolders && !folderParam;

  const activeFolder = folderParam && folderParam !== "all" && folderParam !== "none"
    ? folders.find((f) => f.id === Number(folderParam))
    : undefined;

  const activeLabel = activeFolder?.name ?? (folderParam === "none" ? "Uncategorized" : undefined);

  const displayedArticles = !folderParam || folderParam === "all"
    ? articles
    : folderParam === "none"
      ? articles.filter((a) => !a.folderId)
      : articles.filter((a) => a.folderId === Number(folderParam));

  return (
    <>
      <Breadcrumb
        items={[
          breadcrumbRoot,
          { label: categoryName, href: showPicker || !hasFolders ? undefined : categoryHref },
          ...(activeLabel ? [{ label: activeLabel }] : []),
        ]}
      />

      <PageHeader
        title={activeLabel ? `${categoryName} / ${activeLabel}` : categoryName}
        subtitle={
          showPicker
            ? `${folders.length} folder${folders.length === 1 ? "" : "s"} · ${articles.length} knowledge articles total`
            : `${displayedArticles.length} knowledge articles available`
        }
      />

      {showPicker ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((f) => (
            <Link
              key={f.id}
              href={`${categoryHref}?folder=${f.id}`}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-5 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-brand">
                <Folder size={22} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-slate-100">{f.name}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {folderCounts.get(f.id) ?? 0} article{(folderCounts.get(f.id) ?? 0) === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          ))}

          {noFolderCount > 0 && (
            <Link
              href={`${categoryHref}?folder=none`}
              className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-5 shadow-sm transition hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                <Folder size={22} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-slate-100">Uncategorized</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {noFolderCount} article{noFolderCount === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          )}

          <Link
            href={`${categoryHref}?folder=all`}
            className="flex items-center gap-4 rounded-2xl border border-dashed border-gray-300 dark:border-border-subtle bg-white dark:bg-surface p-5 text-gray-600 dark:text-slate-400 shadow-sm transition hover:shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-slate-800">
              <Folder size={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-slate-100">View All Articles</p>
              <p className="text-sm text-gray-500 dark:text-slate-400">{articles.length} total</p>
            </div>
          </Link>
        </div>
      ) : (
        <>
          {hasFolders && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={categoryHref}
                className="rounded-full border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface px-4 py-2 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                ← Folders
              </Link>

              <a
                href={`${categoryHref}?folder=all`}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  folderParam === "all"
                    ? "bg-red-700 text-white"
                    : "bg-white dark:bg-surface text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-border-subtle hover:bg-red-50 dark:hover:bg-red-950/40"
                }`}
              >
                All
              </a>

              {folders.map((f) => (
                <a
                  key={f.id}
                  href={`${categoryHref}?folder=${f.id}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    activeFolder?.id === f.id
                      ? "bg-red-700 text-white"
                      : "bg-white dark:bg-surface text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-border-subtle hover:bg-red-50 dark:hover:bg-red-950/40"
                  }`}
                >
                  {f.name}
                </a>
              ))}

              {noFolderCount > 0 && (
                <a
                  href={`${categoryHref}?folder=none`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    folderParam === "none"
                      ? "bg-red-700 text-white"
                      : "bg-white dark:bg-surface text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-border-subtle hover:bg-red-50 dark:hover:bg-red-950/40"
                  }`}
                >
                  Uncategorized
                </a>
              )}
            </div>
          )}

          {displayedArticles.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-700 dark:text-slate-300">
                No articles here yet.
              </p>
              <p className="mt-2 text-gray-500 dark:text-slate-400">
                Check back soon, or browse other {hasFolders ? "folders" : "categories"}.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedArticles.map((article) => {
                const lastViewed = viewedAt.get(article.id);
                const isNew = hasPortalUser && (!lastViewed || article.updatedAt > lastViewed);
                return (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    basePath={basePath}
                    isNew={isNew}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
