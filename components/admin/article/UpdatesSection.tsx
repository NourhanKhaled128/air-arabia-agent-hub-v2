"use client";

import { History, Plus, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";

export interface UpdateInput {
  id: number;
  title: string;
  content: string;
}

interface HistoryEntry {
  id: number;
  action: string;
  userName: string;
  createdAt: Date;
}

interface Props {
  items: UpdateInput[];
  onChange: (items: UpdateInput[]) => void;
  history?: HistoryEntry[];
}

export default function UpdatesSection({ items, onChange, history }: Props) {

  function addItem() {
    onChange([...items, { id: Date.now(), title: "", content: "" }]);
  }

  function removeItem(id: number) {
    onChange(items.filter((item) => item.id !== id));
  }

  function updateItem(id: number, field: keyof UpdateInput, value: string) {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <History className="text-red-700" />

          <h2 className="text-2xl font-bold">
            Updates
          </h2>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white"
        >
          <Plus size={18} />
          Add Update
        </button>

      </div>

      <div className="space-y-6">

        {items.map((item, index) => (

          <div
            key={item.id}
            className="rounded-2xl border p-6"
          >

            <div className="mb-4 flex items-center justify-between">

              <h3 className="font-semibold">
                Update {index + 1}
              </h3>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="text-red-700" />
              </button>

            </div>

            <input
              value={item.title}
              onChange={(e) => updateItem(item.id, "title", e.target.value)}
              placeholder="What changed..."
              className="mb-4 w-full rounded-xl border p-3"
            />

            <textarea
              rows={3}
              value={item.content}
              onChange={(e) => updateItem(item.id, "content", e.target.value)}
              placeholder="Details..."
              className="w-full rounded-xl border p-4"
            />

          </div>

        ))}

        {items.length === 0 && (
          <p className="text-gray-500">
            No update notes yet. Click &quot;Add Update&quot; to log a change.
          </p>
        )}

      </div>

      {history !== undefined && (
        <div className="mt-8 border-t pt-6">

          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-500">
            Automatic History
          </h3>

          {history.length === 0 && (
            <p className="text-gray-500">
              No automatic history recorded yet.
            </p>
          )}

          {history.length > 0 && (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-xl border p-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{entry.action}</p>
                    <p className="text-gray-500">by {entry.userName}</p>
                  </div>

                  <p className="text-gray-500">
                    {formatRelativeTime(entry.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </section>
  );
}
