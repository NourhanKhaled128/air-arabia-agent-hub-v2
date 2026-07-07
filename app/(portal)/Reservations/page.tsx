import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { getArticlesByCategory } from "@/lib/article-service";

export default async function ReservationsPage() {
  const reservationArticles = await getArticlesByCategory("Reservations");

  return (
    <>
      <PageHeader
        title="Reservations"
        subtitle="Reservation procedures, booking policies and operational guides."
      />

      <div className="grid gap-6">
        {reservationArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </>
  );
}
