import Link from "next/link";
import {
  Bell,
  Send,
  Calendar,
  Plus,
  FileText,
} from "lucide-react";
import { getNotifications } from "@/lib/notification-service";
import NotificationRowActions from "@/components/admin/notification/NotificationRowActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";

const badgeColor: Record<string, "red" | "green" | "blue" | "yellow" | "gray"> = {
  Sent: "green",
  Scheduled: "yellow",
  Draft: "gray",
};

function formatDateTime(date: Date | null) {
  if (!date) return "-";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">Title</th>

              <th className="px-6 py-4 text-left">Audience</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-left">Send Date</th>

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
                  {notification.audience ?? "-"}
                </td>

                <td className="px-6 py-5">
                  <AdminBadge color={badgeColor[notification.status] ?? "gray"}>
                    {notification.status}
                  </AdminBadge>
                </td>

                <td className="px-6 py-5">
                  {formatDateTime(notification.sendDate)}
                </td>

                <td className="px-6 py-5">
                  <NotificationRowActions id={notification.id} />
                </td>

              </tr>

            ))}

            {notifications.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No notifications yet.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
