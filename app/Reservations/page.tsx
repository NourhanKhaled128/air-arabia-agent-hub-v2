import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/Data/articles";

export default function ReservationsPage() {
  const reservationArticles = articles.filter(
    (article) => article.category === "Reservations"
  );

  return (
    <AppLayout>
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
    </AppLayout>
  );
}