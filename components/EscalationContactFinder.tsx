"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import CopyButton from "@/components/CopyButton";

function contactLink(contactInfo: string): string | null {
  const trimmed = contactInfo.trim();

  if (trimmed.includes("@")) return `mailto:${trimmed}`;

  const digits = trimmed.replace(/[^\d+]/g, "");
  if (digits.replace(/\D/g, "").length >= 6) return `tel:${digits}`;

  return null;
}

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
  const [issueType, setIssueType] = useState("");

  const issueTypeOptions = useMemo(
    () => Array.from(new Set(escalations.map((e) => e.issueType))).sort(),
    [escalations]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return escalations.filter((e) => {
      if (issueType && e.issueType !== issueType) return false;

      if (!q) return true;

      return (
        e.issueType.toLowerCase().includes(q) ||
        e.escalateTo.toLowerCase().includes(q) ||
        e.contactInfo.toLowerCase().includes(q)
      );
    });
  }, [query, issueType, escalations]);

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-1 min-w-[220px] items-center gap-3 rounded-xl border border-gray-300 px-4 py-3">
          <Search size={18} className="text-gray-500" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by issue type or contact..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3"
        >
          <option value="">Issue Type: All</option>
          {issueTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="max-h-[70vh] overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50">
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
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    {contactLink(e.contactInfo) ? (
                      <a
                        href={contactLink(e.contactInfo)!}
                        className="font-medium text-red-700 hover:underline"
                      >
                        {e.contactInfo}
                      </a>
                    ) : (
                      <span>{e.contactInfo}</span>
                    )}
                    <CopyButton text={e.contactInfo} compact />
                  </div>
                </td>
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
