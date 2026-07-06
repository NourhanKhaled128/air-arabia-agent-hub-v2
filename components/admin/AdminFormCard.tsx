import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function AdminFormCard({
  title,
  description,
  children,
}: Props) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-slate-500">
            {description}
          </p>
        )}

      </div>

      {children}

    </div>
  );
}