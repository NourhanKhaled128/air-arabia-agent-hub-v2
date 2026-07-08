import Link from "next/link";
import ArticleForm from "@/components/admin/article/ArticleForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getCategories } from "@/lib/category-service";
import { getDispositionCodes } from "@/lib/disposition-service";

export default async function NewArticlePage() {
  const [categories, dispositionCodes] = await Promise.all([
    getCategories(),
    getDispositionCodes(),
  ]);

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Create Knowledge Article"
        description="Add a new article to the Air Arabia knowledge base."
        actions={
          <Link
            href="/admin/articles"
            className="rounded-xl border px-6 py-3 font-semibold hover:bg-gray-50"
          >
            ← Back to Articles
          </Link>
        }
      />

      <ArticleForm categories={categories} dispositionCodes={dispositionCodes} />

    </div>
  );
}