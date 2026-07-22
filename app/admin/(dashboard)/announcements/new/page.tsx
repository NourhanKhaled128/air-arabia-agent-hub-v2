import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AnnouncementComposer from "@/components/admin/announcement/AnnouncementComposer";
import { createAnnouncementAction } from "@/app/admin/actions/announcement-actions";
import { getTeams } from "@/lib/team-service";

export default async function NewAnnouncementPage() {
  const teams = await getTeams();

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="New Announcement"
        breadcrumbs={[{ label: "Announcements", href: "/admin/announcements" }, { label: "New Announcement" }]}
      />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <AnnouncementComposer action={createAnnouncementAction} teams={teams} />
      </div>

    </div>
  );
}
