import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-16 text-center shadow-sm">

      <Icon
        size={60}
        className="mx-auto text-red-700"
      />

      <h2 className="mt-6 text-2xl font-bold">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-slate-500">
        {description}
      </p>

    </div>
  );
}