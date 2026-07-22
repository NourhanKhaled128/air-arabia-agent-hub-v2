export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import AnnouncementsList from "@/components/AnnouncementsList";
import { getPublishedAnnouncements } from "@/lib/announcement-service";
import { isSidebarLinkEnabled } from "@/lib/sidebar-service";
import { getCurrentPortalUser } from "@/lib/portal-dal";

export default async function AnnouncementsPage() {
  if (!(await isSidebarLinkEnabled("/Announcements"))) notFound();

  const user = await getCurrentPortalUser();
  const announcements = await getPublishedAnnouncements(user?.teamId ?? null);

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Company-wide updates and heads-up notices — tap one to read the full message."
      />

      <AnnouncementsList announcements={announcements} />
    </>
  );
}
