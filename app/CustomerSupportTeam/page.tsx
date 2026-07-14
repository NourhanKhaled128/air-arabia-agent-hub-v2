export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Folder } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getVisibleCategoriesForSidebar, getArticleCountsByCategory } from "@/lib/category-service";
import { CUSTOMER_SUPPORT_TEAM_GROUP } from "@/lib/customer-support-team";

export default async function CustomerSupportTeamOverviewPage() {
  const [allCategories, articleCounts] = await Promise.all([
    getVisibleCategoriesForSidebar(),
    getArticleCountsByCategory(),
  ]);

  const categories = allCategories.filter((c) => c.group === CUSTOMER_SUPPORT_TEAM_GROUP);

  return (
    <>
      <PageHeader
        title="Customer Support Team"
        subtitle="Resources and procedures for the customer support team."
      />

      {categories.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700">
            No sections yet.
          </p>
          <p className="mt-2 text-gray-500">
            Add a category with Sidebar Group set to &quot;Customer Support Team&quot; from the admin panel.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/CustomerSupportTeam/category/${category.slug}`}
              className="block rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm transition hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-2xl bg-red-100 dark:bg-brand/10 p-3 text-red-700 dark:text-brand">
                  <Folder size={24} />
                </div>
                <ArrowRight size={20} className="text-gray-400 dark:text-slate-500" />
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-slate-100">
                {category.name}
              </h2>

              {category.description && (
                <p className="mt-2 text-gray-600 dark:text-slate-400">{category.description}</p>
              )}

              <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
                {articleCounts[String(category.id)] ?? 0} articles
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
