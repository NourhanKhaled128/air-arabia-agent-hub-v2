"use client";

import { Plus, Trash2, ImageIcon } from "lucide-react";
import { uploadFile, pastedImageFile } from "@/lib/upload-client";

export interface ProcedureStepInput {
  id: number;
  title: string;
  content: string;
  image: string;
}

interface Props {
  items: ProcedureStepInput[];
  onChange: (items: ProcedureStepInput[]) => void;
}

export default function ProcedureSection({ items, onChange }: Props) {

  function addStep() {
    onChange([
      ...items,
      { id: Date.now(), title: "", content: "", image: "" },
    ]);
  }

  function removeStep(id: number) {
    onChange(items.filter((step) => step.id !== id));
  }

  function updateStep(id: number, field: keyof ProcedureStepInput, value: string) {
    onChange(
      items.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      )
    );
  }

  async function uploadImage(id: number, file: File) {
    const url = await uploadFile(file);
    if (url) updateStep(id, "image", url);
  }

  async function handlePaste(id: number, e: React.ClipboardEvent) {
    const file = pastedImageFile(e);
    if (file) {
      e.preventDefault();
      await uploadImage(id, file);
    }
  }

  return (

    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Procedure

        </h2>

        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white"
        >

          <Plus size={18} />

          Add Step

        </button>

      </div>

      <div className="space-y-8">

        {items.map((step, index) => (

          <div
            key={step.id}
            className="rounded-2xl border border-gray-300 p-6"
          >

            <div className="mb-5 flex items-center justify-between">

              <h3 className="text-xl font-semibold">

                Step {index + 1}

              </h3>

              {items.length > 1 && (

                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                >

                  <Trash2 className="text-red-700" />

                </button>

              )}

            </div>

            <input
              value={step.title}
              onChange={(e) => updateStep(step.id, "title", e.target.value)}
              placeholder="Step title..."
              className="mb-5 w-full rounded-xl border border-gray-300 p-3"
            />

            <textarea
              rows={6}
              value={step.content}
              onChange={(e) => updateStep(step.id, "content", e.target.value)}
              onPaste={(e) => handlePaste(step.id, e)}
              placeholder="Describe the procedure... (paste a screenshot directly to attach it)"
              className="w-full rounded-xl border border-gray-300 p-4"
            />

            <div className="mt-5">

              <label className="mb-2 flex items-center gap-2 font-semibold">
                <ImageIcon size={16} className="text-red-700" />
                Step Image
              </label>

              <p className="mb-2 text-sm text-gray-500">
                Paste a screenshot into the text above, or choose a file:
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(step.id, file);
                }}
              />

              {step.image && (
                <img
                  src={step.image}
                  alt=""
                  className="mt-3 h-32 rounded-xl border object-cover"
                />
              )}

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}
