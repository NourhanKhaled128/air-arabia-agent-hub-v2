"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import NotificationRowActions from "./NotificationRowActions";
import { deleteManyNotificationsAction } from "@/app/admin/actions/notification-actions";

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

interface Notification {
  id: number;
  title: string;
  message: string;
  audience: string | null;
  status: string;
  sendDate: Date | null;
}

interface Props {
  notifications: Notification[];
}

export default function NotificationsTable({ notifications }: Props) {
  return (
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
  );
}
