import Link from "next/link";
import {
  Clock3,
  Globe,
  DollarSign,
  Scale,
  Timer,
  Plane,
} from "lucide-react";

const actions = [
  {
    title: "Reservations",
    href: "/Reservations",
    icon: Plane,
  },
  {
    title: "Airport Codes",
    href: "/airport-codes",
    icon: Globe,
  },
  {
    title: "Currency",
    href: "/currency-converter",
    icon: DollarSign,
  },
  {
    title: "Time",
    href: "/time-converter",
    icon: Clock3,
  },
  {
    title: "Weight",
    href: "/weight-converter",
    icon: Scale,
  },
  {
    title: "Duration",
    href: "/flight-duration",
    icon: Timer,
  },
];

export default function QuickActions() {

  return (

    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <Link
              key={action.title}
              href={action.href}
              className="rounded-2xl border border-gray-200 p-6 transition hover:border-red-600 hover:shadow-md"
            >

              <Icon
                className="mb-4 text-red-700"
                size={30}
              />

              <h3 className="font-semibold">

                {action.title}

              </h3>

            </Link>

          );

        })}

      </div>

    </section>

  );

}