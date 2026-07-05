"use client";

import { Paperclip, Upload } from "lucide-react";

export default function AttachmentsSection() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <Paperclip className="text-red-700" />

        <h2 className="text-2xl font-bold">
          Attachments
        </h2>

      </div>

      <p className="mb-6 text-gray-500">
        Upload supporting documents for agents.
      </p>

      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 p-8 hover:border-red-700">

        <Upload />

        Upload Files

        <input
          hidden
          multiple
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        />

      </label>

      <div className="mt-6 rounded-xl bg-gray-50 p-5">

        <p className="text-gray-500">
          Uploaded files will appear here.
        </p>

      </div>

    </section>
  );
}