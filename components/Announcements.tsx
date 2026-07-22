import { getLatestAnnouncements } from "@/lib/dashboard-service";
import AnnouncementItem from "@/components/AnnouncementItem";
import { getCurrentPortalUser } from "@/lib/portal-dal";

export default async function Announcements() {

  const user = await getCurrentPortalUser();
  const announcements = await getLatestAnnouncements(user?.teamId ?? null);

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

          <AnnouncementItem
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            createdAt={item.createdAt}
          />

        ))}

      </div>

    </section>

  );

}
