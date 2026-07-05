import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
}

export default function DashboardCard({
  title,
  children,
}: DashboardCardProps) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)]">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-red-700">
          {title}
        </h2>

        <button className="rounded-lg px-3 py-1 text-sm font-semibold text-red-700 transition hover:bg-red-50">
          View All
        </button>

      </div>

      {children}

    </section>
  );
}