"use client";

import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";

export default function SeoSettings() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        SEO Settings
      </h2>

      <div className="space-y-6">

        <AdminInput
          label="SEO Title"
          placeholder="SEO title..."
        />

        <AdminTextarea
          label="SEO Description"
          placeholder="SEO description..."
        />

        <AdminInput
          label="Keywords"
          placeholder="refund,baggage,reservation"
        />

      </div>

    </div>
  );
}