import Link from "next/link";
import ArticleForm from "@/components/admin/article/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Create Knowledge Article
          </h1>

          <p className="mt-3 text-gray-500">
            Add a new article to the Air Arabia knowledge base.
          </p>

        </div>

        <Link
          href="/admin/articles"
          className="rounded-xl border px-6 py-3 font-semibold hover:bg-gray-50"
        >
          ← Back to Articles
        </Link>

      </div>

      <ArticleForm />

    </div>
  );
}