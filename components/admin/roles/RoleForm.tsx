import AdminInput from "../AdminInput";
import AdminSelect from "../AdminSelect";
import AdminButton from "../AdminButton";
import { PERMISSION_KEYS } from "@/lib/role-service";

interface RoleData {
  name: string;
  color: string;
  permissions: string[];
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  role?: RoleData;
}

function formatPermissionLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function RoleForm({
  action,
  submitLabel = "Save Role",
  role,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="name"
        label="Role Name"
        placeholder="Supervisor"
        defaultValue={role?.name}
        required
      />

      <AdminSelect
        name="color"
        label="Badge Color"
        defaultValue={role?.color ?? "bg-slate-100 text-slate-700"}
        options={[
          { label: "Red", value: "bg-red-100 text-red-700" },
          { label: "Blue", value: "bg-blue-100 text-blue-700" },
          { label: "Emerald", value: "bg-emerald-100 text-emerald-700" },
          { label: "Slate", value: "bg-slate-100 text-slate-700" },
        ]}
      />

      <div>
        <label className="mb-3 block font-semibold">
          Permissions
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          {PERMISSION_KEYS.map((key) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"
            >
              <input
                type="checkbox"
                name="permissions"
                value={key}
                defaultChecked={role?.permissions?.includes(key) ?? false}
                className="h-5 w-5 rounded border-slate-300"
              />
              {formatPermissionLabel(key)}
            </label>
          ))}
        </div>
      </div>

      <AdminButton>{submitLabel}</AdminButton>

    </form>
  );
}
