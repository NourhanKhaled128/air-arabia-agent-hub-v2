"use client";

import { Plus, Trash2 } from "lucide-react";
import InlineImagesUploader from "./InlineImagesUploader";

export interface ScenarioInput {
  id: number;
  situation: string;
  response: string;
  images: string[];
}

interface Props {
  items: ScenarioInput[];
  onChange: (items: ScenarioInput[]) => void;
}

export default function ScenarioSection({ items, onChange }: Props) {

  function addItem() {
    onChange([...items, { id: Date.now(), situation: "", response: "", images: [] }]);
  }

  function removeItem(id: number) {
    onChange(items.filter(item => item.id !== id));
  }

  function updateItem(id: number, field: keyof ScenarioInput, value: string) {
    onChange(
      items.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function updateItemImages(id: number, images: string[]) {
    onChange(
      items.map(item => (item.id === id ? { ...item, images } : item))
    );
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Scenarios
        </h2>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white"
        >
          <Plus size={18} />
          Add Scenario
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
                Scenario {index + 1}
              </h3>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="text-red-700" />
                </button>
              )}

            </div>

            <textarea
              rows={3}
              value={item.situation}
              onChange={(e) => updateItem(item.id, "situation", e.target.value)}
              placeholder="Example situation the champion might encounter..."
              className="mb-4 w-full rounded-xl border p-4"
            />

            <textarea
              rows={4}
              value={item.response}
              onChange={(e) => updateItem(item.id, "response", e.target.value)}
              placeholder="How to handle it..."
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
