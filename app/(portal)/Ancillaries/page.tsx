import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategoryName } from "@/lib/article-service";

export default async function AncillariesPage() {
  const ancillaryArticles = await getArticlesByCategoryName("Ancillaries");

  return (
    <>
      <PageHeader
        title="Ancillaries"
        subtitle="Seats, baggage, meals and additional services."
      />

      <div className="space-y-6">
        {ancillaryArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </>
  );
}
