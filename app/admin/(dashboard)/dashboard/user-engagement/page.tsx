import {
  Users,
  Clock3,
  Search,
  Eye,
} from "lucide-react";

export default function UserEngagementPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          User Engagement
        </h1>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <Users className="mb-4 text-red-700" />
          <p>Active Users</p>
          <h2 className="mt-2 text-4xl font-bold">
            97
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <Search className="mb-4 text-blue-700" />
          <p>Searches Today</p>
          <h2 className="mt-2 text-4xl font-bold">
            1,824
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <Eye className="mb-4 text-emerald-700" />
          <p>Article Views</p>
          <h2 className="mt-2 text-4xl font-bold">
            12,214
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <Clock3 className="mb-4 text-amber-600" />
          <p>Avg Session</p>
          <h2 className="mt-2 text-4xl font-bold">
            8m
          </h2>
        </div>

      </div>

    </div>
  );
}