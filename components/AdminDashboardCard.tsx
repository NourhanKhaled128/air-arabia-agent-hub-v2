import {
  FileText,
  Folder,
  Megaphone,
  GraduationCap,
} from "lucide-react";

const cards = [
  {
    title: "Articles",
    value: "0",
    color: "text-red-700",
    icon: FileText,
  },
  {
    title: "Categories",
    value: "0",
    color: "text-blue-700",
    icon: Folder,
  },
  {
    title: "Announcements",
    value: "0",
    color: "text-green-700",
    icon: Megaphone,
  },
  {
    title: "Training",
    value: "0",
    color: "text-orange-600",
    icon: GraduationCap,
  },
];

export default function DashboardCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="rounded-3xl bg-white p-7 shadow-sm transition hover:shadow-lg"
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