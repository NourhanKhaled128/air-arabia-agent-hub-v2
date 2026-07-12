import { notFound } from "next/navigation";
import { getDecisionTreeById } from "@/lib/decision-tree-service";
import EditDecisionTreeForm from "@/components/admin/decision-tree/EditDecisionTreeForm";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { getAllArticles } from "@/lib/article-service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDecisionTreePage({ params }: Props) {
  const { id } = await params;
  const treeId = Number(id);

  const [tree, articles] = await Promise.all([
    getDecisionTreeById(treeId),
    getAllArticles(),
  ]);

  if (!tree) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Edit Decision Tree"
        description="Update the tree's questions, options and outcomes."
      />

      <EditDecisionTreeForm
        tree={tree}
        articles={articles.map((a) => ({ id: a.id, title: a.title }))}
      />
    </div>
  );
}
