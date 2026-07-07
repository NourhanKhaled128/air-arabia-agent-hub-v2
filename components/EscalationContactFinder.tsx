"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

interface EscalationContact {
  id: number;
  issueType: string;
  escalateTo: string;
  contactInfo: string;
  notes: string | null;
}

interface Props {
  escalations: EscalationContact[];
}

export default function EscalationContactFinder({ escalations }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return escalations;

    return escalations.filter(
      (e) =>
        e.issueType.toLowerCase().includes(q) ||
        e.escalateTo.toLowerCase().includes(q) ||
        e.contactInfo.toLowerCase().includes(q)
    );
  }, [query, escalations]);

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3">
        <Search size={18} className="text-gray-500" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by issue type or contact..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-4">Issue Type</th>
              <th className="px-6 py-4">Escalate To</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Notes</th>
            </tr>
          </thead>

          <tbody>
            {results.map((e) => (
              <tr key={e.id} className="border-t border-gray-100">
                <td className="px-6 py-4">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                    {e.issueType}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{e.escalateTo}</td>
                <td className="px-6 py-4 text-gray-600">{e.contactInfo}</td>
                <td className="px-6 py-4 text-gray-600">{e.notes ?? "-"}</td>
              </tr>
            ))}

            {results.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  No escalation contacts match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
