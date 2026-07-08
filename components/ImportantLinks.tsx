import { ExternalLink } from "lucide-react";
import { getVisibleImportantLinks } from "@/lib/important-link-service";
import { getSidebarIcon } from "@/lib/sidebar-icons";

export default async function ImportantLinks() {

  const links = await getVisibleImportantLinks();

  return (

    <section className="h-[360px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Important Links

        </h2>

      </div>

      <div className="mt-6 space-y-3 overflow-y-auto h-[250px] pr-2">

        {links.length === 0 && (
          <p className="text-gray-500">No important links yet.</p>
        )}

        {links.map((link) => {
          const Icon = getSidebarIcon(link.icon);

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4 transition hover:bg-red-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <Icon size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{link.title}</h3>

                {link.description && (
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {link.description}
                  </p>
                )}
              </div>

              <ExternalLink size={16} className="shrink-0 text-gray-400" />
            </a>
          );
        })}

      </div>

    </section>

  );

}
