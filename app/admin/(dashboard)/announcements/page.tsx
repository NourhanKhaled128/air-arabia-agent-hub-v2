import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Plus,
  Eye,
  Clock,
} from "lucide-react";
import { getAnnouncements } from "@/lib/announcement-service";
import AnnouncementRowActions from "@/components/admin/announcement/AnnouncementRowActions";

const badge: Record<string, string> = {
  Published: "bg-emerald-100 text-emerald-700",
  Scheduled: "bg-amber-100 text-amber-700",
  Draft: "bg-slate-200 text-slate-700",
};

const priority: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-slate-100 text-slate-700",
};

function formatDate(date: Date | null) {
  if (!date) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  const total = announcements.length;
  const published = announcements.filter((a) => a.status === "Published").length;
  const scheduled = announcements.filter((a) => a.status === "Scheduled").length;
  const drafts = announcements.filter((a) => a.status === "Draft").length;

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

        <Link
          href="/admin/announcements/new"
          className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          <Plus size={18} />
          New Announcement
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Bell className="mb-4 text-red-700" />
          <p className="text-sm text-slate-500">Total</p>
          <h2 className="mt-2 text-3xl font-bold">{total}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Eye className="mb-4 text-emerald-700" />
          <p className="text-sm text-slate-500">Published</p>
          <h2 className="mt-2 text-3xl font-bold">{published}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <CalendarDays className="mb-4 text-amber-700" />
          <p className="text-sm text-slate-500">Scheduled</p>
          <h2 className="mt-2 text-3xl font-bold">{scheduled}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Clock className="mb-4 text-slate-700" />
          <p className="text-sm text-slate-500">Drafts</p>
          <h2 className="mt-2 text-3xl font-bold">{drafts}</h2>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
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
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${priority[item.priority] ?? priority.Medium}`}
                  >
                    {item.priority}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${badge[item.status] ?? badge.Draft}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-5">{item.audience ?? "-"}</td>
                <td className="px-6 py-5">{formatDate(item.publishDate)}</td>
                <td className="px-6 py-5">{formatDate(item.expiryDate)}</td>

                <td className="px-6 py-5">
                  <AnnouncementRowActions id={item.id} />
                </td>
              </tr>
            ))}

            {announcements.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                  No announcements yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
