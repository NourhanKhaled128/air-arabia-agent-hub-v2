import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";
import AdminSelect from "../AdminSelect";

interface EscalationContact {
  issueType: string;
  escalateTo: string;
  contactInfo: string;
  notes: string | null;
  active: boolean;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  escalation?: EscalationContact;
}

export default function EscalationComposer({
  action,
  submitLabel = "Save Escalation Contact",
  escalation,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <div className="grid gap-6 md:grid-cols-2">

        <AdminInput
          name="issueType"
          label="Issue Type"
          placeholder="e.g. Payments"
          defaultValue={escalation?.issueType}
          required
        />

        <AdminInput
          name="escalateTo"
          label="Escalate To"
          placeholder="e.g. Tier 2 Finance"
          defaultValue={escalation?.escalateTo}
          required
        />

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <AdminInput
          name="contactInfo"
          label="Contact Info"
          placeholder="e.g. ext. 4521"
          defaultValue={escalation?.contactInfo}
          required
        />

        <AdminSelect
          name="active"
          label="Status"
          defaultValue={escalation ? String(escalation.active) : "true"}
          options={[
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ]}
        />

      </div>

      <AdminTextarea
        name="notes"
        label="Notes"
        placeholder="Any extra context for agents..."
        defaultValue={escalation?.notes ?? ""}
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
