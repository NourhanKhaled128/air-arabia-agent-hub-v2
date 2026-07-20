import Link from "next/link";
import { ExternalLink, FolderOpen, Layers3, Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import CategoriesTable from "@/components/admin/categories/CategoriesTable";
import ArticleTable from "@/components/admin/ArticleTable";
import { getCategories, getArticleCountsByCategory } from "@/lib/category-service";
import { getAllArticles } from "@/lib/article-service";

interface Props {
  teamName: string;
  teamGroup: string;
  publicPath: string;
}

export default async function TeamDashboard({ teamName, teamGroup, publicPath }: Props) {
  const [allCategories, articleCounts, allArticles] = await Promise.all([
    getCategories(),
    getArticleCountsByCategory(),
    getAllArticles(),
  ]);

  const categories = allCategories.filter((c) => c.group === teamGroup);
  const categoryNames = new Set(categories.map((c) => c.name));
  const articles = allArticles.filter((a) => categoryNames.has(a.category));

  const totalArticles = categories.reduce(
    (sum, category) => sum + (articleCounts[String(category.id)] ?? 0),
    0
  );

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title={teamName}
        description={`Categories and articles scoped to the "${teamGroup}" sidebar group, shown on the separated public section.`}
        actions={
          <>
            <Link
              href={publicPath}
              target="_blank"
              className="flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold hover:bg-gray-50"
            >
              <ExternalLink size={18} />
              View Public Page
            </Link>

            <Link
              href={`/admin/categories/new?group=${encodeURIComponent(teamGroup)}`}
              className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
            >
              <Plus size={18} />
              New Category
            </Link>
          </>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminStatCard title="Categories" value={categories.length} icon={FolderOpen} />
        <AdminStatCard title="Articles" value={totalArticles} icon={Layers3} color="text-blue-700" />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold dark:text-slate-100">Categories</h2>
        <CategoriesTable categories={categories} articleCounts={articleCounts} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold dark:text-slate-100">Articles</h2>
        <ArticleTable articles={articles} />
      </div>

    </div>
  );
}
