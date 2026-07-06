"use client";

interface Props {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function AdminSwitch({
  label,
  checked,
  onChange,
}: Props) {
  return (
    <div className="flex items-center justify-between">

      <span className="font-medium">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-14 rounded-full transition ${
          checked
            ? "bg-red-700"
            : "bg-slate-300"
        }`}
      >

        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked
              ? "left-8"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}