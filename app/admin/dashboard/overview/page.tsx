import {
  BookOpen,
  FolderOpen,
  Bell,
  GraduationCap,
  Users,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Articles",
    value: "379",
    icon: BookOpen,
    color: "text-red-700",
  },
  {
    title: "Categories",
    value: "24",
    icon: FolderOpen,
    color: "text-blue-700",
  },
  {
    title: "Announcements",
    value: "18",
    icon: Bell,
    color: "text-amber-600",
  },
  {
    title: "Training",
    value: "42",
    icon: GraduationCap,
    color: "text-emerald-700",
  },
  {
    title: "Users",
    value: "132",
    icon: Users,
    color: "text-violet-700",
  },
  {
    title: "Monthly Views",
    value: "84,312",
    icon: TrendingUp,
    color: "text-sky-700",
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Overview
        </h1>

        <p className="mt-3 text-slate-500">
          Overall performance of the Agent Hub.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-8 shadow-sm"
            >
              <Icon
                className={`mb-5 ${item.color}`}
                size={30}
              />

              <p className="text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            Most Viewed Articles
          </h2>

          <div className="mt-6 space-y-4">

            <div className="flex justify-between rounded-xl border p-4">
              <span>Refund Policy</span>
              <span className="font-semibold">8,241</span>
            </div>

            <div className="flex justify-between rounded-xl border p-4">
              <span>Baggage Policy</span>
              <span className="font-semibold">6,884</span>
            </div>

            <div className="flex justify-between rounded-xl border p-4">
              <span>Seat Selection</span>
              <span className="font-semibold">5,417</span>
            </div>

          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            Recent Publications
          </h2>

          <div className="mt-6 space-y-4">

            <div className="rounded-xl border p-4">
              Summer Schedule Update
            </div>

            <div className="rounded-xl border p-4">
              New Refund Procedure
            </div>

            <div className="rounded-xl border p-4">
              Baggage SOP Revision
            </div>

            <div className="rounded-xl border p-4">
              Payment Policy Update
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}