import Link from "next/link";
import {
  Bell,
  Send,
  Calendar,
  Plus,
  FileText,
} from "lucide-react";
import { getNotifications } from "@/lib/notification-service";
import { deleteManyNotificationsAction } from "@/app/admin/actions/notification-actions";
import NotificationRowActions from "@/components/admin/notification/NotificationRowActions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminListTable from "@/components/admin/AdminListTable";

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

      <AdminListTable
        columns={[
          { key: "title", label: "Title" },
          { key: "audience", label: "Audience" },
          { key: "status", label: "Status" },
          { key: "sendDate", label: "Send Date" },
        ]}
        data={notifications}
        searchPlaceholder="Search notifications..."
        searchFn={(item, query) => {
          const q = query.toLowerCase();
          return (
            item.title.toLowerCase().includes(q) ||
            item.message.toLowerCase().includes(q) ||
            (item.audience ?? "").toLowerCase().includes(q)
          );
        }}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "Sent", label: "Sent" },
              { value: "Scheduled", label: "Scheduled" },
              { value: "Draft", label: "Draft" },
            ],
          },
        ]}
        filterFn={(item, values) => {
          if (values.status && item.status !== values.status) return false;
          return true;
        }}
        onDeleteMany={deleteManyNotificationsAction}
        emptyMessage="No notifications yet."
        renderRow={(notification) => (
          <>
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
          </>
        )}
      />

    </div>
  );
}
