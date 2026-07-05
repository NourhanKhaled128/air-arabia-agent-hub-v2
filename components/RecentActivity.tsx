const activity = [
  {
    title: "Refund Policy Updated",
    description: "New refund workflow published.",
    time: "10 min ago",
  },
  {
    title: "Airport Alert",
    description: "SHJ operational update.",
    time: "45 min ago",
  },
  {
    title: "Training Published",
    description: "Customer Service Refresher.",
    time: "2 hrs ago",
  },
  {
    title: "Reservation SOP",
    description: "Flight Change procedure updated.",
    time: "Today",
  },
  {
    title: "Payment Guide",
    description: "New payment process.",
    time: "Today",
  },
];

export default function RecentActivity() {
  return (
    <section className="h-[420px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Recent Activity

        </h2>

        <button className="text-sm font-semibold text-red-700">

          View All

        </button>

      </div>

      <div className="h-[300px] space-y-4 overflow-y-auto pr-2">

        {activity.map((item) => (

          <div
            key={item.title}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:bg-red-50"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold">

                {item.title}

              </h3>

              <span className="text-sm text-gray-500">

                {item.time}

              </span>

            </div>

            <p className="mt-2 text-gray-600">

              {item.description}

            </p>

          </div>

        ))}

      </div>

    </section>
  );
}