import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategoryName } from "@/lib/article-service";
import { sortByModuleNumber } from "@/lib/helpers";

export default async function TrainingArticlesPage() {
  const trainingArticles = sortByModuleNumber(
    await getArticlesByCategoryName("Training")
  );

  return (
    <>
      <PageHeader
        title="Training"
        subtitle={
          trainingArticles.length > 0
            ? `${trainingArticles.length} onboarding modules — work through them in order.`
            : "Training manuals, SOPs and onboarding material."
        }
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
