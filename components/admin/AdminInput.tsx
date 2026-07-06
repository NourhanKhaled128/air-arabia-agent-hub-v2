interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function AdminInput({
  label,
  ...props
}: Props) {
  return (
    <div>

      <label className="mb-2 block font-semibold">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-600"
      />

    </div>
  );
}