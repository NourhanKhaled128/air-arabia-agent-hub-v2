"use client";

import { UploadCloud } from "lucide-react";

export default function MediaUploader() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-16 text-center">

      <UploadCloud
        size={70}
        className="mx-auto text-red-700"
      />

      <h2 className="mt-6 text-2xl font-bold">
        Upload Files
      </h2>

      <p className="mt-3 text-slate-500">
        Drag & Drop files here or click to browse.
      </p>

      <button className="mt-8 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
        Browse Files
      </button>

    </div>
  );
}