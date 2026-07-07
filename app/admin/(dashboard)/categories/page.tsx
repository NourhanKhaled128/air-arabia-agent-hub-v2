import Link from "next/link";
import { FolderOpen, Plus, Layers3 } from "lucide-react";
import { getCategories, getArticleCountsByCategory } from "@/lib/category-service";
import CategoryRowActions from "@/components/admin/categories/CategoryRowActions";

export default async function CategoriesPage() {
  const [categories, articleCounts] = await Promise.all([
    getCategories(),
    getArticleCountsByCategory(),
  ]);

  const totalArticles = Object.values(articleCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Categories
          </h1>

          <p className="mt-3 text-slate-500">
            Organize your knowledge base with categories and subcategories.
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          <Plus size={18} />
          New Category
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <FolderOpen className="mb-4 text-red-700" />
          <p className="text-sm text-slate-500">Categories</p>
          <h2 className="mt-2 text-3xl font-bold">{categories.length}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Layers3 className="mb-4 text-blue-700" />
          <p className="text-sm text-slate-500">Articles</p>
          <h2 className="mt-2 text-3xl font-bold">{totalArticles}</h2>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Articles</th>
              <th className="px-6 py-4">Group</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Visible</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t">
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${category.color ?? "bg-slate-100 text-slate-700"}`}
                  >
                    {category.name}
                  </span>
                </td>

                <td className="px-6 py-5 text-slate-600">
                  {category.description}
                </td>

                <td className="px-6 py-5 font-semibold">
                  {articleCounts[category.name] ?? 0}
                </td>

                <td className="px-6 py-5 text-slate-600">
                  {category.group}
                </td>

                <td className="px-6 py-5 text-slate-600">
                  {category.order}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      category.visible
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {category.visible ? "Visible" : "Hidden"}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <CategoryRowActions id={category.id} />
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
