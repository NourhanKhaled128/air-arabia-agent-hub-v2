import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/lib/article-service";

export default async function AirRewardsPage() {
  const rewardArticles = await getArticlesByCategory("AirRewards");

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
