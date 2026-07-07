import {
  Search,
  BookOpen,
  FolderOpen,
  Bell,
} from "lucide-react";

export default function AdminSearchPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Global Search
        </h1>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <div className="flex items-center gap-4 rounded-xl border px-5 py-4">

          <Search className="text-slate-500"/>

          <input
            className="w-full outline-none"
            placeholder="Search articles, users, announcements..."
          />

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <BookOpen className="mb-4 text-red-700"/>

          <h2 className="font-bold text-xl">
            Articles
          </h2>

          <p className="mt-3 text-slate-500">
            Search all published and draft articles.
          </p>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <FolderOpen className="mb-4 text-blue-700"/>

          <h2 className="font-bold text-xl">
            Categories
          </h2>

          <p className="mt-3 text-slate-500">
            Search categories and subcategories.
          </p>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <Bell className="mb-4 text-amber-600"/>

          <h2 className="font-bold text-xl">
            Announcements
          </h2>

          <p className="mt-3 text-slate-500">
            Search internal announcements.
          </p>

        </div>

      </div>

    </div>
  );
}