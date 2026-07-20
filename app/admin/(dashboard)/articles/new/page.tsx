import Link from "next/link";
import ArticleForm from "@/components/admin/article/ArticleForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getCategoriesWithFolders } from "@/lib/category-service";
import { getDispositionCodes } from "@/lib/disposition-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

export default async function NewArticlePage() {
  const [categories, dispositionCodes, currentUser] = await Promise.all([
    getCategoriesWithFolders(),
    getDispositionCodes(),
    getCurrentAdminUser(),
  ]);

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Create Knowledge Article"
        description="Add a new article to the Air Arabia knowledge base."
        breadcrumbs={[{ label: "Articles", href: "/admin/articles" }, { label: "New Article" }]}
        actions={
          <Link
            href="/admin/articles"
            className="rounded-xl border px-6 py-3 font-semibold hover:bg-gray-50"
          >
            ← Back to Articles
          </Link>
        }
      />

      <ArticleForm
        categories={categories}
        dispositionCodes={dispositionCodes}
        defaultAuthor={currentUser?.name ?? ""}
      />

    </div>
  );
}