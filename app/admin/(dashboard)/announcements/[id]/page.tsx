import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AnnouncementComposer from "@/components/admin/announcement/AnnouncementComposer";
import { getAnnouncementById } from "@/lib/announcement-service";
import { updateAnnouncementAction } from "@/app/admin/actions/announcement-actions";
import { getTeams } from "@/lib/team-service";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: Props) {
  const { id } = await params;
  const announcementId = Number(id);

  if (!Number.isInteger(announcementId)) {
    notFound();
  }

  const [announcement, teams] = await Promise.all([getAnnouncementById(announcementId), getTeams()]);

  if (!announcement) {
    notFound();
  }

  const boundUpdate = updateAnnouncementAction.bind(null, announcementId);

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Edit Announcement"
        breadcrumbs={[{ label: "Announcements", href: "/admin/announcements" }, { label: announcement.title }]}
      />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <AnnouncementComposer
          action={boundUpdate}
          submitLabel="Save Changes"
          announcement={announcement}
          teams={teams}
        />
      </div>

    </div>
  );
}
