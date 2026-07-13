import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Plus,
  Eye,
  Clock,
} from "lucide-react";
import { getAnnouncements } from "@/lib/announcement-service";
import AnnouncementsTable from "@/components/admin/announcement/AnnouncementsTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";

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
        description="Create, schedule and manage announcements for all champions."
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

      <AnnouncementsTable announcements={announcements} />
    </div>
  );
}
