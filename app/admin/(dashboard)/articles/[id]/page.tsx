import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/article-service";
import EditArticleForm from "@/components/admin/article/EditArticleForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

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

      <AdminPageHeader
        title="Edit Article"
        description="Update article information."
      />

      <EditArticleForm article={article} />

    </div>
  );
}