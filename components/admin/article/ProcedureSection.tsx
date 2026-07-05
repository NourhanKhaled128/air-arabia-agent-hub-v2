"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProcedureSection() {

  const [steps, setSteps] = useState([
    {
      id: 1,
    },
  ]);

  function addStep() {
    setSteps([
      ...steps,
      {
        id: Date.now(),
      },
    ]);
  }

  function removeStep(id: number) {
    setSteps(steps.filter(step => step.id !== id));
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

        {steps.map((step, index) => (

          <div
            key={step.id}
            className="rounded-2xl border border-gray-300 p-6"
          >

            <div className="mb-5 flex items-center justify-between">

              <h3 className="text-xl font-semibold">

                Step {index + 1}

              </h3>

              {steps.length > 1 && (

                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                >

                  <Trash2 className="text-red-700" />

                </button>

              )}

            </div>

            <input
              placeholder="Step title..."
              className="mb-5 w-full rounded-xl border border-gray-300 p-3"
            />

            <textarea
              rows={6}
              placeholder="Describe the procedure..."
              className="w-full rounded-xl border border-gray-300 p-4"
            />

            <div className="mt-5">

              <label className="mb-2 block font-semibold">

                Step Image

              </label>

              <input
                type="file"
                accept="image/*"
              />

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}