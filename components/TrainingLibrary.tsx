"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import { matchesAllWords } from "@/lib/search-utils";

export interface TrainingModuleSummary {
  id: number;
  slug: string;
  title: string;
  description: string;
  overview: string;
  category: string;
  updatedAt: Date;
}

interface Props {
  modules: TrainingModuleSummary[];
}

export default function TrainingLibrary({ modules }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return modules;

    return modules.filter((mod) =>
      matchesAllWords([mod.title, mod.description, mod.overview], query)
    );
  }, [modules, query]);

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
          placeholder="Search training modules…"
          className="w-full rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface py-3.5 pl-11 pr-4 text-gray-900 dark:text-slate-100 shadow-sm outline-none focus:border-red-400"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-200">
            No training modules match &quot;{query}&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((mod) => (
            <ArticleCard key={mod.id} article={mod} />
          ))}
        </div>
      )}
    </div>
  );
}
