import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";
import AdminSelect from "../AdminSelect";
import AdminButton from "../AdminButton";
import { SIDEBAR_ICON_KEYS } from "@/lib/sidebar-icons";

interface ImportantLink {
  title: string;
  url: string;
  description: string | null;
  icon: string;
  order: number;
  visible: boolean;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  link?: ImportantLink;
}

export default function ImportantLinkForm({
  action,
  submitLabel = "Save Link",
  link,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="title"
        label="Title"
        placeholder="Staff Travel Portal"
        defaultValue={link?.title}
        required
      />

      <AdminInput
        name="url"
        label="URL"
        placeholder="https://..."
        defaultValue={link?.url}
        required
      />

      <AdminTextarea
        name="description"
        label="Description (optional)"
        placeholder="Short note about this link..."
        defaultValue={link?.description ?? ""}
      />

      <div className="grid gap-6 md:grid-cols-2">

        <AdminSelect
          name="icon"
          label="Icon"
          defaultValue={link?.icon ?? "Link2"}
          options={SIDEBAR_ICON_KEYS.map((key) => ({ label: key, value: key }))}
        />

        <AdminInput
          type="number"
          name="order"
          label="Display Order"
          placeholder="0"
          defaultValue={link?.order ?? 0}
        />

      </div>

      <label className="flex items-center gap-3 font-semibold">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={link?.visible ?? true}
          className="h-5 w-5 rounded border-gray-300"
        />
        Show on agent portal
      </label>

      <AdminButton>{submitLabel}</AdminButton>

    </form>
  );
}
