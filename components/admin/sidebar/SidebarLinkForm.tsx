import AdminInput from "../AdminInput";
import AdminSelect from "../AdminSelect";
import AdminButton from "../AdminButton";
import { SIDEBAR_ICON_KEYS } from "@/lib/sidebar-icons";

interface SidebarLink {
  label: string;
  href: string;
  icon: string;
  section: string;
  order: number;
  visible: boolean;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  link?: SidebarLink;
}

export default function SidebarLinkForm({
  action,
  submitLabel = "Save Link",
  link,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="label"
        label="Label"
        placeholder="Flight Duration"
        defaultValue={link?.label}
        required
      />

      <AdminInput
        name="href"
        label="Link (href)"
        placeholder="/flight-duration"
        defaultValue={link?.href}
        required
      />

      <div className="grid gap-6 md:grid-cols-2">

        <AdminSelect
          name="section"
          label="Sidebar Section"
          defaultValue={link?.section ?? "tools"}
          options={[
            { label: "Pinned Knowledge", value: "pinned" },
            { label: "Agent Tools", value: "tools" },
            { label: "Quick Actions", value: "quickActions" },
          ]}
        />

        <AdminSelect
          name="icon"
          label="Icon"
          defaultValue={link?.icon ?? "Link2"}
          options={SIDEBAR_ICON_KEYS.map((key) => ({ label: key, value: key }))}
        />

      </div>

      <AdminInput
        type="number"
        name="order"
        label="Sidebar Order"
        placeholder="0"
        defaultValue={link?.order ?? 0}
      />

      <label className="flex items-center gap-3 font-semibold">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={link?.visible ?? true}
          className="h-5 w-5 rounded border-gray-300"
        />
        Show in agent sidebar
      </label>

      <AdminButton>{submitLabel}</AdminButton>

    </form>
  );
}
