const alerts = [
  {
    airport: "SHJ",
    message: "Runway maintenance between 22:00 - 04:00",
    level: "High",
  },
  {
    airport: "CAI",
    message: "Heavy traffic expected today",
    level: "Medium",
  },
  {
    airport: "DAC",
    message: "Check-in counters relocated",
    level: "Low",
  },
];

export default function AirportAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.airport}
          className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-red-600 hover:shadow-lg"
        >
          <div className="flex justify-between">

            <h3 className="font-bold text-black">
              {alert.airport}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold
              ${
                alert.level === "High"
                  ? "bg-red-100 text-red-700"
                  : alert.level === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
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