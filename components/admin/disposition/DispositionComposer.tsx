import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";
import AdminSelect from "../AdminSelect";

interface DispositionCode {
  code: string;
  label: string;
  description: string | null;
  category?: string | null;
  active: boolean;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  disposition?: DispositionCode;
  categories?: string[];
}

export default function DispositionComposer({
  action,
  submitLabel = "Save Disposition Code",
  disposition,
  categories = [],
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="category"
        label="Category (Type)"
        placeholder="e.g. New booking, Complaint, Baggage..."
        defaultValue={disposition?.category ?? ""}
        list="disposition-categories"
      />

      {categories.length > 0 && (
        <datalist id="disposition-categories">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      )}

      <div className="grid gap-6 md:grid-cols-2">

        <AdminInput
          name="code"
          label="Code"
          placeholder="e.g. RSLVD"
          defaultValue={disposition?.code}
          required
        />

        <AdminInput
          name="label"
          label="Label"
          placeholder="e.g. Resolved"
          defaultValue={disposition?.label}
          required
        />

      </div>

      <AdminSelect
        name="active"
        label="Status"
        defaultValue={disposition ? String(disposition.active) : "true"}
        options={[
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ]}
      />

      <AdminTextarea
        name="description"
        label="Description"
        placeholder="When should champions use this code?"
        defaultValue={disposition?.description ?? ""}
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
