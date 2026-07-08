import { ReactNode } from "react";

interface Props {
  badge?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function AdminPageHeader({
  badge = "Administration",
  title,
  description,
  actions,
}: Props) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">
          {badge}
        </p>

        <h1 className="mt-2 text-4xl font-bold dark:text-slate-100">
          {title}
        </h1>

        {description && (
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}

      </div>

      {actions && (
        <div className="flex flex-wrap gap-3">
          {actions}
        </div>
      )}

    </div>
  );
}