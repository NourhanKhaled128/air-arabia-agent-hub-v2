"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { createMediaFileAction } from "@/app/admin/actions/media-actions";

export default function MediaUploadForm() {
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList) {
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          await createMediaFileAction({
            name: result.fileName,
            url: result.url,
            mimeType: result.mimeType,
            size: result.size,
          });
        }
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-300 bg-white p-16 text-center hover:border-red-700">

      <UploadCloud size={70} className="text-red-700" />

      <h2 className="text-2xl font-bold">
        {uploading ? "Uploading..." : "Upload Files"}
      </h2>

      <p className="text-slate-500">
        Drag & Drop files here or click to browse.
      </p>

      <input
        hidden
        multiple
        type="file"
        disabled={uploading}
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFiles(e.target.files);
          }
        }}
      />

    </label>
  );
}
