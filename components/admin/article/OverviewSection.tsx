"use client";

export default function OverviewSection() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">

        Overview

      </h2>

      <p className="mb-5 text-gray-500">

        This section will later become a Rich Text Editor.

      </p>

      <textarea
        rows={12}
        placeholder="Write article overview..."
        className="w-full rounded-xl border border-gray-300 p-4"
      />

    </section>
  );
}