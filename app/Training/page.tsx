import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/Data/articles";

export default function TrainingPage() {
  const trainingArticles = articles.filter(
    (article) => article.category === "Training"
  );

  return (
    <AppLayout>
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
    </AppLayout>
  );
}