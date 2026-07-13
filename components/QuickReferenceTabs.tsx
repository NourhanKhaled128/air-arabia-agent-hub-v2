"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import type { QuickReferenceHub } from "@/lib/quick-reference-data";

interface Props {
  hubs: QuickReferenceHub[];
}

export default function QuickReferenceTabs({ hubs }: Props) {
  const [active, setActive] = useState(0);
  const hub = hubs[active];

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-wrap gap-2 print:hidden">
        {hubs.map((h, i) => (
          <button
            key={h.hub}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2 font-semibold transition ${
              i === active ? h.color : "bg-gray-100 text-gray-500 dark:bg-background dark:text-slate-400 hover:bg-gray-200"
            }`}
          >
            {h.hub}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm print:border-0 print:shadow-none">
        <h2 className={`mb-6 inline-block rounded-full px-4 py-1.5 text-lg font-bold ${hub.color}`}>
          {hub.hub}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {hub.facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-start justify-between gap-3 rounded-2xl border border-gray-100 dark:border-border-subtle p-4"
            >
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">{fact.label}</p>
                <p className="mt-1 font-medium text-gray-900 dark:text-slate-100">{fact.value}</p>
              </div>
              <CopyButton text={`${fact.label}: ${fact.value}`} compact />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
