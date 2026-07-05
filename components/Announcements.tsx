const announcements = [
  {
    title: "New Refund Policy",
    date: "Today",
  },
  {
    title: "Schedule Change Procedure Updated",
    date: "Yesterday",
  },
  {
    title: "Airport Alert - SHJ",
    date: "2 days ago",
  },
  {
    title: "Training Session Available",
    date: "3 days ago",
  },
];

export default function Announcements() {

  return (

    <section className="h-[360px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Announcements

        </h2>

        <button className="text-sm font-semibold text-red-700">

          View All

        </button>

      </div>

      <div className="mt-6 space-y-5 overflow-y-auto h-[250px] pr-2">

        {announcements.map((item) => (

          <div
            key={item.title}
            className="rounded-2xl border border-gray-100 p-4 transition hover:bg-red-50"
          >

            <h3 className="font-semibold">

              {item.title}

            </h3>

            <p className="mt-2 text-sm text-gray-500">

              {item.date}

            </p>

          </div>

        ))}

      </div>

    </section>

  );

}