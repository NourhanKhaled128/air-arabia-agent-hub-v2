import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/lib/article-service";

export default async function SystemsPage() {
  const systemArticles = await getArticlesByCategory("Systems");

  return (
    <>
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
    </>
  );
}
