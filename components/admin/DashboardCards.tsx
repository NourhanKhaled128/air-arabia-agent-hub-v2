import { prisma } from "@/lib/prisma";
import {
  FileText,
  Folder,
  GraduationCap,
  Megaphone,
} from "lucide-react";

export default async function DashboardCards() {

  const articleCount = await prisma.article.count();

  const cards = [
    {
      title: "Articles",
      value: articleCount,
      icon: FileText,
      color: "text-red-700",
    },
    {
      title: "Categories",
      value: 0,
      icon: Folder,
      color: "text-blue-700",
    },
    {
      title: "Announcements",
      value: 0,
      icon: Megaphone,
      color: "text-green-700",
    },
    {
      title: "Training",
      value: 0,
      icon: GraduationCap,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="rounded-3xl bg-white p-7 shadow-sm"
          >

            <Icon
              size={36}
              className={card.color}
            />

            <p className="mt-5 text-gray-500">
              {card.title}
            </p>

            <h2 className="mt-3 text-5xl font-bold">
              {card.value}
            </h2>

          </div>

        );

      })}

    </div>
  );
}