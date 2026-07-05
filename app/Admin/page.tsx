import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Megaphone,
  GraduationCap,
} from "lucide-react";

const cards = [
  {
    title: "Articles",
    value: "0",
    icon: FileText,
    href: "/admin/articles",
  },
  {
    title: "Categories",
    value: "0",
    icon: FolderOpen,
    href: "/admin/categories",
  },
  {
    title: "Announcements",
    value: "0",
    icon: Megaphone,
    href: "/admin/announcements",
  },
  {
    title: "Training",
    value: "0",
    icon: GraduationCap,
    href: "/admin/training",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome to the Air Arabia CMS.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => {

          const Icon = card.icon;

          return (

            <Link
              key={card.title}
              href={card.href}
              className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-lg"
            >

              <Icon
                className="mb-5 text-red-700"
                size={34}
              />

              <p className="text-gray-500">

                {card.title}

              </p>

              <h2 className="mt-3 text-5xl font-bold">

                {card.value}

              </h2>

            </Link>

          );

        })}

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">

          Quick Actions

        </h2>

        <div className="mt-6 flex flex-wrap gap-4">

          <Link
            href="/admin/articles/new"
            className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            + New Article
          </Link>

          <Link
            href="/admin/categories"
            className="rounded-xl border px-6 py-3 font-semibold"
          >
            Categories
          </Link>

          <Link
            href="/admin/announcements"
            className="rounded-xl border px-6 py-3 font-semibold"
          >
            Announcements
          </Link>

        </div>

      </div>

    </div>
  );
}