"use client";

import { Plus, Trash2 } from "lucide-react";

export interface ChatTemplateInput {
  id: number;
  title: string;
  content: string;
}

interface Props {
  items: ChatTemplateInput[];
  onChange: (items: ChatTemplateInput[]) => void;
}

export default function ChatTemplatesSection({ items, onChange }: Props) {

  function addItem() {
    onChange([...items, { id: Date.now(), title: "", content: "" }]);
  }

  function removeItem(id: number) {
    onChange(items.filter(item => item.id !== id));
  }

  function updateItem(id: number, field: keyof ChatTemplateInput, value: string) {
    onChange(
      items.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Chat Templates
        </h2>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white"
        >
          <Plus size={18} />
          Add Chat Template
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
                Chat Template {index + 1}
              </h3>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="text-red-700" />
              </button>

            </div>

            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(item.id, "title", e.target.value)}
              placeholder="Template title, e.g. Refund delay apology"
              className="mb-4 w-full rounded-xl border p-4"
            />

            <textarea
              rows={4}
              value={item.content}
              onChange={(e) => updateItem(item.id, "content", e.target.value)}
              placeholder="Message the agent can paste into chat..."
              className="w-full rounded-xl border p-4"
            />

          </div>

        ))}

      </div>

    </section>
  );

}
