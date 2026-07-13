"use client";

import { Plus, Trash2 } from "lucide-react";
import InlineImagesUploader from "./InlineImagesUploader";
import { uploadFile, pastedImageFile } from "@/lib/upload-client";

export interface DispositionInput {
  id: number;
  category: string;
  code: string;
  content: string;
  scenario: string;
  images: string[];
}

interface Props {
  items: DispositionInput[];
  onChange: (items: DispositionInput[]) => void;
  dispositionCodes?: { code: string; label: string; category?: string | null }[];
}

export default function DispositionSection({ items, onChange, dispositionCodes = [] }: Props) {
  const categoryOptions = Array.from(
    new Set(dispositionCodes.map((d) => d.category).filter((c): c is string => Boolean(c)))
  ).sort();

  function addItem() {
    onChange([...items, { id: Date.now(), category: "", code: "", content: "", scenario: "", images: [] }]);
  }

  function removeItem(id: number) {
    onChange(items.filter(item => item.id !== id));
  }

  function updateItem(id: number, field: keyof DispositionInput, value: string) {
    onChange(
      items.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function updateItemImages(id: number, images: string[]) {
    onChange(
      items.map(item => (item.id === id ? { ...item, images } : item))
    );
  }

  async function handlePaste(id: number, e: React.ClipboardEvent) {
    const file = pastedImageFile(e);
    if (!file) return;
    e.preventDefault();
    const url = await uploadFile(file);
    if (url) {
      const item = items.find((i) => i.id === id);
      if (item) updateItemImages(id, [...item.images, url]);
    }
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

            <div className="mb-4 grid gap-4 md:grid-cols-2">

              <input
                value={item.category}
                onChange={(e) => updateItem(item.id, "category", e.target.value)}
                placeholder="Main (Category) — e.g. Complaint, Baggage..."
                list={`disposition-categories-${item.id}`}
                className="w-full rounded-xl border p-3"
              />

              <input
                value={item.code}
                onChange={(e) => updateItem(item.id, "code", e.target.value)}
                placeholder="Sub (Code, optional)"
                list={`disposition-codes-${item.id}`}
                className="w-full rounded-xl border p-3"
              />

            </div>

            {categoryOptions.length > 0 && (
              <datalist id={`disposition-categories-${item.id}`}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            )}

            {dispositionCodes.length > 0 && (
              <datalist id={`disposition-codes-${item.id}`}>
                {dispositionCodes.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.label}
                  </option>
                ))}
              </datalist>
            )}

            <textarea
              rows={3}
              value={item.content}
              onChange={(e) => updateItem(item.id, "content", e.target.value)}
              onPaste={(e) => handlePaste(item.id, e)}
              placeholder="Descrip — when should champions use this? (paste a screenshot to attach it)"
              className="mb-4 w-full rounded-xl border p-4"
            />

            <textarea
              rows={3}
              value={item.scenario}
              onChange={(e) => updateItem(item.id, "scenario", e.target.value)}
              placeholder="Scenario — a concrete example call, e.g. 'A passenger asks...'"
              className="w-full rounded-xl border p-4"
            />

            <InlineImagesUploader
              images={item.images}
              onChange={(images) => updateItemImages(item.id, images)}
            />

          </div>

        ))}

      </div>

    </section>
  );

}
