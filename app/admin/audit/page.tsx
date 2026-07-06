import {
  ShieldCheck,
  Search,
  User,
  Clock,
} from "lucide-react";

const logs = [
  {
    id: 1,
    action: "Article Published",
    user: "Administrator",
    module: "Knowledge Base",
    time: "06 Jul 2026 09:15",
  },
  {
    id: 2,
    action: "Category Created",
    user: "Supervisor",
    module: "Categories",
    time: "06 Jul 2026 08:45",
  },
  {
    id: 3,
    action: "Announcement Updated",
    user: "Administrator",
    module: "Announcements",
    time: "05 Jul 2026 18:20",
  },
];

export default function AuditPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Audit Trail
        </h1>

      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3">

          <Search size={18} />

          <input
            className="w-full outline-none"
            placeholder="Search audit logs..."
          />

        </div>

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">Action</th>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Module</th>
              <th className="px-6 py-4 text-left">Time</th>

            </tr>

          </thead>

          <tbody>

            {logs.map((log) => (

              <tr key={log.id} className="border-t">

                <td className="px-6 py-5 flex items-center gap-2">
                  <ShieldCheck className="text-red-700" size={18} />
                  {log.action}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    {log.user}
                  </div>
                </td>

                <td className="px-6 py-5">
                  {log.module}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {log.time}
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