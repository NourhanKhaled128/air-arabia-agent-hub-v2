import Link from "next/link";
import { FolderOpen, Plus, Layers3 } from "lucide-react";
import { getCategories, getArticleCountsByCategory } from "@/lib/category-service";
import CategoryRowActions from "@/components/admin/categories/CategoryRowActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";

function categoryBadgeColor(color?: string | null): "red" | "green" | "blue" | "yellow" | "gray" {
  if (!color) return "gray";
  if (color.includes("red")) return "red";
  if (color.includes("blue")) return "blue";
  if (color.includes("emerald") || color.includes("green")) return "green";
  if (color.includes("amber") || color.includes("yellow")) return "yellow";
  return "gray";
}

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
      <AdminPageHeader
        title="Categories"
        description="Organize your knowledge base with categories and subcategories."
        actions={
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            <Plus size={18} />
            New Category
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminStatCard title="Categories" value={categories.length} icon={FolderOpen} />
        <AdminStatCard title="Articles" value={totalArticles} icon={Layers3} color="text-blue-700" />
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
                  <AdminBadge color={categoryBadgeColor(category.color)}>
                    {category.name}
                  </AdminBadge>
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
                  <AdminBadge color={category.visible ? "green" : "gray"}>
                    {category.visible ? "Visible" : "Hidden"}
                  </AdminBadge>
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
