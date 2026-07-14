import AdminInput from "../AdminInput";

interface Airport {
  code: string;
  city: string;
  airport: string;
  country: string;
  terminal?: string | null;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  airport?: Airport;
}

export default function AirportComposer({
  action,
  submitLabel = "Save Airport",
  airport,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <div className="grid gap-6 md:grid-cols-2">

        <AdminInput
          name="code"
          label="Code"
          placeholder="e.g. JED"
          defaultValue={airport?.code}
          required
        />

        <AdminInput
          name="city"
          label="City"
          placeholder="e.g. Jeddah"
          defaultValue={airport?.city}
          required
        />

      </div>

      <AdminInput
        name="airport"
        label="Airport"
        placeholder="e.g. King Abdulaziz International Airport"
        defaultValue={airport?.airport}
        required
      />

      <div className="grid gap-6 md:grid-cols-2">

        <AdminInput
          name="country"
          label="Country"
          placeholder="e.g. Saudi Arabia"
          defaultValue={airport?.country}
          required
        />

        <AdminInput
          name="terminal"
          label="Terminal"
          placeholder="e.g. Terminal 4"
          defaultValue={airport?.terminal ?? ""}
        />

      </div>

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
