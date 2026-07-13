"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { saveQuickReferenceHubsAction } from "@/app/admin/actions/quick-reference-actions";
import type { QuickReferenceHub } from "@/lib/quick-reference-data";

interface Props {
  hubs: QuickReferenceHub[];
}

const COLOR_OPTIONS = [
  { label: "Gray (General)", value: "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300" },
  { label: "Red (G9)", value: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" },
  { label: "Blue (3O)", value: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" },
  { label: "Emerald (9P)", value: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
  { label: "Amber (E5)", value: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
  { label: "Purple (3L)", value: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" },
];

let nextKey = 0;

type FactRow = { key: number; label: string; value: string };
type HubRow = { key: number; hub: string; color: string; facts: FactRow[] };

function toHubRows(hubs: QuickReferenceHub[]): HubRow[] {
  return hubs.map((h) => ({
    key: nextKey++,
    hub: h.hub,
    color: h.color,
    facts: h.facts.map((f) => ({ key: nextKey++, ...f })),
  }));
}

export default function QuickReferenceManager({ hubs }: Props) {
  const [rows, setRows] = useState(() => toHubRows(hubs));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function updateHub(key: number, field: "hub" | "color", value: string) {
    setSaved(false);
    setRows((prev) => prev.map((h) => (h.key === key ? { ...h, [field]: value } : h)));
  }

  function addHub() {
    setSaved(false);
    setRows((prev) => [...prev, { key: nextKey++, hub: "New Hub", color: COLOR_OPTIONS[0].value, facts: [] }]);
  }

  function removeHub(key: number) {
    setSaved(false);
    setRows((prev) => prev.filter((h) => h.key !== key));
  }

  function updateFact(hubKey: number, factKey: number, field: "label" | "value", value: string) {
    setSaved(false);
    setRows((prev) =>
      prev.map((h) =>
        h.key === hubKey
          ? { ...h, facts: h.facts.map((f) => (f.key === factKey ? { ...f, [field]: value } : f)) }
          : h
      )
    );
  }

  function addFact(hubKey: number) {
    setSaved(false);
    setRows((prev) =>
      prev.map((h) => (h.key === hubKey ? { ...h, facts: [...h.facts, { key: nextKey++, label: "", value: "" }] } : h))
    );
  }

  function removeFact(hubKey: number, factKey: number) {
    setSaved(false);
    setRows((prev) =>
      prev.map((h) => (h.key === hubKey ? { ...h, facts: h.facts.filter((f) => f.key !== factKey) } : h))
    );
  }

  function save() {
    const cleaned: QuickReferenceHub[] = rows
      .map((h) => ({
        hub: h.hub.trim(),
        color: h.color,
        facts: h.facts.map((f) => ({ label: f.label.trim(), value: f.value.trim() })).filter((f) => f.label && f.value),
      }))
      .filter((h) => h.hub);

    startTransition(async () => {
      await saveQuickReferenceHubsAction(cleaned);
      setSaved(true);
    });
  }

  return (
    <div className="space-y-6">
      {rows.map((h) => (
        <div key={h.key} className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-6 grid gap-3 md:grid-cols-[2fr_2fr_auto]">
            <input
              value={h.hub}
              onChange={(e) => updateHub(h.key, "hub", e.target.value)}
              placeholder="Hub name (e.g. G9 (Sharjah / RAK))"
              className="rounded-xl border border-slate-300 px-3 py-2 text-lg font-bold outline-none focus:border-red-600"
            />
            <select
              value={h.color}
              onChange={(e) => updateHub(h.key, "color", e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-red-600"
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <button
              onClick={() => removeHub(h.key)}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} />
              Remove hub
            </button>
          </div>

          <div className="space-y-3">
            {h.facts.map((f) => (
              <div key={f.key} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
                <input
                  value={f.label}
                  onChange={(e) => updateFact(h.key, f.key, "label", e.target.value)}
                  placeholder="Label (e.g. Bundle Ultimate)"
                  className="rounded-xl border border-slate-300 px-3 py-2 font-semibold outline-none focus:border-red-600"
                />
                <input
                  value={f.value}
                  onChange={(e) => updateFact(h.key, f.key, "value", e.target.value)}
                  placeholder="Value"
                  className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-red-600"
                />
                <button
                  onClick={() => removeFact(h.key, f.key)}
                  className="flex items-center justify-center rounded-xl border border-red-200 px-3 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => addFact(h.key)}
            className="mt-4 flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Plus size={16} />
            Add fact
          </button>
        </div>
      ))}

      <button
        onClick={addHub}
        className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
      >
        <Plus size={18} />
        Add hub
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
        >
          <Save size={18} />
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        {saved && <span className="font-semibold text-emerald-700">Saved — live on the Champion Quick Reference page.</span>}
      </div>
    </div>
  );
}
