"use client";

import { ImageIcon, Trash2, Upload } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export default function InlineImagesUploader({
  images,
  onChange,
  label = "Photos (optional)",
}: Props) {

  async function handleFiles(files: FileList) {
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        uploaded.push(result.url);
      }
    }

    onChange([...images, ...uploaded]);
  }

  function removeImage(url: string) {
    onChange(images.filter((image) => image !== url));
  }

  return (
    <div className="mt-5">

      <label className="mb-2 flex items-center gap-2 font-semibold">
        <ImageIcon size={16} className="text-red-700" />
        {label}
      </label>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-4 text-sm hover:border-red-700">
        <Upload size={16} />
        Upload Photos

        <input
          hidden
          multiple
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
          }}
        />
      </label>

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((url) => (
            <div key={url} className="group relative">
              <img
                src={url}
                alt=""
                className="h-20 w-full rounded-xl border object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-lg bg-white/90 p-1 text-red-700 shadow"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
