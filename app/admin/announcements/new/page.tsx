import AnnouncementComposer from "@/components/admin/announcement/AnnouncementComposer";
import { createAnnouncementAction } from "@/app/admin/actions/announcement-actions";

export default function NewAnnouncementPage() {
  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          New Announcement
        </h1>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <AnnouncementComposer action={createAnnouncementAction} />
      </div>

    </div>
  );
}
