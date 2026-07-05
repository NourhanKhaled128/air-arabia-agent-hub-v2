import ArticleForm from "@/components/admin/article/ArticleForm";

export default function NewArticlePage() {
  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Create Article
        </h1>

        <p className="mt-2 text-gray-500">
          Add a new knowledge base article.
        </p>

      </div>

      <ArticleForm />

    </div>
  );
}