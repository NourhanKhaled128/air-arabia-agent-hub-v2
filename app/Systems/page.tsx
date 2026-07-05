import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/Data/articles";

export default function SystemsPage() {
  const systemArticles = articles.filter(
    (article) => article.category === "Systems"
  );

  return (
    <AppLayout>
      <PageHeader
        title="Systems"
        subtitle="Navitaire, Salesforce and internal system guides."
      />

      <div className="space-y-6">
        {systemArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </AppLayout>
  );
}