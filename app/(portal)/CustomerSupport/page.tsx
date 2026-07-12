import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategoryName } from "@/lib/article-service";

export default async function CustomerSupportPage() {
  const articles = await getArticlesByCategoryName("Customer Support");

  return (
    <>

      <PageHeader
        title="Customer Support"
        subtitle="Complaint handling, baggage claims and escalation procedures."
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
