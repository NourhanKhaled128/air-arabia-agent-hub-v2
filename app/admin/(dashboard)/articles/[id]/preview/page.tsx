import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/admin-dal";
import ArticleDetailView from "@/components/ArticleDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArticlePreviewPage({ params }: Props) {
  await requireAdminUser();

  const { id } = await params;
  const articleId = Number(id);

  if (!Number.isInteger(articleId)) {
    notFound();
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { slug: true },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900">
        Preview mode — this is how the article will look to agents once published.
        Draft articles normally 404 on the public site; this view bypasses that gate
        for admins only.
      </div>

      <ArticleDetailView slug={article.slug} allowDraft />
    </div>
  );
}
