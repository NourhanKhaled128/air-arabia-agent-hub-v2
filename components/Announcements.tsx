import { getLatestAnnouncements } from "@/lib/dashboard-service";
import { formatRelativeTime } from "@/lib/format";

export default async function Announcements() {

  const announcements = await getLatestAnnouncements();

  return (

    <section className="h-[360px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Announcements

        </h2>

      </div>

      <div className="mt-6 space-y-5 overflow-y-auto h-[250px] pr-2">

        {announcements.length === 0 && (
          <p className="text-gray-500">No announcements yet.</p>
        )}

        {announcements.map((item) => (

          <div
            key={item.id}
            className="rounded-2xl border border-gray-100 p-4 transition hover:bg-red-50"
          >

            <h3 className="font-semibold">

              {item.title}

            </h3>

            <p className="mt-2 text-sm text-gray-500">

              {formatRelativeTime(item.createdAt)}

            </p>

          </div>

        ))}

      </div>

    </section>

  );

}
