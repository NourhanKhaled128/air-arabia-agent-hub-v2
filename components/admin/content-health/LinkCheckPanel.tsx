"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { checkLinksAction } from "@/app/admin/actions/content-health-actions";
import type { LinkCheckResult } from "@/lib/link-check-service";

export default function LinkCheckPanel() {
  const [results, setResults] = useState<LinkCheckResult[] | null>(null);
  const [isPending, startTransition] = useTransition();

  function runCheck() {
    startTransition(async () => {
      const data = await checkLinksAction();
      setResults(data);
    });
  }

  const flagged = (results ?? []).filter((r) => r.status !== "ok");

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Broken Links{results !== null ? ` (${flagged.length})` : ""}
        </h2>

        <button
          onClick={runCheck}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
        >
          <RefreshCw size={16} className={isPending ? "animate-spin" : ""} />
          {isPending ? "Checking…" : "Check Links"}
        </button>
      </div>

      {results === null ? (
        <p className="text-slate-500">
          Not checked yet — click &ldquo;Check Links&rdquo; to scan article bodies,
          references, and Important Links for dead URLs. This makes live outbound
          requests, so it only runs when you click it.
        </p>
      ) : flagged.length === 0 ? (
        <p className="text-slate-500">
          None — all {results.length} unique links checked out OK.
        </p>
      ) : (
        <ul className="space-y-2">
          {flagged.map((r, index) => (
            <li
              key={`${r.url}-${index}`}
              className={`rounded-xl border px-4 py-3 ${
                r.status === "broken"
                  ? "border-red-200 bg-red-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <p
                className={`font-medium ${
                  r.status === "broken" ? "text-red-800" : "text-amber-800"
                }`}
              >
                {r.status === "broken" ? "Broken" : "Slow"} — {r.url}
              </p>
              <p
                className={`text-sm ${
                  r.status === "broken" ? "text-red-600" : "text-amber-600"
                }`}
              >
                {r.source}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
