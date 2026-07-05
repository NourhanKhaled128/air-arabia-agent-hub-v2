import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import CategoryCard from "@/components/CategoryCard";
import { articles } from "@/Data/articles";

export default function KnowledgePage() {

  const categories = [...new Set(
    articles.map(article=>article.category)
  )];

  return (

    <AppLayout>

      <PageHeader
        title="Knowledge Base"
        subtitle="Browse Air Arabia operational knowledge."
      />

  

    </AppLayout>

  );

}