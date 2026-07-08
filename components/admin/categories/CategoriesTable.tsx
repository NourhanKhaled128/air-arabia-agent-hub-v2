"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import CategoryRowActions from "./CategoryRowActions";
import { deleteManyCategoriesAction } from "@/app/admin/actions/category-actions";

interface Category {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  group: string;
  order: number;
  visible: boolean;
}

interface Props {
  categories: Category[];
  articleCounts: Record<string, number>;
}

function categoryBadgeColor(color?: string | null): "red" | "green" | "blue" | "yellow" | "gray" {
  if (!color) return "gray";
  if (color.includes("red")) return "red";
  if (color.includes("blue")) return "blue";
  if (color.includes("emerald") || color.includes("green")) return "green";
  if (color.includes("amber") || color.includes("yellow")) return "yellow";
  return "gray";
}

export default function CategoriesTable({ categories, articleCounts }: Props) {
  return (
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
            {articleCounts[category.id] ?? 0}
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
  );
}
