import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/lib/article-service";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const formattedCategory = decodeURIComponent(category).replace(/-/g, " ");

  const categoryArticles = await getArticlesByCategory(formattedCategory);

  if (categoryArticles.length === 0) {
    notFound();
  }

  return (
    <AppLayout>
      <PageHeader
        title={formattedCategory}
        subtitle={`${categoryArticles.length} knowledge articles available`}
      />

      <div className="space-y-6">
        {categoryArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </AppLayout>
  );
}