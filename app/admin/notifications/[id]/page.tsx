import { notFound } from "next/navigation";
import NotificationComposer from "@/components/admin/notification/NotificationComposer";
import { getNotificationById } from "@/lib/notification-service";
import { updateNotificationAction } from "@/app/admin/actions/notification-actions";

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

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Edit Notification
        </h1>
      </div>

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
