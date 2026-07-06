import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/lib/article-service";

export default async function RefundsPage() {
  const refunds = await getArticlesByCategory("Refunds");

  return (
    <AppLayout>

      <PageHeader
        title="Refunds"
        subtitle="Refund procedures and customer policies."
      />

      <div className="space-y-8">

        {refunds.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}

      </div>

    </AppLayout>
  );
}
