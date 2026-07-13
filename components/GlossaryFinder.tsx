"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { matchesAllWords } from "@/lib/search-utils";

export interface GlossaryEntry {
  term: string;
  definition: string;
  category: string;
}

interface Props {
  entries: GlossaryEntry[];
}

export default function GlossaryFinder({ entries }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    return entries.filter((e) => matchesAllWords([e.term, e.definition, e.category], query));
  }, [entries, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, GlossaryEntry[]> = {};
    for (const entry of filtered) {
      groups[entry.category] = groups[entry.category] || [];
      groups[entry.category].push(entry);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search acronyms and terms…"
          className="w-full rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface py-3.5 pl-11 pr-4 text-gray-900 dark:text-slate-100 shadow-sm outline-none focus:border-red-400"
        />
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-200">
            No terms match &quot;{query}&quot;.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-4 text-xl font-bold text-gray-500 dark:text-slate-400">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((entry) => (
                <div
                  key={entry.term}
                  className="rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-5 shadow-sm"
                >
                  <p className="font-bold text-gray-900 dark:text-slate-100">{entry.term}</p>
                  <p className="mt-1 text-gray-600 dark:text-slate-400">{entry.definition}</p>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
