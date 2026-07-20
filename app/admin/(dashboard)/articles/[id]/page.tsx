import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/article-service";
import EditArticleForm from "@/components/admin/article/EditArticleForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getCategoriesWithFolders } from "@/lib/category-service";
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

  const [article, categories, dispositionCodes, history] = await Promise.all([
    getArticleById(articleId),
    getCategoriesWithFolders(),
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
        breadcrumbs={[{ label: "Articles", href: "/admin/articles" }, { label: article.title }]}
      />

      <EditArticleForm
        article={article}
        categories={categories}
        dispositionCodes={dispositionCodes}
        history={history}
      />

    </div>
  );
}