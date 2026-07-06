import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/lib/article-service";

export default async function AncillariesPage() {
  const ancillaryArticles = await getArticlesByCategory("Ancillaries");

  return (
    <AppLayout>
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
    </AppLayout>
  );
}
