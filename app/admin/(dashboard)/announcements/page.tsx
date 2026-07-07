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
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";

type BadgeColor = "red" | "green" | "blue" | "yellow" | "gray";

const statusColor: Record<string, BadgeColor> = {
  Published: "green",
  Scheduled: "yellow",
  Draft: "gray",
};

const priorityColor: Record<string, BadgeColor> = {
  Critical: "red",
  High: "yellow",
  Medium: "blue",
  Low: "gray",
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
      <AdminPageHeader
        title="Announcements"
        description="Create, schedule and manage announcements for all agents."
        actions={
          <Link
            href="/admin/announcements/new"
            className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            <Plus size={18} />
            New Announcement
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard title="Total" value={total} icon={Bell} />
        <AdminStatCard title="Published" value={published} icon={Eye} color="text-emerald-700" />
        <AdminStatCard title="Scheduled" value={scheduled} icon={CalendarDays} color="text-amber-700" />
        <AdminStatCard title="Drafts" value={drafts} icon={Clock} color="text-slate-700" />
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
                  <AdminBadge color={priorityColor[item.priority] ?? "blue"}>
                    {item.priority}
                  </AdminBadge>
                </td>

                <td className="px-6 py-5">
                  <AdminBadge color={statusColor[item.status] ?? "gray"}>
                    {item.status}
                  </AdminBadge>
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
