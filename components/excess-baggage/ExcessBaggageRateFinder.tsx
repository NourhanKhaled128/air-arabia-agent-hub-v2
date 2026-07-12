"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { matchesAllWords } from "@/lib/search-utils";

export interface ExcessBaggageRateRow {
  id: number;
  hub: string;
  section: string;
  region: string | null;
  destination: string;
  rate: string;
}

interface Props {
  rates: ExcessBaggageRateRow[];
  /** Locks the finder to one hub and hides the hub tabs — used when embedding in a hub-specific context. */
  defaultHub?: string;
  compact?: boolean;
}

const HUB_ORDER = ["G9", "3O", "9P", "E5"];

export default function ExcessBaggageRateFinder({ rates, defaultHub, compact = false }: Props) {
  const availableHubs = HUB_ORDER.filter((h) => rates.some((r) => r.hub === h));
  const [hub, setHub] = useState(defaultHub ?? availableHubs[0] ?? "");
  const [section, setSection] = useState<string>("all");
  const [query, setQuery] = useState("");

  const hubRates = useMemo(() => rates.filter((r) => r.hub === hub), [rates, hub]);

  const sections = useMemo(() => {
    const seen: string[] = [];
    for (const r of hubRates) {
      if (!seen.includes(r.section)) seen.push(r.section);
    }
    return seen;
  }, [hubRates]);

  useEffect(() => {
    setSection("all");
  }, [hub]);

  const filtered = useMemo(() => {
    let rows = hubRates;
    if (section !== "all") rows = rows.filter((r) => r.section === section);
    if (query.trim()) {
      rows = rows.filter((r) => matchesAllWords([r.region ?? "", r.destination, r.section], query));
    }
    return rows;
  }, [hubRates, section, query]);

  if (availableHubs.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-slate-400">
        No excess baggage rates have been uploaded yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {!defaultHub && (
        <div className="flex flex-wrap gap-2">
          {availableHubs.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHub(h)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                h === hub
                  ? "bg-red-700 text-white"
                  : "bg-gray-100 dark:bg-background text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-surface-muted"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      )}

      {sections.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSection("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              section === "all"
                ? "bg-gray-800 dark:bg-slate-200 text-white dark:text-background"
                : "border border-gray-200 dark:border-border-subtle text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
            }`}
          >
            All
          </button>
          {sections.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                s === section
                  ? "bg-gray-800 dark:bg-slate-200 text-white dark:text-background"
                  : "border border-gray-200 dark:border-border-subtle text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search from/to — e.g. Sharjah, Turkey, Amman, direct…"
          className="w-full rounded-xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-slate-100 outline-none focus:border-red-400"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-border-subtle">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-border-subtle bg-gray-50 dark:bg-background text-gray-500 dark:text-slate-400">
              {filtered.some((r) => r.region) && <th className="px-4 py-2.5 font-semibold">Region</th>}
              <th className="px-4 py-2.5 font-semibold">Destination</th>
              <th className="px-4 py-2.5 font-semibold">Section</th>
              <th className="px-4 py-2.5 font-semibold">Rate</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400 dark:text-slate-500">
                  No matching rates{query ? ` for "${query}"` : ""}.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-border-subtle last:border-0">
                  {filtered.some((row) => row.region) && (
                    <td className="px-4 py-2.5 text-gray-500 dark:text-slate-400">{r.region ?? ""}</td>
                  )}
                  <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-slate-100">{r.destination}</td>
                  <td className="px-4 py-2.5 text-gray-500 dark:text-slate-400">{r.section}</td>
                  <td className="px-4 py-2.5 whitespace-pre-line text-gray-800 dark:text-slate-200">{r.rate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!compact && (
        <p className="text-xs text-gray-400 dark:text-slate-500">
          {filtered.length} of {hubRates.length} rates shown for {hub}.
        </p>
      )}
    </div>
  );
}
