import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategoryName } from "@/lib/article-service";

export default async function CustomerSupportTeamPage() {
  const articles = await getArticlesByCategoryName("Customer Support Team");

  return (
    <>

      <PageHeader
        title="Customer Support Team"
        subtitle="Resources and procedures for the customer support team."
      />

      <div className="space-y-8">

        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}

      </div>

    </>
  );
}
