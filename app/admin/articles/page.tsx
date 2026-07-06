import Link from "next/link";
import { getAllArticles } from "@/lib/article-service";
import ArticleTable from "@/components/admin/ArticleTable";

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Knowledge Base Articles
          </h1>

          <p className="mt-3 text-gray-500">
            Create, edit, publish, archive and organize your knowledge base.
          </p>
        </div>

        <div className="flex gap-3">
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
        </div>
      </div>

      <ArticleTable articles={articles} />
    </div>
  );
}