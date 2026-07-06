import { notFound } from "next/navigation";
import AnnouncementComposer from "@/components/admin/announcement/AnnouncementComposer";
import { getAnnouncementById } from "@/lib/announcement-service";
import { updateAnnouncementAction } from "@/app/admin/actions/announcement-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: Props) {
  const { id } = await params;
  const announcementId = Number(id);

  if (!Number.isInteger(announcementId)) {
    notFound();
  }

  const announcement = await getAnnouncementById(announcementId);

  if (!announcement) {
    notFound();
  }

  const boundUpdate = updateAnnouncementAction.bind(null, announcementId);

  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Edit Announcement
        </h1>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <AnnouncementComposer
          action={boundUpdate}
          submitLabel="Save Changes"
          announcement={announcement}
        />
      </div>

    </div>
  );
}
