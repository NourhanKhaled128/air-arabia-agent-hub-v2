const updates = [
  {
    title: "New baggage policy published",
    date: "Today",
  },
  {
    title: "AirRewards update released",
    date: "Today",
  },
  {
    title: "Airport operational notice",
    date: "Yesterday",
  },
  {
    title: "Schedule change procedure updated",
    date: "2 Days Ago",
  },
];

export default function RecentUpdates() {
  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div
          key={update.title}
          className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-red-600 hover:shadow-lg"
        >
          <div>
            <h3 className="font-semibold text-black group-hover:text-red-700">
              {update.title}
            </h3>

            <p className="mt-1 text-sm text-gray-700">
              {update.date}
            </p>
          </div>

          <div className="h-3 w-3 rounded-full bg-red-600"></div>
        </div>
      ))}
    </div>
  );
}