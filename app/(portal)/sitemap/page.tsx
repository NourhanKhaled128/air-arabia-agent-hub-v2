export const dynamic = "force-dynamic";

import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getVisibleCategoriesForSidebar } from "@/lib/category-service";
import { getVisibleSidebarLinksBySection } from "@/lib/sidebar-service";

export default async function SitemapPage() {
  const [categories, pinnedLinks, toolLinks] = await Promise.all([
    getVisibleCategoriesForSidebar(),
    getVisibleSidebarLinksBySection("pinned"),
    getVisibleSidebarLinksBySection("tools"),
  ]);

  const groups = new Map<string, typeof categories>();
  for (const category of categories) {
    const list = groups.get(category.group) ?? [];
    list.push(category);
    groups.set(category.group, list);
  }

  return (
    <>
      <PageHeader
        title="Site Index"
        subtitle="Every section and category in one place."
      />

      {Array.from(groups.entries()).map(([group, groupCategories]) => (
        <section key={group} className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">{group}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {groupCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="rounded-xl border border-gray-200 dark:border-border-subtle px-4 py-3 font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">Sections & Tools</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[...pinnedLinks, ...toolLinks].map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="rounded-xl border border-gray-200 dark:border-border-subtle px-4 py-3 font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/decision-trees"
            className="rounded-xl border border-gray-200 dark:border-border-subtle px-4 py-3 font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
          >
            Decision Trees
          </Link>
          <Link
            href="/glossary"
            className="rounded-xl border border-gray-200 dark:border-border-subtle px-4 py-3 font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
          >
            Glossary
          </Link>
          <Link
            href="/quick-reference"
            className="rounded-xl border border-gray-200 dark:border-border-subtle px-4 py-3 font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
          >
            Quick Reference
          </Link>
          <Link
            href="/whats-new"
            className="rounded-xl border border-gray-200 dark:border-border-subtle px-4 py-3 font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
          >
            What&apos;s New
          </Link>
        </div>
      </section>
    </>
  );
}
