import {
  BarChart3,
  Users,
  BookOpen,
  Search,
  TrendingUp,
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Analytics
        </h1>

      </div>

      <div className="grid gap-6 md:grid-cols-5">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Users className="mb-3 text-red-700" />
          <p>Total Users</p>
          <h2 className="text-3xl font-bold">132</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <BookOpen className="mb-3 text-blue-700" />
          <p>Articles</p>
          <h2 className="text-3xl font-bold">379</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Search className="mb-3 text-emerald-700" />
          <p>Searches</p>
          <h2 className="text-3xl font-bold">18,920</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <TrendingUp className="mb-3 text-amber-600" />
          <p>Views</p>
          <h2 className="text-3xl font-bold">84,312</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <BarChart3 className="mb-3 text-violet-700" />
          <p>Success Rate</p>
          <h2 className="text-3xl font-bold">96%</h2>
        </div>

      </div>

      <div className="rounded-3xl bg-white p-20 text-center shadow-sm text-slate-500">
        Charts will be added here.
      </div>

    </div>
  );
}