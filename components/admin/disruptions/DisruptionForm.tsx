import AdminInput from "../AdminInput";
import AdminSelect from "../AdminSelect";
import AdminTextarea from "../AdminTextarea";
import AdminButton from "../AdminButton";

interface DisruptionData {
  airportCode: string;
  message: string;
  level: string;
  active: boolean;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  disruption?: DisruptionData;
}

export default function DisruptionForm({
  action,
  submitLabel = "Save Alert",
  disruption,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="airportCode"
        label="Airport Code"
        placeholder="SHJ"
        defaultValue={disruption?.airportCode}
        required
      />

      <AdminTextarea
        name="message"
        label="Message"
        placeholder="Runway maintenance between 22:00 - 04:00"
        defaultValue={disruption?.message}
        required
      />

      <AdminSelect
        name="level"
        label="Severity Level"
        defaultValue={disruption?.level ?? "Medium"}
        options={[
          { label: "Low", value: "Low" },
          { label: "Medium", value: "Medium" },
          { label: "High", value: "High" },
        ]}
      />

      <label className="flex items-center gap-3 font-semibold">
        <input
          type="checkbox"
          name="active"
          defaultChecked={disruption?.active ?? true}
          className="h-5 w-5 rounded border-gray-300"
        />
        Active (show on Flight Disruptions page)
      </label>

      <AdminButton>{submitLabel}</AdminButton>

    </form>
  );
}
