import Link from "next/link";
import { getAllDecisionTrees } from "@/lib/decision-tree-service";
import DecisionTreeTable from "@/components/admin/decision-tree/DecisionTreeTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default async function DecisionTreesPage() {
  const trees = await getAllDecisionTrees();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Decision Trees"
        description="Interactive, click-through decision flows for agents."
        actions={
          <Link
            href="/admin/decision-trees/new"
            className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            + New Decision Tree
          </Link>
        }
      />

      <DecisionTreeTable trees={trees} />
    </div>
  );
}
