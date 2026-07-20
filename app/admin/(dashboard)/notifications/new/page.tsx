import NotificationComposer from "@/components/admin/notification/NotificationComposer";
import { createNotificationAction } from "@/app/admin/actions/notification-actions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function NewNotificationPage() {
  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="New Notification"
        breadcrumbs={[{ label: "Notifications", href: "/admin/notifications" }, { label: "New Notification" }]}
      />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <NotificationComposer action={createNotificationAction} submitLabel="Send Notification" />
      </div>

    </div>
  );
}
