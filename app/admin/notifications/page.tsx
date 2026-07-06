import {
  Bell,
  Send,
  Users,
  Calendar,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "System Maintenance",
    audience: "All Agents",
    status: "Published",
    date: "06 Jul 2026",
  },
  {
    id: 2,
    title: "Refund Policy Updated",
    audience: "Reservations",
    status: "Scheduled",
    date: "08 Jul 2026",
  },
  {
    id: 3,
    title: "Training Reminder",
    audience: "New Joiners",
    status: "Draft",
    date: "-",
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Notifications
          </h1>

          <p className="mt-3 text-slate-500">
            Send and manage internal notifications.
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
          <Plus size={18} />
          New Notification
        </button>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Bell className="mb-3 text-red-700" />
          <p>Total</p>
          <h2 className="text-3xl font-bold">54</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Send className="mb-3 text-emerald-700" />
          <p>Sent</p>
          <h2 className="text-3xl font-bold">41</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Calendar className="mb-3 text-amber-600" />
          <p>Scheduled</p>
          <h2 className="text-3xl font-bold">8</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Users className="mb-3 text-blue-700" />
          <p>Recipients</p>
          <h2 className="text-3xl font-bold">132</h2>
        </div>

      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">Title</th>

              <th className="px-6 py-4 text-left">Audience</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-left">Date</th>

              <th className="px-6 py-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {notifications.map((notification) => (

              <tr key={notification.id} className="border-t">

                <td className="px-6 py-5 font-semibold">
                  {notification.title}
                </td>

                <td className="px-6 py-5">
                  {notification.audience}
                </td>

                <td className="px-6 py-5">
                  {notification.status}
                </td>

                <td className="px-6 py-5">
                  {notification.date}
                </td>

                <td className="px-6 py-5">

                  <div className="flex gap-2">

                    <button className="rounded-lg border p-2">
                      <Pencil size={18} />
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