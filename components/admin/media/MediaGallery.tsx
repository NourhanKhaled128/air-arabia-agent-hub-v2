"use client";

import {
  Image,
  FileText,
  Download,
  Trash2,
  Eye,
} from "lucide-react";

const files = [
  {
    id: 1,
    name: "refund-policy.png",
    type: "Image",
    size: "1.4 MB",
  },
  {
    id: 2,
    name: "baggage.pdf",
    type: "PDF",
    size: "2.1 MB",
  },
  {
    id: 3,
    name: "airport-map.jpg",
    type: "Image",
    size: "3.4 MB",
  },
  {
    id: 4,
    name: "payment-flow.pdf",
    type: "PDF",
    size: "1.8 MB",
  },
];

export default function MediaGallery() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {files.map((file) => (

        <div
          key={file.id}
          className="rounded-3xl bg-white p-6 shadow-sm"
        >

          <div className="flex justify-center">

            {file.type === "Image" ? (
              <Image
                size={70}
                className="text-red-700"
              />
            ) : (
              <FileText
                size={70}
                className="text-blue-700"
              />
            )}

          </div>

          <h2 className="mt-6 truncate text-center font-semibold">
            {file.name}
          </h2>

          <p className="mt-2 text-center text-sm text-slate-500">
            {file.size}
          </p>

          <div className="mt-6 flex justify-center gap-2">

            <button className="rounded-xl border p-2 hover:bg-slate-50">
              <Eye size={18} />
            </button>

            <button className="rounded-xl border p-2 hover:bg-slate-50">
              <Download size={18} />
            </button>

            <button className="rounded-xl border p-2 hover:bg-red-50">
              <Trash2 size={18} />
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}