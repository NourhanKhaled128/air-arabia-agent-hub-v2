import Link from "next/link";
import DecisionTreeForm from "@/components/admin/decision-tree/DecisionTreeForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAllArticles } from "@/lib/article-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";
import { getAllDecisionTreesForLinking } from "@/lib/decision-tree-service";

export default async function NewDecisionTreePage() {
  const [articles, currentUser, trees] = await Promise.all([
    getAllArticles(),
    getCurrentAdminUser(),
    getAllDecisionTreesForLinking(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Create Decision Tree"
        description="Build an interactive, click-through decision flow for champions."
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
        trees={trees}
        defaultAuthor={currentUser?.name ?? ""}
      />
    </div>
  );
}
