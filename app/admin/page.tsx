import DashboardCards from "@/components/AdminDashboardCard";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome to the Air Arabia Content Management System.
          </p>

        </div>

        <Link
          href="/admin/articles/new"
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          + New Article
        </Link>

      </div>

      <DashboardCards />

      <div className="grid gap-8 xl:grid-cols-2">

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold">

            Recent Activity

          </h2>

          <div className="mt-6 space-y-5">

            <div className="rounded-xl bg-gray-50 p-4">

              No activity yet.

            </div>

          </div>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold">

            Quick Actions

          </h2>

          <div className="mt-6 flex flex-wrap gap-4">

            <Link
              href="/admin/articles/new"
              className="rounded-xl bg-red-700 px-6 py-3 text-white"
            >
              Add Article
            </Link>

            <Link
              href="/admin/categories"
              className="rounded-xl border px-6 py-3"
            >
              Categories
            </Link>

            <Link
              href="/admin/announcements"
              className="rounded-xl border px-6 py-3"
            >
              Announcements
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}