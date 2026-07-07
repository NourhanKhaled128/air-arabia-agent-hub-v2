import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/lib/article-service";

export default async function TrainingArticlesPage() {
  const trainingArticles = await getArticlesByCategory("Training");

  return (
    <>
      <PageHeader
        title="Training"
        subtitle="Training manuals, SOPs and onboarding material."
      />

      <div className="space-y-6">
        {trainingArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </>
  );
}
