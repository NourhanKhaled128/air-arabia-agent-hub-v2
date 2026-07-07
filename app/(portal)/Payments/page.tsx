import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/lib/article-service";

export default async function PaymentsPage() {
  const payments = await getArticlesByCategory("Payments");

  return (
    <AppLayout>

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

    </AppLayout>
  );
}
