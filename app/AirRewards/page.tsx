import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/Data/articles";

export default function AirRewardsPage() {
  const rewardArticles = articles.filter(
    (article) => article.category === "AirRewards"
  );

  return (
    <AppLayout>
      <PageHeader
        title="AirRewards"
        subtitle="Loyalty programme policies and procedures."
      />

      <div className="space-y-6">
        {rewardArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </AppLayout>
  );
}