import NotificationComposer from "@/components/admin/notification/NotificationComposer";
import { createNotificationAction } from "@/app/admin/actions/notification-actions";

export default function NewNotificationPage() {
  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          New Notification
        </h1>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <NotificationComposer action={createNotificationAction} submitLabel="Send Notification" />
      </div>

    </div>
  );
}
