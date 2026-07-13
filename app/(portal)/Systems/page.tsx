import { ExternalLink } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import CopyButton from "@/components/CopyButton";
import { getArticlesByCategoryName } from "@/lib/article-service";
import { getVisibleImportantLinks } from "@/lib/important-link-service";

export default async function SystemsPage() {
  const [systemArticles, links] = await Promise.all([
    getArticlesByCategoryName("Systems"),
    getVisibleImportantLinks(),
  ]);

  return (
    <>
      <PageHeader
        title="Systems"
        subtitle="Navitaire, Salesforce and internal system guides."
      />

      <div className="mb-8 rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm">
        <p className="font-semibold text-gray-900 dark:text-slate-100">Site shortcut</p>
        <p className="mt-1 text-gray-600 dark:text-slate-400">
          Press <kbd className="rounded-md border border-gray-300 dark:border-border-subtle px-1.5 py-0.5 text-sm">⌘K</kbd> (or Ctrl+K) anywhere in the portal to jump straight to search.
        </p>
      </div>

      {links.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-gray-900 dark:text-slate-100">{link.title}</h3>
                <div className="flex shrink-0 items-center gap-2">
                  <CopyButton text={link.url} compact />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-300 dark:border-border-subtle p-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-surface-muted"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {link.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">{link.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {systemArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </>
  );
}
