import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/Data/articles";

export default function AncillariesPage() {
  const ancillaryArticles = articles.filter(
    (article) => article.category === "Ancillaries"
  );

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