"use client";

import { Plus, Trash2 } from "lucide-react";

export interface DispositionInput {
  id: number;
  code: string;
  content: string;
}

interface Props {
  items: DispositionInput[];
  onChange: (items: DispositionInput[]) => void;
}

export default function DispositionSection({ items, onChange }: Props) {

  function addItem() {
    onChange([...items, { id: Date.now(), code: "", content: "" }]);
  }

  function removeItem(id: number) {
    onChange(items.filter(item => item.id !== id));
  }

  function updateItem(id: number, field: keyof DispositionInput, value: string) {
    onChange(
      items.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Disposition
        </h2>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white"
        >
          <Plus size={18}/>
          Add Disposition
        </button>

      </div>

      <div className="space-y-6">

        {items.map((item,index)=>(

          <div
            key={item.id}
            className="rounded-2xl border p-6"
          >

            <div className="mb-4 flex items-center justify-between">

              <h3 className="font-semibold">
                Disposition {index+1}
              </h3>

              {items.length>1&&(

                <button
                  type="button"
                  onClick={()=>removeItem(item.id)}
                >
                  <Trash2 className="text-red-700"/>
                </button>

              )}

            </div>

            <input
              value={item.code}
              onChange={(e) => updateItem(item.id, "code", e.target.value)}
              placeholder="Disposition Code (Optional)"
              className="mb-4 w-full rounded-xl border p-3"
            />

            <textarea
              rows={4}
              value={item.content}
              onChange={(e) => updateItem(item.id, "content", e.target.value)}
              placeholder="Disposition description..."
              className="w-full rounded-xl border p-4"
            />

          </div>

        ))}

      </div>

    </section>
  );

}
