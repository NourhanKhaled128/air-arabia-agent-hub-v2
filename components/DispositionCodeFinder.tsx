"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import CopyButton from "@/components/CopyButton";

interface DispositionCode {
  code: string;
  label: string;
  description: string | null;
}

interface Props {
  dispositions: DispositionCode[];
}

export default function DispositionCodeFinder({ dispositions }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return dispositions;

    return dispositions.filter(
      (d) =>
        d.code.toLowerCase().includes(q) ||
        d.label.toLowerCase().includes(q) ||
        (d.description ?? "").toLowerCase().includes(q)
    );
  }, [query, dispositions]);

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3">
        <Search size={18} className="text-gray-500" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by code or label..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Label</th>
              <th className="px-6 py-4">Description</th>
            </tr>
          </thead>

          <tbody>
            {results.map((d) => (
              <tr key={d.code} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                      {d.code}
                    </span>
                    <CopyButton text={d.code} compact />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{d.label}</td>
                <td className="px-6 py-4 text-gray-600">{d.description ?? "-"}</td>
              </tr>
            ))}

            {results.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                  No disposition codes match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
