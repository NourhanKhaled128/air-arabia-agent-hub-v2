export const dynamic = "force-dynamic";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/article-service";

export default async function KnowledgePage() {
  const articles = await getAllArticles();

  return (
    <AppLayout>
      <PageHeader
        title="Knowledge Base"
        subtitle={`${articles.length} knowledge articles available`}
      />

      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </AppLayout>
  );
}
