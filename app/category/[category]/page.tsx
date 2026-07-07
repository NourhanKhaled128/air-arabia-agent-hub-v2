import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/lib/article-service";
import { getCategoryBySlug } from "@/lib/category-service";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const decodedSlug = decodeURIComponent(category);

  const categoryRow = await getCategoryBySlug(decodedSlug);

  if (!categoryRow) {
    notFound();
  }

  const categoryArticles = await getArticlesByCategory(categoryRow.name);

  return (
    <AppLayout>
      <PageHeader
        title={categoryRow.name}
        subtitle={`${categoryArticles.length} knowledge articles available`}
      />

      {categoryArticles.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700">
            No articles in this category yet.
          </p>
          <p className="mt-2 text-gray-500">
            Check back soon, or browse other categories from the sidebar.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {categoryArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
