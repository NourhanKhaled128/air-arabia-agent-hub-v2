export const dynamic = "force-dynamic";

import PageHeader from "@/components/PageHeader";
import AnnouncementsList from "@/components/AnnouncementsList";
import { getPlatformUpdates } from "@/lib/announcement-service";

export default async function WhatsNewPage() {
  const updates = await getPlatformUpdates();

  return (
    <>
      <PageHeader
        title="What's New"
        subtitle="A running changelog of updates to the Champion Hub itself — separate from individual article edits."
      />

      {updates.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
          <p className="text-gray-500 dark:text-slate-400">Nothing posted yet — check back soon.</p>
        </div>
      ) : (
        <AnnouncementsList announcements={updates} />
      )}
    </>
  );
}
