import Link from "next/link";
import { GitBranch } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getAllDecisionTrees } from "@/lib/decision-tree-service";

export default async function DecisionTreesPage() {
  const allTrees = await getAllDecisionTrees();
  const trees = allTrees.filter((t) => t.status === "Published");

  const groups = new Map<string, typeof trees>();
  for (const tree of trees) {
    const key = tree.topic || "General";
    groups.set(key, [...(groups.get(key) ?? []), tree]);
  }

  return (
    <>
      <PageHeader
        title="Decision Trees"
        subtitle="Click through a question at a time to reach the right resolution."
      />

      {trees.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-200">
            No decision trees published yet.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Array.from(groups.entries()).map(([topic, topicTrees]) => (
            <section key={topic}>
              <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-slate-100">{topic}</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {topicTrees.map((tree) => (
                  <Link
                    key={tree.id}
                    href={`/decision-trees/${tree.slug}`}
                    className="rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm transition hover:border-red-300 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-red-100 dark:bg-brand/10 p-2 text-red-700 dark:text-brand">
                        <GitBranch size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                          {tree.title}
                        </h3>
                        {tree.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                            {tree.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                          {tree.nodeCount} nodes · {tree.outcomeCount} outcomes
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
