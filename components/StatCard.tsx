import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200 hover:shadow-xl transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="mt-2 text-4xl font-bold text-black">
            {value}
          </h2>

        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}