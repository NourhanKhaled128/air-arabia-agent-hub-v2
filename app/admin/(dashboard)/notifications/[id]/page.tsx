import { notFound } from "next/navigation";
import NotificationComposer from "@/components/admin/notification/NotificationComposer";
import { getNotificationById } from "@/lib/notification-service";
import { updateNotificationAction } from "@/app/admin/actions/notification-actions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditNotificationPage({ params }: Props) {
  const { id } = await params;
  const notificationId = Number(id);

  if (!Number.isInteger(notificationId)) {
    notFound();
  }

  const notification = await getNotificationById(notificationId);

  if (!notification) {
    notFound();
  }

  const boundUpdate = updateNotificationAction.bind(null, notificationId);

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Edit Notification"
        breadcrumbs={[{ label: "Notifications", href: "/admin/notifications" }, { label: notification.title }]}
      />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <NotificationComposer
          action={boundUpdate}
          submitLabel="Save Changes"
          notification={notification}
        />
      </div>

    </div>
  );
}
