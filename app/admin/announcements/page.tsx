import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Clock,
} from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "Summer Schedule Update",
    priority: "High",
    status: "Published",
    audience: "All Agents",
    publishDate: "06 Jul 2026",
    expiryDate: "31 Jul 2026",
  },
  {
    id: 2,
    title: "New Refund SOP",
    priority: "Medium",
    status: "Scheduled",
    audience: "Reservations",
    publishDate: "08 Jul 2026",
    expiryDate: "31 Aug 2026",
  },
  {
    id: 3,
    title: "System Maintenance",
    priority: "Critical",
    status: "Draft",
    audience: "All Users",
    publishDate: "-",
    expiryDate: "-",
  },
];

const badge = {
  Published: "bg-emerald-100 text-emerald-700",
  Scheduled: "bg-amber-100 text-amber-700",
  Draft: "bg-slate-200 text-slate-700",
};

const priority = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-blue-100 text-blue-700",
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Announcements
          </h1>

          <p className="mt-3 text-slate-500">
            Create, schedule and manage announcements for all agents.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
          <Plus size={18} />
          New Announcement
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Bell className="mb-4 text-red-700" />
          <p className="text-sm text-slate-500">Total</p>
          <h2 className="mt-2 text-3xl font-bold">24</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Eye className="mb-4 text-emerald-700" />
          <p className="text-sm text-slate-500">Published</p>
          <h2 className="mt-2 text-3xl font-bold">18</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <CalendarDays className="mb-4 text-amber-700" />
          <p className="text-sm text-slate-500">Scheduled</p>
          <h2 className="mt-2 text-3xl font-bold">3</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Clock className="mb-4 text-slate-700" />
          <p className="text-sm text-slate-500">Drafts</p>
          <h2 className="mt-2 text-3xl font-bold">3</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Priority</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Audience</th>
              <th className="px-6 py-4 text-left">Publish</th>
              <th className="px-6 py-4 text-left">Expiry</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {announcements.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-6 py-5 font-semibold">{item.title}</td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      priority[item.priority as keyof typeof priority]
                    }`}
                  >
                    {item.priority}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      badge[item.status as keyof typeof badge]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-5">{item.audience}</td>
                <td className="px-6 py-5">{item.publishDate}</td>
                <td className="px-6 py-5">{item.expiryDate}</td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg border p-2 hover:bg-slate-50">
                      <Pencil size={18} />
                    </button>

                    <button className="rounded-lg border p-2 hover:bg-slate-50">
                      <Trash2 size={18} />
                    </button>

                    <Link
                      href={`/admin/announcements/${item.id}`}
                      className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      View
                    </Link>
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