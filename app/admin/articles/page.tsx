import Link from "next/link";
import { getArticles } from "@/lib/article-service";
import ArticleTable from "@/components/admin/ArticleTable";

export default async function ArticlesPage() {

  const articles = await getArticles();

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Articles
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all knowledge base articles.
          </p>

        </div>

        <Link
          href="/admin/articles/new"
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          + New Article
        </Link>

      </div>

      <ArticleTable articles={articles} />

    </div>
  );
}