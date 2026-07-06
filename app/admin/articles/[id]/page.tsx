import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/article-service";
import EditArticleForm from "@/components/admin/article/EditArticleForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;

  const article = await getArticleById(Number(id));

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Edit Article
        </h1>

        <p className="mt-2 text-gray-500">
          Update article information.
        </p>

      </div>

      <EditArticleForm article={article} />

    </div>
  );
}