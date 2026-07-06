import { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
}

export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  color = "text-red-700",
  subtitle,
}: AdminStatCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className={`mb-5 inline-flex rounded-2xl bg-slate-100 p-4 ${color}`}>
        <Icon size={28} />
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold">
        {value}
      </h2>

      {subtitle && (
        <p className="mt-3 text-sm text-slate-400">
          {subtitle}
        </p>
      )}

    </div>
  );
}