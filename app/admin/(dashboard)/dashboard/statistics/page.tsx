import {
  TrendingUp,
  Users,
  BookOpen,
  Eye,
} from "lucide-react";

export default function StatisticsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Statistics
        </h1>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <Users className="mb-4 text-red-700" />
          <p>Users</p>
          <h2 className="text-4xl font-bold mt-2">
            132
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <BookOpen className="mb-4 text-blue-700" />
          <p>Articles</p>
          <h2 className="text-4xl font-bold mt-2">
            379
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <Eye className="mb-4 text-emerald-700" />
          <p>Views</p>
          <h2 className="text-4xl font-bold mt-2">
            84,312
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <TrendingUp className="mb-4 text-violet-700" />
          <p>Growth</p>
          <h2 className="text-4xl font-bold mt-2">
            +18%
          </h2>
        </div>

      </div>

    </div>
  );
}