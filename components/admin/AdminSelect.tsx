interface Option {
  label: string;
  value: string;
}

interface Props
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
}

export default function AdminSelect({
  label,
  options,
  ...props
}: Props) {
  return (
    <div>

      <label className="mb-2 block font-semibold">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-600"
      >

        {options.map((option) => (

          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>

        ))}

      </select>

    </div>
  );
}