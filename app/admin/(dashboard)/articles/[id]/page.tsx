import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/article-service";
import EditArticleForm from "@/components/admin/article/EditArticleForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getCategories } from "@/lib/category-service";
import { getDispositionCodes } from "@/lib/disposition-service";
import { getAuditLogsForEntity } from "@/lib/audit-service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const articleId = Number(id);

  const [article, categories, dispositionCodes, updates] = await Promise.all([
    getArticleById(articleId),
    getCategories(),
    getDispositionCodes(),
    getAuditLogsForEntity("Article", articleId),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Edit Article"
        description="Update article information."
      />

      <EditArticleForm
        article={article}
        categories={categories}
        dispositionCodes={dispositionCodes}
        updates={updates}
      />

    </div>
  );
}