import Link from "next/link";
import { getAllArticles } from "@/lib/article-service";
import ArticleTable from "@/components/admin/ArticleTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default async function ArticlesPage() {
  const articles = await getAllArticles();
  const pendingReview = articles.filter((a) => a.status === "Review").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Knowledge Base Articles"
        description="Create, edit, publish, archive and organize your knowledge base."
        actions={
          <>
            <Link
              href="/admin/categories"
              className="rounded-xl border px-6 py-3 font-semibold hover:bg-gray-50"
            >
              Categories
            </Link>

            <Link
              href="/admin/articles/new"
              className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
            >
              + New Article
            </Link>
          </>
        }
      />

      {pendingReview > 0 && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 font-semibold text-blue-800">
          {pendingReview} article{pendingReview === 1 ? "" : "s"} pending review — filter by "Review" status below to find them.
        </div>
      )}

      <ArticleTable articles={articles} />
    </div>
  );
}