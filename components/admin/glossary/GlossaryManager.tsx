"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { saveGlossaryEntriesAction } from "@/app/admin/actions/glossary-actions";
import type { GlossaryEntry } from "@/components/GlossaryFinder";

interface Props {
  entries: GlossaryEntry[];
}

let nextKey = 0;

export default function GlossaryManager({ entries }: Props) {
  const [rows, setRows] = useState(entries.map((e) => ({ ...e, key: nextKey++ })));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function updateRow(key: number, field: keyof GlossaryEntry, value: string) {
    setSaved(false);
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setSaved(false);
    setRows((prev) => [...prev, { key: nextKey++, term: "", definition: "", category: "General" }]);
  }

  function removeRow(key: number) {
    setSaved(false);
    setRows((prev) => prev.filter((r) => r.key !== key));
  }

  function save() {
    const cleaned = rows
      .map(({ term, definition, category }) => ({ term: term.trim(), definition: definition.trim(), category: category.trim() || "General" }))
      .filter((r) => r.term && r.definition);

    startTransition(async () => {
      await saveGlossaryEntriesAction(cleaned);
      setSaved(true);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.key} className="grid gap-3 rounded-2xl border border-gray-200 p-4 md:grid-cols-[1fr_2fr_1fr_auto]">
              <input
                value={row.term}
                onChange={(e) => updateRow(row.key, "term", e.target.value)}
                placeholder="Term (e.g. PNR)"
                className="rounded-xl border border-slate-300 px-3 py-2 font-semibold outline-none focus:border-red-600"
              />
              <input
                value={row.definition}
                onChange={(e) => updateRow(row.key, "definition", e.target.value)}
                placeholder="Definition"
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-red-600"
              />
              <input
                value={row.category}
                onChange={(e) => updateRow(row.key, "category", e.target.value)}
                placeholder="Category (e.g. Booking)"
                className="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-red-600"
              />
              <button
                onClick={() => removeRow(row.key)}
                title="Remove"
                className="flex items-center justify-center rounded-xl border border-red-200 px-3 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addRow}
          className="mt-4 flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Plus size={18} />
          Add term
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
        >
          <Save size={18} />
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        {saved && <span className="font-semibold text-emerald-700">Saved — live on the Champion Glossary page.</span>}
      </div>
    </div>
  );
}
