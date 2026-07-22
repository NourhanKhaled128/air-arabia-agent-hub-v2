import AdminInput from "../AdminInput";
import AdminButton from "../AdminButton";

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  team?: { name: string };
}

export default function TeamForm({ action, submitLabel = "Save Team", team }: Props) {
  return (
    <form action={action} className="space-y-6">
      <AdminInput
        name="name"
        label="Team Name"
        placeholder="Night Shift"
        defaultValue={team?.name}
        required
      />

      <AdminButton>{submitLabel}</AdminButton>
    </form>
  );
}
