import { getActiveDisruptions } from "@/lib/disruption-service";

const levelStyles: Record<string, string> = {
  High: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400",
  Medium: "bg-yellow-100 dark:bg-amber-950/40 text-yellow-700 dark:text-amber-400",
  Low: "bg-green-100 dark:bg-emerald-950/40 text-green-700 dark:text-emerald-400",
};

export default async function AirportAlerts() {
  const alerts = await getActiveDisruptions();

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 text-center text-gray-500 dark:text-slate-400">
        No active disruptions right now.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-5 transition hover:border-red-600 hover:shadow-lg"
        >
          <div className="flex justify-between">

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

          <p className="mt-3 text-gray-700 dark:text-slate-300">
            {alert.message}
          </p>

        </div>
      ))}
    </div>
  );
}
