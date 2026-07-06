"use client";

import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";

export default function CategoryForm() {
  return (
    <div className="space-y-6">

      <AdminInput
        label="Category Name"
        placeholder="Reservations"
      />

      <AdminTextarea
        label="Description"
        placeholder="Category description..."
      />

      <button className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
        Save Category
      </button>

    </div>
  );
}