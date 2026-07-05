"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ReferencesSection() {

  const [references, setReferences] = useState([
    { id: 1 }
  ]);

  function addReference() {
    setReferences([...references, { id: Date.now() }]);
  }

  function removeReference(id: number) {
    setReferences(references.filter(ref => ref.id !== id));
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

        {references.map((reference, index) => (

          <div
            key={reference.id}
            className="rounded-2xl border p-6"
          >

            <div className="mb-5 flex items-center justify-between">

              <h3 className="font-semibold">

                Reference {index + 1}

              </h3>

              {references.length > 1 && (

                <button
                  type="button"
                  onClick={() => removeReference(reference.id)}
                >

                  <Trash2 className="text-red-700" />

                </button>

              )}

            </div>

            <input
              placeholder="Reference Title"
              className="mb-4 w-full rounded-xl border p-3"
            />

            <select
              className="mb-4 w-full rounded-xl border p-3"
            >

              <option>Internal SOP</option>
              <option>PDF</option>
              <option>Website</option>
              <option>Document</option>

            </select>

            <input
              placeholder="Link (optional)"
              className="w-full rounded-xl border p-3"
            />

          </div>

        ))}

      </div>

    </section>

  );

}