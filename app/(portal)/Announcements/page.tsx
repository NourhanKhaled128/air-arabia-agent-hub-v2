export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import AnnouncementItem from "@/components/AnnouncementItem";
import { getPublishedAnnouncements } from "@/lib/announcement-service";
import { isSidebarLinkEnabled } from "@/lib/sidebar-service";

export default async function AnnouncementsPage() {
  if (!(await isSidebarLinkEnabled("/Announcements"))) notFound();

  const announcements = await getPublishedAnnouncements();

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Company-wide updates and heads-up notices — tap one to read the full message."
      />

      {announcements.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-gray-500 dark:text-slate-400">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
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
      )}
    </>
  );
}
