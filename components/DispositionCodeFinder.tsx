"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import CopyButton from "@/components/CopyButton";

interface DispositionCode {
  code: string;
  label: string;
  description: string | null;
  category: string | null;
}

interface Props {
  dispositions: DispositionCode[];
}

const OTHER_GROUP = "Other";

export default function DispositionCodeFinder({ dispositions }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return dispositions;

    return dispositions.filter(
      (d) =>
        d.code.toLowerCase().includes(q) ||
        d.label.toLowerCase().includes(q) ||
        (d.category ?? "").toLowerCase().includes(q) ||
        (d.description ?? "").toLowerCase().includes(q)
    );
  }, [query, dispositions]);

  const groups = useMemo(() => {
    const map = new Map<string, DispositionCode[]>();

    for (const d of results) {
      const key = d.category ?? OTHER_GROUP;
      const bucket = map.get(key);
      if (bucket) bucket.push(d);
      else map.set(key, [d]);
    }

    return Array.from(map.entries()).sort(([a], [b]) => {
      if (a === OTHER_GROUP) return 1;
      if (b === OTHER_GROUP) return -1;
      return a.localeCompare(b);
    });
  }, [results]);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  function toggleGroup(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3">
        <Search size={18} className="text-gray-500" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by type, subtype or scenario..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto">

        {groups.map(([category, items]) => {
          const isCollapsed = collapsed.has(category);

          return (
            <div
              key={category}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleGroup(category)}
                className="flex w-full items-center justify-between gap-3 bg-gray-50 px-6 py-4 text-left"
              >
                <span className="font-bold text-gray-900">
                  {category}
                  <span className="ml-2 font-normal text-gray-500">({items.length})</span>
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
                />
              </button>

              {!isCollapsed && (
                <table className="w-full">
                  <thead className="border-t border-gray-100 bg-gray-50/50">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-6 py-3">Subtype</th>
                      <th className="px-6 py-3">Call Scenario</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((d) => (
                      <tr key={`${category}-${d.code}-${d.label}`} className="border-t border-gray-100">
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                            {d.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{d.description ?? "-"}</td>
                        <td className="px-6 py-4 text-right">
                          <CopyButton text={`${d.label}: ${d.description ?? ""}`} compact />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}

        {groups.length === 0 && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center text-gray-500 shadow-sm">
            No disposition codes match your search.
          </div>
        )}

      </div>

    </div>
  );
}
