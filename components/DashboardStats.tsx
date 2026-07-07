import {
  BookOpen,
  Bell,
  Folder,
  GraduationCap,
} from "lucide-react";
import { getDashboardStats } from "@/lib/dashboard-service";

export default async function DashboardStats() {
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Knowledge",
      value: stats.articles,
      subtitle: "Articles",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Notifications",
      value: stats.announcements,
      subtitle: "Announcements",
      icon: Bell,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Categories",
      value: stats.categories,
      subtitle: "Total",
      icon: Folder,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Training",
      value: stats.courses,
      subtitle: "Courses",
      icon: GraduationCap,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {item.subtitle}
                </p>

              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color}`}
              >

                <Icon size={30} />

              </div>

            </div>

          </div>

        );

      })}

    </section>
  );
}
