export const dynamic = "force-dynamic";

import Link from "next/link";
import { Folder } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getVisibleCategoriesForSidebar, getArticleCountsByCategory } from "@/lib/category-service";
import { CUSTOMER_SUPPORT_TEAM_GROUP } from "@/lib/customer-support-team";
import { TRADE_SUPPORT_TEAM_GROUP } from "@/lib/trade-support-team";

export default async function KnowledgePage() {
  const [allCategories, articleCounts] = await Promise.all([
    getVisibleCategoriesForSidebar(),
    getArticleCountsByCategory(),
  ]);

  const categories = allCategories.filter(
    (c) => c.group !== CUSTOMER_SUPPORT_TEAM_GROUP && c.group !== TRADE_SUPPORT_TEAM_GROUP
  );

  const totalArticles = categories.reduce((sum, c) => sum + (articleCounts[String(c.id)] ?? 0), 0);

  const groups = new Map<string, typeof categories>();
  for (const category of categories) {
    const list = groups.get(category.group) ?? [];
    list.push(category);
    groups.set(category.group, list);
  }

  return (
    <>
      <PageHeader
        title="Knowledge Base"
        subtitle={`${categories.length} categories · ${totalArticles} knowledge articles available`}
      />

      {categories.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-300">
            No categories yet.
          </p>
          <p className="mt-2 text-gray-500 dark:text-slate-400">
            Add a category from the admin panel to start organizing articles here.
          </p>
        </div>
      ) : (
        Array.from(groups.entries()).map(([group, groupCategories]) => (
          <section key={group} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{group}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-5 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-brand">
                    <Folder size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">{category.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      {articleCounts[String(category.id)] ?? 0} article
                      {(articleCounts[String(category.id)] ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
