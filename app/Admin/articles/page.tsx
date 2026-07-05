import Link from "next/link";
import ArticleTable from "@/components/ArticleTable";

export default function ArticlesPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Articles
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your knowledge base.
          </p>

        </div>

        <Link
          href="/admin/articles/new"
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
        >
          + New Article
        </Link>

      </div>

      <ArticleTable />

    </div>
  );
}