import { getActiveDisruptions } from "@/lib/disruption-service";

const levelStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

export default async function AirportAlerts() {
  const alerts = await getActiveDisruptions();

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        No active disruptions right now.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-red-600 hover:shadow-lg"
        >
          <div className="flex justify-between">

            <h3 className="font-bold text-black">
              {alert.airportCode}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                levelStyles[alert.level] ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {alert.level}
            </span>

          </div>

          <p className="mt-3 text-gray-700">
            {alert.message}
          </p>

        </div>
      ))}
    </div>
  );
}
