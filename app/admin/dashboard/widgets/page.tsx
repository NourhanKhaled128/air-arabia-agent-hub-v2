import {
  Clock3,
  Bell,
  BookOpen,
  UserCheck,
} from "lucide-react";

export default function DashboardWidgetsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Widgets
        </h1>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <Clock3 className="mb-5 text-red-700"/>
          <h2 className="font-bold text-xl">
            Pending Reviews
          </h2>
          <p className="mt-3 text-4xl font-bold">
            9
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <Bell className="mb-5 text-amber-600"/>
          <h2 className="font-bold text-xl">
            Active Announcements
          </h2>
          <p className="mt-3 text-4xl font-bold">
            18
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <BookOpen className="mb-5 text-blue-700"/>
          <h2 className="font-bold text-xl">
            Draft Articles
          </h2>
          <p className="mt-3 text-4xl font-bold">
            27
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <UserCheck className="mb-5 text-emerald-700"/>
          <h2 className="font-bold text-xl">
            Online Users
          </h2>
          <p className="mt-3 text-4xl font-bold">
            41
          </p>
        </div>

      </div>

    </div>
  );
}