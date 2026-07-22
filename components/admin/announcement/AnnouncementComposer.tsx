import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";
import AdminSelect from "../AdminSelect";

interface Announcement {
  title: string;
  content: string;
  priority: string;
  status: string;
  audience: string | null;
  teamId?: number | null;
  isPlatformUpdate?: boolean;
  publishDate: Date | null;
  expiryDate: Date | null;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  announcement?: Announcement;
  teams: { id: number; name: string }[];
}

function toDateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default function AnnouncementComposer({
  action,
  submitLabel = "Publish Announcement",
  announcement,
  teams,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="title"
        label="Announcement Title"
        placeholder="Title..."
        defaultValue={announcement?.title}
        required
      />

      <AdminSelect
        name="audience"
        label="Audience"
        defaultValue={announcement?.audience ?? "all"}
        options={[
          { label: "All Champions", value: "all" },
          { label: "Reservations", value: "reservation" },
          { label: "Airport", value: "airport" },
          { label: "Finance", value: "finance" },
        ]}
      />

      <AdminSelect
        name="priority"
        label="Priority"
        defaultValue={announcement?.priority ?? "Medium"}
        options={[
          { label: "Low", value: "Low" },
          { label: "Medium", value: "Medium" },
          { label: "High", value: "High" },
          { label: "Critical", value: "Critical" },
        ]}
      />

      <AdminSelect
        name="status"
        label="Status"
        defaultValue={announcement?.status ?? "Draft"}
        options={[
          { label: "Draft", value: "Draft" },
          { label: "Scheduled", value: "Scheduled" },
          { label: "Published", value: "Published" },
        ]}
      />

      <AdminSelect
        name="teamId"
        label="Team (optional — restricts visibility to one team)"
        defaultValue={announcement?.teamId ? String(announcement.teamId) : ""}
        options={[
          { label: "All Teams", value: "" },
          ...teams.map((team) => ({ label: team.name, value: String(team.id) })),
        ]}
      />

      <div className="flex items-center gap-3 rounded-xl border p-4">
        <input
          type="checkbox"
          id="isPlatformUpdate"
          name="isPlatformUpdate"
          defaultChecked={announcement?.isPlatformUpdate ?? false}
          className="h-5 w-5 rounded border-gray-300"
        />
        <label htmlFor="isPlatformUpdate" className="text-sm font-semibold">
          This is a platform update (shows on the What&apos;s New page)
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <AdminInput
          type="date"
          name="publishDate"
          label="Publish Date"
          defaultValue={toDateInputValue(announcement?.publishDate)}
        />

        <AdminInput
          type="date"
          name="expiryDate"
          label="Expiry Date"
          defaultValue={toDateInputValue(announcement?.expiryDate)}
        />

      </div>

      <AdminTextarea
        name="content"
        label="Announcement"
        placeholder="Write announcement..."
        defaultValue={announcement?.content}
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
