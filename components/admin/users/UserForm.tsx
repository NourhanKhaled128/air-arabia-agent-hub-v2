import AdminInput from "../AdminInput";
import AdminSelect from "../AdminSelect";
import AdminButton from "../AdminButton";

interface RoleOption {
  id: number;
  name: string;
}

interface UserData {
  name: string;
  email: string;
  roleId: number;
  status: string;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  user?: UserData;
  roles: RoleOption[];
  passwordRequired?: boolean;
}

export default function UserForm({
  action,
  submitLabel = "Save User",
  user,
  roles,
  passwordRequired = true,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="name"
        label="Full Name"
        placeholder="Jane Doe"
        defaultValue={user?.name}
        required
      />

      <AdminInput
        type="email"
        name="email"
        label="Email"
        placeholder="jane@airarabia.com"
        defaultValue={user?.email}
        required
      />

      <AdminInput
        type="password"
        name="password"
        label={passwordRequired ? "Password" : "New Password (leave blank to keep current)"}
        placeholder="••••••••"
        required={passwordRequired}
      />

      <div className="grid gap-6 md:grid-cols-2">

        <AdminSelect
          name="roleId"
          label="Role"
          defaultValue={user?.roleId ?? roles[0]?.id}
          options={roles.map((role) => ({
            label: role.name,
            value: String(role.id),
          }))}
        />

        <AdminSelect
          name="status"
          label="Status"
          defaultValue={user?.status ?? "Active"}
          options={[
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
        />

      </div>

      <AdminButton>{submitLabel}</AdminButton>

    </form>
  );
}
