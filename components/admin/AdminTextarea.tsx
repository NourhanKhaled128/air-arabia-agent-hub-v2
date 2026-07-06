interface Props
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function AdminTextarea({
  label,
  ...props
}: Props) {
  return (
    <div>

      <label className="mb-2 block font-semibold">
        {label}
      </label>

      <textarea
        {...props}
        className="min-h-[180px] w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-600"
      />

    </div>
  );
}