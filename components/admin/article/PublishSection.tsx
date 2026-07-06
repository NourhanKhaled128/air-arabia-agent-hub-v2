"use client";

import {
  Eye,
  Save,
  Send,
} from "lucide-react";

export default function PublishSection() {
  return (
    <section className="sticky bottom-5 rounded-3xl bg-white p-8 shadow-xl">

      <div className="flex flex-wrap items-center justify-between gap-5">

        <div>

          <h2 className="text-2xl font-bold">
            Publish
          </h2>

          <p className="text-gray-500">
            Save your work or publish it for agents.
          </p>

        </div>

<div className="flex gap-4">

  <button
    type="button"
    className="rounded-xl border px-6 py-3"
  >
    Preview
  </button>

  <button
    type="submit"
    className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white"
  >
    Save Draft
  </button>

</div>

      </div>

    </section>
  );
}