import {
  History,
  RotateCcw,
  Eye,
  User,
} from "lucide-react";

const versions = [
  {
    id: 1,
    article: "Refund Policy",
    version: "v3.2",
    author: "Administrator",
    date: "06 Jul 2026",
    status: "Current",
  },
  {
    id: 2,
    article: "Baggage",
    version: "v2.5",
    author: "Supervisor",
    date: "04 Jul 2026",
    status: "Previous",
  },
  {
    id: 3,
    article: "Seat Selection",
    version: "v1.8",
    author: "Administrator",
    date: "02 Jul 2026",
    status: "Previous",
  },
];

export default function VersionHistoryPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Version History
        </h1>

      </div>

      <div className="rounded-3xl bg-white shadow-sm overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">Article</th>
              <th className="px-6 py-4 text-left">Version</th>
              <th className="px-6 py-4 text-left">Author</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {versions.map((version) => (

              <tr key={version.id} className="border-t">

                <td className="px-6 py-5">{version.article}</td>

                <td className="px-6 py-5 font-semibold">
                  {version.version}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <User size={16}/>
                    {version.author}
                  </div>
                </td>

                <td className="px-6 py-5">{version.date}</td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      version.status === "Current"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {version.status}
                  </span>
                </td>

                <td className="px-6 py-5">

                  <div className="flex gap-2">

                    <button className="rounded-lg border p-2 hover:bg-slate-50">
                      <Eye size={18}/>
                    </button>

                    <button className="rounded-lg border p-2 hover:bg-slate-50">
                      <RotateCcw size={18}/>
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