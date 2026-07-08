import Link from "next/link";
import {
  Bell,
  Send,
  Calendar,
  Plus,
  FileText,
} from "lucide-react";
import { getNotifications } from "@/lib/notification-service";
import NotificationsTable from "@/components/admin/notification/NotificationsTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  const total = notifications.length;
  const sent = notifications.filter((n) => n.status === "Sent").length;
  const scheduled = notifications.filter((n) => n.status === "Scheduled").length;
  const drafts = notifications.filter((n) => n.status === "Draft").length;

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Notifications"
        description="Send and manage internal notifications."
        actions={
          <Link
            href="/admin/notifications/new"
            className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            <Plus size={18} />
            New Notification
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard title="Total" value={total} icon={Bell} />
        <AdminStatCard title="Sent" value={sent} icon={Send} color="text-emerald-700" />
        <AdminStatCard title="Scheduled" value={scheduled} icon={Calendar} color="text-amber-600" />
        <AdminStatCard title="Draft" value={drafts} icon={FileText} color="text-slate-700" />
      </div>

      <NotificationsTable notifications={notifications} />

    </div>
  );
}
