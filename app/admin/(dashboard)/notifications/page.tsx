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

const badge: Record<string, string> = {
  Sent: "bg-emerald-100 text-emerald-700",
  Scheduled: "bg-amber-100 text-amber-700",
  Draft: "bg-slate-200 text-slate-700",
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

        <Link
          href="/admin/notifications/new"
          className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          <Plus size={18} />
          New Notification
        </Link>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Bell className="mb-3 text-red-700" />
          <p>Total</p>
          <h2 className="text-3xl font-bold">{total}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Send className="mb-3 text-emerald-700" />
          <p>Sent</p>
          <h2 className="text-3xl font-bold">{sent}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Calendar className="mb-3 text-amber-600" />
          <p>Scheduled</p>
          <h2 className="text-3xl font-bold">{scheduled}</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <FileText className="mb-3 text-slate-700" />
          <p>Draft</p>
          <h2 className="text-3xl font-bold">{drafts}</h2>
        </div>

      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

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
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${badge[notification.status] ?? badge.Draft}`}
                  >
                    {notification.status}
                  </span>
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
