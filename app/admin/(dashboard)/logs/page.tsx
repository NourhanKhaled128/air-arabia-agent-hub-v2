import {
  Activity,
  Search,
} from "lucide-react";

const logs = [
  {
    id: 1,
    action: "Article Published",
    user: "Administrator",
    time: "06 Jul 2026 - 09:40",
  },
  {
    id: 2,
    action: "Category Updated",
    user: "Supervisor",
    time: "06 Jul 2026 - 09:10",
  },
  {
    id: 3,
    action: "User Created",
    user: "Administrator",
    time: "06 Jul 2026 - 08:55",
  },
];

export default function LogsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Activity Logs
        </h1>

      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3">

          <Search size={18} />

          <input
            className="w-full outline-none"
            placeholder="Search logs..."
          />

        </div>

        <div className="overflow-x-auto">
          <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">Action</th>

              <th className="px-6 py-4 text-left">User</th>

              <th className="px-6 py-4 text-left">Time</th>

            </tr>

          </thead>

          <tbody>

            {logs.map((log) => (

              <tr
                key={log.id}
                className="border-t"
              >

                <td className="px-6 py-5 flex items-center gap-3">

                  <Activity
                    className="text-red-700"
                    size={18}
                  />

                  {log.action}

                </td>

                <td className="px-6 py-5">
                  {log.user}
                </td>

                <td className="px-6 py-5">
                  {log.time}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
        </div>

      </div>

    </div>
  );
}