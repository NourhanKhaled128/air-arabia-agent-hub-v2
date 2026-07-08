import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategoryName } from "@/lib/article-service";

export default async function RefundsPage() {
  const refunds = await getArticlesByCategoryName("Refunds");

  return (
    <>

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

    </>
  );
}
