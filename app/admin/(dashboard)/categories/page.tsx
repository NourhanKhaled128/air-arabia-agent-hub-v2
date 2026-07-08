import Link from "next/link";
import { FolderOpen, Plus, Layers3 } from "lucide-react";
import { getCategories, getArticleCountsByCategory } from "@/lib/category-service";
import { deleteManyCategoriesAction } from "@/app/admin/actions/category-actions";
import CategoryRowActions from "@/components/admin/categories/CategoryRowActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminListTable from "@/components/admin/AdminListTable";

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

      <AdminListTable
        columns={[
          { key: "name", label: "Category" },
          { key: "description", label: "Description" },
          { key: "articles", label: "Articles" },
          { key: "group", label: "Group" },
          { key: "order", label: "Order" },
          { key: "visible", label: "Visible" },
        ]}
        data={categories}
        searchPlaceholder="Search categories..."
        searchFn={(category, query) => {
          const q = query.toLowerCase();
          return (
            category.name.toLowerCase().includes(q) ||
            (category.description ?? "").toLowerCase().includes(q) ||
            category.group.toLowerCase().includes(q)
          );
        }}
        filters={[
          {
            key: "visible",
            label: "Visibility",
            options: [
              { value: "visible", label: "Visible" },
              { value: "hidden", label: "Hidden" },
            ],
          },
        ]}
        filterFn={(category, values) => {
          if (values.visible === "visible" && !category.visible) return false;
          if (values.visible === "hidden" && category.visible) return false;
          return true;
        }}
        onDeleteMany={deleteManyCategoriesAction}
        emptyMessage="No categories yet."
        renderRow={(category) => (
          <>
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
          </>
        )}
      />
    </div>
  );
}
