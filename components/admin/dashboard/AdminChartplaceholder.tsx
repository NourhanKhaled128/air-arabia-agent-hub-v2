import { BarChart3 } from "lucide-react";

export default function AdminChartPlaceholder() {
  return (
    <div className="flex h-[400px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white">

      <div className="text-center">

        <BarChart3
          size={70}
          className="mx-auto text-red-700"
        />

        <h2 className="mt-6 text-2xl font-bold">
          Analytics Chart
        </h2>

        <p className="mt-3 text-slate-500">
          Charts will be connected to live data later.
        </p>

      </div>

    </div>
  );
}