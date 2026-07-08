"use client";

import { Plus, Trash2 } from "lucide-react";
import InlineImagesUploader from "./InlineImagesUploader";

export interface ReferenceInput {
  id: number;
  title: string;
  type: string;
  link: string;
  images: string[];
}

interface Props {
  items: ReferenceInput[];
  onChange: (items: ReferenceInput[]) => void;
}

export default function ReferencesSection({ items, onChange }: Props) {

  function addReference() {
    onChange([
      ...items,
      { id: Date.now(), title: "", type: "Internal SOP", link: "", images: [] },
    ]);
  }

  function removeReference(id: number) {
    onChange(items.filter(ref => ref.id !== id));
  }

  function updateReference(id: number, field: keyof ReferenceInput, value: string) {
    onChange(
      items.map(ref => (ref.id === id ? { ...ref, [field]: value } : ref))
    );
  }

  function updateReferenceImages(id: number, images: string[]) {
    onChange(
      items.map(ref => (ref.id === id ? { ...ref, images } : ref))
    );
  }

  return (

    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          References

        </h2>

        <button
          type="button"
          onClick={addReference}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white"
        >

          <Plus size={18} />

          Add Reference

        </button>

      </div>

      <div className="space-y-6">

        {items.map((reference, index) => (

          <div
            key={reference.id}
            className="rounded-2xl border p-6"
          >

            <div className="mb-5 flex items-center justify-between">

              <h3 className="font-semibold">

                Reference {index + 1}

              </h3>

              {items.length > 1 && (

                <button
                  type="button"
                  onClick={() => removeReference(reference.id)}
                >

                  <Trash2 className="text-red-700" />

                </button>

              )}

            </div>

            <input
              value={reference.title}
              onChange={(e) => updateReference(reference.id, "title", e.target.value)}
              placeholder="Reference Title"
              className="mb-4 w-full rounded-xl border p-3"
            />

            <select
              value={reference.type}
              onChange={(e) => updateReference(reference.id, "type", e.target.value)}
              className="mb-4 w-full rounded-xl border p-3"
            >

              <option>Internal SOP</option>
              <option>PDF</option>
              <option>Website</option>
              <option>Document</option>

            </select>

            <input
              value={reference.link}
              onChange={(e) => updateReference(reference.id, "link", e.target.value)}
              placeholder="Link (optional)"
              className="w-full rounded-xl border p-3"
            />

            <InlineImagesUploader
              images={reference.images}
              onChange={(images) => updateReferenceImages(reference.id, images)}
            />

          </div>

        ))}

      </div>

    </section>

  );

}
