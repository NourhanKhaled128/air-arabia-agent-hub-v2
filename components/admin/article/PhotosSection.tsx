"use client";

import { ImageIcon, Trash2, Upload } from "lucide-react";

export interface PhotoInput {
  id: number;
  url: string;
}

interface Props {
  items: PhotoInput[];
  onChange: (items: PhotoInput[]) => void;
}

export default function PhotosSection({ items, onChange }: Props) {

  async function handleFiles(files: FileList) {
    const uploaded: PhotoInput[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        uploaded.push({ id: Date.now() + Math.random(), url: result.url });
      }
    }

    onChange([...items, ...uploaded]);
  }

  function removePhoto(id: number) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <ImageIcon className="text-red-700" />

        <h2 className="text-2xl font-bold">
          Photos
        </h2>

      </div>

      <p className="mb-6 text-gray-500">
        Upload photos for the article gallery.
      </p>

      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 p-8 hover:border-red-700">

        <Upload />

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

      {items.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <img
                src={item.url}
                alt=""
                className="h-28 w-full rounded-xl border object-cover"
              />

              <button
                type="button"
                onClick={() => removePhoto(item.id)}
                className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-red-700 shadow"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
