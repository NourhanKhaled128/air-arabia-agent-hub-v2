import PageHeader from "@/components/PageHeader";
import DecisionTreeLibrary from "@/components/decision-tree/DecisionTreeLibrary";
import { getAllDecisionTrees } from "@/lib/decision-tree-service";

const TOPIC = "Customer Support Team";

export default async function CustomerSupportTeamDecisionTreesPage() {
  const allTrees = await getAllDecisionTrees();
  const trees = allTrees.filter((t) => t.status === "Published" && t.topic === TOPIC);

  return (
    <>
      <PageHeader
        title="Decision Trees"
        subtitle="Click through a question at a time to reach the right resolution."
      />

      <DecisionTreeLibrary trees={trees} basePath="/CustomerSupportTeam/decision-trees" />
    </>
  );
}
