"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const statuses = [
  "Draft",
  "Review",
  "Published",
  "Archived",
];

export default function ArticleStatusSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="font-semibold">
        Status
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3"
      >
        {statuses.map((status) => (
          <option
            key={status}
            value={status}
          >
            {status}
          </option>
        ))}
      </select>

    </div>
  );
}