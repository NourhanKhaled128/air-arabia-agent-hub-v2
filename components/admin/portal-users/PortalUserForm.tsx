import AdminInput from "../AdminInput";
import AdminSelect from "../AdminSelect";
import AdminButton from "../AdminButton";

interface PortalUserData {
  name: string;
  email: string;
  status: string;
  teamId?: number | null;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  user?: PortalUserData;
  teams: { id: number; name: string }[];
  passwordRequired?: boolean;
}

export default function PortalUserForm({
  action,
  submitLabel = "Save Agent",
  user,
  teams,
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
        pattern="^[^\s@]+@(airarabia\.com|gocozmo\.com)$"
        title="Must be an @airarabia.com or @gocozmo.com email address."
        required
      />

      <AdminInput
        type="password"
        name="password"
        label={passwordRequired ? "Password" : "New Password (leave blank to keep current)"}
        placeholder="••••••••"
        required={passwordRequired}
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

      <AdminSelect
        name="teamId"
        label="Team"
        defaultValue={user?.teamId ? String(user.teamId) : ""}
        options={[
          { label: "No team", value: "" },
          ...teams.map((team) => ({ label: team.name, value: String(team.id) })),
        ]}
      />

      <AdminButton>{submitLabel}</AdminButton>

    </form>
  );
}
