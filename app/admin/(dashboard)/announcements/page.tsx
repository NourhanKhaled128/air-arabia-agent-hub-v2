import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Plus,
  Eye,
  Clock,
} from "lucide-react";
import { getAnnouncements } from "@/lib/announcement-service";
import { deleteManyAnnouncementsAction } from "@/app/admin/actions/announcement-actions";
import AnnouncementRowActions from "@/components/admin/announcement/AnnouncementRowActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminListTable from "@/components/admin/AdminListTable";

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

      <AdminListTable
        columns={[
          { key: "title", label: "Title" },
          { key: "priority", label: "Priority" },
          { key: "status", label: "Status" },
          { key: "audience", label: "Audience" },
          { key: "publish", label: "Publish" },
          { key: "expiry", label: "Expiry" },
        ]}
        data={announcements}
        searchPlaceholder="Search announcements..."
        searchFn={(item, query) => {
          const q = query.toLowerCase();
          return (
            item.title.toLowerCase().includes(q) ||
            item.content.toLowerCase().includes(q) ||
            (item.audience ?? "").toLowerCase().includes(q)
          );
        }}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "Published", label: "Published" },
              { value: "Scheduled", label: "Scheduled" },
              { value: "Draft", label: "Draft" },
            ],
          },
          {
            key: "priority",
            label: "Priority",
            options: [
              { value: "Critical", label: "Critical" },
              { value: "High", label: "High" },
              { value: "Medium", label: "Medium" },
              { value: "Low", label: "Low" },
            ],
          },
        ]}
        filterFn={(item, values) => {
          if (values.status && item.status !== values.status) return false;
          if (values.priority && item.priority !== values.priority) return false;
          return true;
        }}
        onDeleteMany={deleteManyAnnouncementsAction}
        emptyMessage="No announcements yet."
        renderRow={(item) => (
          <>
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
          </>
        )}
      />
    </div>
  );
}
