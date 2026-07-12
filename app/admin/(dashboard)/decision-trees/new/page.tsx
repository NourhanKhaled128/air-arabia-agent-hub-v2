import Link from "next/link";
import DecisionTreeForm from "@/components/admin/decision-tree/DecisionTreeForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAllArticles } from "@/lib/article-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

export default async function NewDecisionTreePage() {
  const [articles, currentUser] = await Promise.all([
    getAllArticles(),
    getCurrentAdminUser(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Create Decision Tree"
        description="Build an interactive, click-through decision flow for agents."
        actions={
          <Link
            href="/admin/decision-trees"
            className="rounded-xl border px-6 py-3 font-semibold hover:bg-gray-50"
          >
            ← Back to Decision Trees
          </Link>
        }
      />

      <DecisionTreeForm
        articles={articles.map((a) => ({ id: a.id, title: a.title }))}
        defaultAuthor={currentUser?.name ?? ""}
      />
    </div>
  );
}
