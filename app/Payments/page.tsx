import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/Data/articles";

export default function RefundsPage() {

  const refunds = articles.filter(
    article => article.category === "Refunds"
  );

  return (
    <AppLayout>

      <PageHeader
        title="Refunds"
        subtitle="Refund procedures and customer policies."
      />

      <div className="space-y-8">

        {refunds.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}

      </div>

    </AppLayout>
  );
}