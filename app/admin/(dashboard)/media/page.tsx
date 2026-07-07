import {
  ImageIcon,
  FileText,
  Upload,
  Search,
  Trash2,
  Download,
} from "lucide-react";

const files = [
  {
    id: 1,
    name: "refund-policy.png",
    type: "Image",
    size: "1.4 MB",
    uploaded: "06 Jul 2026",
  },
  {
    id: 2,
    name: "baggage.pdf",
    type: "PDF",
    size: "2.8 MB",
    uploaded: "05 Jul 2026",
  },
  {
    id: 3,
    name: "reservation-flow.png",
    type: "Image",
    size: "800 KB",
    uploaded: "04 Jul 2026",
  },
];

export default function MediaLibraryPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Media Library
          </h1>

          <p className="mt-3 text-slate-500">
            Upload and manage images and documents.
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white">
          <Upload size={18} />
          Upload Files
        </button>

      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3">

          <Search size={18} />

          <input
            placeholder="Search media..."
            className="w-full outline-none"
          />

        </div>

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">File</th>

              <th className="px-6 py-4 text-left">Type</th>

              <th className="px-6 py-4 text-left">Size</th>

              <th className="px-6 py-4 text-left">Uploaded</th>

              <th className="px-6 py-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {files.map((file) => (

              <tr key={file.id} className="border-t">

                <td className="px-6 py-5 flex items-center gap-3">

                  {file.type === "Image" ? (
                    <ImageIcon className="text-red-700" />
                  ) : (
                    <FileText className="text-blue-700" />
                  )}

                  {file.name}

                </td>

                <td className="px-6 py-5">{file.type}</td>

                <td className="px-6 py-5">{file.size}</td>

                <td className="px-6 py-5">{file.uploaded}</td>

                <td className="px-6 py-5">

                  <div className="flex gap-2">

                    <button className="rounded-lg border p-2">
                      <Download size={18} />
                    </button>

                    <button className="rounded-lg border p-2">
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}