import Link from "next/link";
import { FolderOpen, Plus, Layers3 } from "lucide-react";
import { getCategories, getArticleCountsByCategory } from "@/lib/category-service";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import CategoriesTable from "@/components/admin/categories/CategoriesTable";

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

      <CategoriesTable categories={categories} articleCounts={articleCounts} />
    </div>
  );
}
