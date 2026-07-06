import {
  FolderOpen,
  TrendingUp,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Reservations",
    articles: 124,
    views: "32,841",
  },
  {
    id: 2,
    name: "Payments",
    articles: 67,
    views: "18,222",
  },
  {
    id: 3,
    name: "Baggage",
    articles: 39,
    views: "15,641",
  },
  {
    id: 4,
    name: "Policies",
    articles: 91,
    views: "13,115",
  },
];

export default function PopularCategoriesPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Popular Categories
        </h1>

      </div>

      <div className="space-y-5">

        {categories.map((category) => (

          <div
            key={category.id}
            className="rounded-3xl bg-white p-6 shadow-sm flex items-center justify-between"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-red-100 p-4">

                <FolderOpen className="text-red-700" />

              </div>

              <div>

                <h2 className="font-bold text-xl">
                  {category.name}
                </h2>

                <p className="text-slate-500">
                  {category.articles} Articles
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3 text-red-700 font-semibold">

              <TrendingUp size={18} />

              {category.views} Views

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}