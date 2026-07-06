import Link from "next/link";
import DashboardCards from "@/components/AdminDashboardCard";

const modules = [
  {
    title: "Knowledge Base",
    description: "Create, edit, publish and archive knowledge articles.",
    href: "/admin/articles",
    color: "bg-red-700",
  },
  {
    title: "Categories",
    description: "Manage article categories and organization.",
    href: "/admin/categories",
    color: "bg-blue-700",
  },
  {
    title: "Announcements",
    description: "Publish announcements for all agents.",
    href: "/admin/announcements",
    color: "bg-amber-600",
  },
  {
    title: "Training",
    description: "Manage courses, lessons and quizzes.",
    href: "/admin/training",
    color: "bg-emerald-700",
  },
  {
    title: "Users",
    description: "Manage users, supervisors and administrators.",
    href: "/admin/users",
    color: "bg-violet-700",
  },
  {
    title: "Settings",
    description: "Configure the Agent Hub platform.",
    href: "/admin/settings",
    color: "bg-slate-700",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Air Arabia Agent Hub
          </h1>

          <p className="mt-3 max-w-3xl text-slate-500">
            Manage articles, categories, announcements, training,
            users, media and system configuration from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/articles/new"
            className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
          >
            New Article
          </Link>

          <Link
            href="/admin/articles"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-50"
          >
            Manage Articles
          </Link>
        </div>
      </div>

      <DashboardCards />

      <section>
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          Administration Modules
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-6 h-3 w-20 rounded-full ${module.color}`}
              />

              <h3 className="text-xl font-bold text-slate-900">
                {module.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {module.description}
              </p>

              <div className="mt-8 font-semibold text-red-700">
                Open Module →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            Recent Activity
          </h2>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No recent activity available.
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            Quick Actions
          </h2>

          <div className="mt-6 grid gap-4">
            <Link
              href="/admin/articles/new"
              className="rounded-xl bg-red-700 px-5 py-4 text-center font-semibold text-white hover:bg-red-800"
            >
              Create New Knowledge Article
            </Link>

            <Link
              href="/admin/categories"
              className="rounded-xl border px-5 py-4 text-center font-semibold hover:bg-slate-50"
            >
              Manage Categories
            </Link>

            <Link
              href="/admin/announcements"
              className="rounded-xl border px-5 py-4 text-center font-semibold hover:bg-slate-50"
            >
              Publish Announcement
            </Link>

            <Link
              href="/admin/training"
              className="rounded-xl border px-5 py-4 text-center font-semibold hover:bg-slate-50"
            >
              Training Center
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}