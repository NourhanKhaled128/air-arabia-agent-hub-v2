"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GitBranch, Search } from "lucide-react";
import { matchesAllWords } from "@/lib/search-utils";

export interface DecisionTreeSummary {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  topic: string | null;
  nodeCount: number;
  outcomeCount: number;
}

interface Props {
  trees: DecisionTreeSummary[];
}

export default function DecisionTreeLibrary({ trees }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return trees;

    return trees.filter((tree) =>
      matchesAllWords([tree.title, tree.description ?? "", tree.topic ?? ""], query)
    );
  }, [trees, query]);

  const groups = new Map<string, DecisionTreeSummary[]>();
  for (const tree of filtered) {
    const key = tree.topic || "General";
    groups.set(key, [...(groups.get(key) ?? []), tree]);
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search decision trees…"
          className="w-full rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface py-3.5 pl-11 pr-4 text-gray-900 dark:text-slate-100 shadow-sm outline-none focus:border-red-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-200">
            No decision trees match &quot;{query}&quot;.
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
    </div>
  );
}
