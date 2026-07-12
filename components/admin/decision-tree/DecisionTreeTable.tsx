"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, Globe, GitBranch } from "lucide-react";

import {
  deleteDecisionTreeAction,
  deleteManyDecisionTreesAction,
  publishDecisionTreeAction,
  unpublishDecisionTreeAction,
} from "@/app/admin/actions/decision-tree-actions";
import AdminListTable from "@/components/admin/AdminListTable";

interface DecisionTree {
  id: number;
  title: string;
  topic: string | null;
  status: string;
  author: string;
  nodeCount: number;
  outcomeCount: number;
  updatedAt: Date;
}

interface Props {
  trees: DecisionTree[];
}

export default function DecisionTreeTable({ trees }: Props) {
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <AdminListTable
      columns={[
        { key: "title", label: "Decision Tree" },
        { key: "topic", label: "Topic" },
        { key: "status", label: "Status" },
        { key: "nodes", label: "Nodes / Outcomes" },
        { key: "updatedAt", label: "Updated" },
      ]}
      data={trees}
      searchPlaceholder="Search decision trees..."
      searchFn={(tree, query) => {
        const q = query.toLowerCase();
        return (
          tree.title.toLowerCase().includes(q) ||
          (tree.topic ?? "").toLowerCase().includes(q) ||
          tree.author.toLowerCase().includes(q)
        );
      }}
      filters={[
        {
          key: "status",
          label: "Status",
          options: [
            { value: "Published", label: "Published" },
            { value: "Draft", label: "Draft" },
          ],
        },
      ]}
      filterFn={(tree, values) => {
        if (values.status && tree.status !== values.status) return false;
        return true;
      }}
      onDeleteMany={deleteManyDecisionTreesAction}
      emptyMessage="No decision trees yet."
      renderRow={(tree) => (
        <>
          <td className="px-6 py-5 font-medium">
            <div className="flex items-center gap-2">
              <GitBranch size={16} className="text-gray-400" />
              {tree.title}
            </div>
          </td>

          <td className="px-6 py-5">{tree.topic ?? "—"}</td>

          <td className="px-6 py-5">
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                tree.status === "Published"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {tree.status}
            </span>
          </td>

          <td className="px-6 py-5">
            {tree.nodeCount} nodes / {tree.outcomeCount} outcomes
          </td>

          <td className="px-6 py-5">
            {new Date(tree.updatedAt).toLocaleDateString()}
          </td>

          <td className="px-6 py-5">
            <div className="flex justify-center gap-2">
              <Link
                href={`/admin/decision-trees/${tree.id}`}
                className="rounded-lg border p-2 hover:bg-slate-100"
              >
                <Pencil size={18} />
              </Link>

              <button
                disabled={isPending}
                onClick={() =>
                  run(() =>
                    tree.status === "Published"
                      ? unpublishDecisionTreeAction(tree.id)
                      : publishDecisionTreeAction(tree.id)
                  )
                }
                className="rounded-lg border p-2 hover:bg-green-50"
                title={tree.status === "Published" ? "Unpublish" : "Publish"}
              >
                <Globe size={18} />
              </button>

              <button
                disabled={isPending}
                onClick={() => {
                  if (confirm("Delete this decision tree permanently?")) {
                    run(() => deleteDecisionTreeAction(tree.id));
                  }
                }}
                className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </>
      )}
    />
  );
}
