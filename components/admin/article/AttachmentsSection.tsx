"use client";

import { Paperclip, Trash2, Upload } from "lucide-react";

export interface AttachmentInput {
  id: number;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
}

interface Props {
  items: AttachmentInput[];
  onChange: (items: AttachmentInput[]) => void;
}

export default function AttachmentsSection({ items, onChange }: Props) {

  async function handleFiles(files: FileList) {
    const uploaded: AttachmentInput[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        uploaded.push({
          id: Date.now() + Math.random(),
          fileName: result.fileName,
          url: result.url,
          mimeType: result.mimeType,
          size: result.size,
        });
      }
    }

    onChange([...items, ...uploaded]);
  }

  function removeAttachment(id: number) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <Paperclip className="text-red-700" />

        <h2 className="text-2xl font-bold">
          Attachments
        </h2>

      </div>

      <p className="mb-6 text-gray-500">
        Upload supporting documents for champions.
      </p>

      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 p-8 hover:border-red-700">

        <Upload />

        Upload Files

        <input
          hidden
          multiple
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
          }}
        />

      </label>

      <div className="mt-6 rounded-xl bg-gray-50 p-5">

        {items.length === 0 ? (
          <p className="text-gray-500">
            Uploaded files will appear here.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-red-700 hover:underline"
                >
                  {item.fileName}
                </a>

                <button
                  type="button"
                  onClick={() => removeAttachment(item.id)}
                >
                  <Trash2 size={16} className="text-red-700" />
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>

    </section>
  );
}
