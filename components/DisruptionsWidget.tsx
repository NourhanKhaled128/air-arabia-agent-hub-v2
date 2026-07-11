import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getActiveDisruptions } from "@/lib/disruption-service";

const levelStyles: Record<string, string> = {
  High: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400",
  Medium: "bg-yellow-100 dark:bg-amber-950/40 text-yellow-700 dark:text-amber-400",
  Low: "bg-green-100 dark:bg-emerald-950/40 text-green-700 dark:text-emerald-400",
};

export default async function DisruptionsWidget() {

  const disruptions = await getActiveDisruptions();

  return (

    <section className="h-[360px] rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Flight Disruptions

        </h2>

        <Link
          href="/disruptions"
          className="text-sm font-semibold text-red-700 dark:text-brand"
        >
          View All
        </Link>

      </div>

      <div className="mt-6 space-y-4 overflow-y-auto h-[250px] pr-2">

        {disruptions.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-gray-500 dark:text-slate-400">
            <AlertTriangle size={28} className="text-gray-300 dark:text-slate-600" />
            No active disruptions right now.
          </div>
        )}

        {disruptions.map((alert) => (

          <div
            key={alert.id}
            className="rounded-2xl border border-gray-100 dark:border-border-subtle p-4 transition hover:bg-red-50 dark:hover:bg-red-950/40"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-bold text-black dark:text-slate-100">

                {alert.airportCode}

              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  levelStyles[alert.level] ?? "bg-gray-100 dark:bg-background text-gray-700 dark:text-slate-300"
                }`}
              >
                {alert.level}
              </span>

            </div>

            <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">

              {alert.message}

            </p>

          </div>

        ))}

      </div>

    </section>

  );

}
