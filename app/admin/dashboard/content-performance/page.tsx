import {
  Eye,
  TrendingUp,
  BookOpen,
} from "lucide-react";

const articles = [
  {
    title: "Refund Policy",
    views: "8,241",
    trend: "+12%",
  },
  {
    title: "Baggage Policy",
    views: "7,011",
    trend: "+8%",
  },
  {
    title: "Seat Selection",
    views: "6,335",
    trend: "+6%",
  },
  {
    title: "Schedule Change",
    views: "5,114",
    trend: "+4%",
  },
];

export default function ContentPerformancePage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Content Performance
        </h1>

      </div>

      <div className="space-y-5">

        {articles.map((article) => (

          <div
            key={article.title}
            className="rounded-3xl bg-white p-6 shadow-sm flex items-center justify-between"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-xl bg-red-100 p-4">

                <BookOpen className="text-red-700" />

              </div>

              <div>

                <h2 className="font-semibold">
                  {article.title}
                </h2>

                <div className="mt-2 flex items-center gap-4 text-slate-500">

                  <span className="flex items-center gap-2">

                    <Eye size={16} />

                    {article.views}

                  </span>

                </div>

              </div>

            </div>

            <div className="flex items-center gap-2 text-emerald-600 font-semibold">

              <TrendingUp size={18} />

              {article.trend}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}