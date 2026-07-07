import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";
import AdminSelect from "../AdminSelect";

interface Notification {
  title: string;
  message: string;
  audience: string | null;
  status: string;
  sendDate: Date | null;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  notification?: Notification;
}

function toDateTimeInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 16) : "";
}

export default function NotificationComposer({
  action,
  submitLabel = "Save Notification",
  notification,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="title"
        label="Notification Title"
        placeholder="Title..."
        defaultValue={notification?.title}
        required
      />

      <AdminSelect
        name="audience"
        label="Audience"
        defaultValue={notification?.audience ?? "all"}
        options={[
          { label: "All Agents", value: "all" },
          { label: "Reservations", value: "reservation" },
          { label: "Airport", value: "airport" },
          { label: "Finance", value: "finance" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2">

        <AdminSelect
          name="status"
          label="Status"
          defaultValue={notification?.status ?? "Draft"}
          options={[
            { label: "Draft", value: "Draft" },
            { label: "Scheduled", value: "Scheduled" },
            { label: "Sent", value: "Sent" },
          ]}
        />

        <AdminInput
          type="datetime-local"
          name="sendDate"
          label="Send Date"
          defaultValue={toDateTimeInputValue(notification?.sendDate)}
        />

      </div>

      <AdminTextarea
        name="message"
        label="Message"
        placeholder="Write notification message..."
        defaultValue={notification?.message}
        required
      />

      <div className="flex justify-end">

        <button
          type="submit"
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          {submitLabel}
        </button>

      </div>

    </form>
  );
}
