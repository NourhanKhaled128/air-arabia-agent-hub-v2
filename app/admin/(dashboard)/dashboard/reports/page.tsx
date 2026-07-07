import {
  FileBarChart2,
  Download,
  CalendarDays,
  FileSpreadsheet,
} from "lucide-react";

const reports = [
  {
    id: 1,
    name: "Knowledge Base Report",
    period: "Monthly",
    generated: "06 Jul 2026",
  },
  {
    id: 2,
    name: "Training Report",
    period: "Weekly",
    generated: "05 Jul 2026",
  },
  {
    id: 3,
    name: "User Activity",
    period: "Daily",
    generated: "06 Jul 2026",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Reports
        </h1>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <FileBarChart2 className="mb-4 text-red-700" />
          <p>Total Reports</p>
          <h2 className="text-3xl font-bold">36</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <CalendarDays className="mb-4 text-blue-700" />
          <p>Scheduled</p>
          <h2 className="text-3xl font-bold">8</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Download className="mb-4 text-emerald-700" />
          <p>Downloads</p>
          <h2 className="text-3xl font-bold">428</h2>
        </div>

      </div>

      <div className="rounded-3xl bg-white shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">Report</th>
              <th className="px-6 py-4 text-left">Period</th>
              <th className="px-6 py-4 text-left">Generated</th>
              <th className="px-6 py-4 text-left">Export</th>

            </tr>

          </thead>

          <tbody>

            {reports.map((report) => (

              <tr key={report.id} className="border-t">

                <td className="px-6 py-5">
                  {report.name}
                </td>

                <td className="px-6 py-5">
                  {report.period}
                </td>

                <td className="px-6 py-5">
                  {report.generated}
                </td>

                <td className="px-6 py-5">

                  <button className="rounded-lg border px-4 py-2 flex items-center gap-2 hover:bg-slate-50">

                    <FileSpreadsheet size={18} />

                    Export

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}