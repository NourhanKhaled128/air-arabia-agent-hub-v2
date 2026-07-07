import Link from "next/link";
import { getVisibleSidebarLinksBySection } from "@/lib/sidebar-service";
import { getSidebarIcon } from "@/lib/sidebar-icons";

export default async function QuickActions() {

  const actions = await getVisibleSidebarLinksBySection("quickActions");

  return (

    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        Quick Actions
      </h2>

      {actions.length === 0 ? (

        <p className="text-gray-500">
          No quick actions configured yet.
        </p>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {actions.map((action) => {

            const Icon = getSidebarIcon(action.icon);

            return (

              <Link
                key={action.id}
                href={action.href}
                className="rounded-2xl border border-gray-200 p-6 transition hover:border-red-600 hover:shadow-md"
              >

                <Icon
                  className="mb-4 text-red-700"
                  size={30}
                />

                <h3 className="font-semibold">

                  {action.label}

                </h3>

              </Link>

            );

          })}

        </div>

      )}

    </section>

  );

}
