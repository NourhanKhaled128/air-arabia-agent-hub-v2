import {
  Search,
  Clock3,
  TrendingUp,
} from "lucide-react";

const searches = [
  {
    id: 1,
    keyword: "Refund Voucher",
    count: 284,
    lastSearch: "2 min ago",
  },
  {
    id: 2,
    keyword: "Baggage Policy",
    count: 241,
    lastSearch: "5 min ago",
  },
  {
    id: 3,
    keyword: "Seat Selection",
    count: 198,
    lastSearch: "8 min ago",
  },
  {
    id: 4,
    keyword: "No Show",
    count: 164,
    lastSearch: "15 min ago",
  },
];

export default function RecentSearchesPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Recent Searches
        </h1>

      </div>

      <div className="rounded-3xl bg-white shadow-sm overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Keyword
              </th>

              <th className="px-6 py-4 text-left">
                Searches
              </th>

              <th className="px-6 py-4 text-left">
                Last Search
              </th>

            </tr>

          </thead>

          <tbody>

            {searches.map((item) => (

              <tr
                key={item.id}
                className="border-t"
              >

                <td className="px-6 py-5 flex items-center gap-3">

                  <Search
                    className="text-red-700"
                    size={18}
                  />

                  {item.keyword}

                </td>

                <td className="px-6 py-5">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">

                    {item.count}

                  </span>

                </td>

                <td className="px-6 py-5 flex items-center gap-2">

                  <Clock3 size={16} />

                  {item.lastSearch}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <div className="flex items-center gap-3">

          <TrendingUp className="text-red-700" />

          <h2 className="text-2xl font-bold">
            Trending Topics
          </h2>

        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          {[
            "Refund",
            "Voucher",
            "SSR",
            "No Show",
            "Schedule Change",
            "Baggage",
            "EMD",
            "Payment",
          ].map((tag) => (

            <span
              key={tag}
              className="rounded-full bg-red-100 px-4 py-2 text-red-700 font-medium"
            >
              {tag}
            </span>

          ))}

        </div>

      </div>

    </div>
  );
}