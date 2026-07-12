import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategoryAndFolderName } from "@/lib/article-service";

export default async function PaymentsPage() {
  const payments = await getArticlesByCategoryAndFolderName("General Information", "Payments");

  return (
    <>

      <PageHeader
        title="Payments"
        subtitle="Payment methods, vouchers and ADM policies."
      />

      <div className="space-y-8">

        {payments.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}

      </div>

    </>
  );
}
