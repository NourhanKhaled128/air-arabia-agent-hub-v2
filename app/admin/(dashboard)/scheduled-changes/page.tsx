import { Clock, CheckCircle2, XCircle } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import ScheduledChangesTable from "@/components/admin/scheduled-changes/ScheduledChangesTable";
import { getAllScheduledChanges } from "@/lib/scheduled-change-service";

export default async function ScheduledChangesPage() {
  const changes = await getAllScheduledChanges();

  const pending = changes.filter((c) => c.status === "Pending").length;
  const applied = changes.filter((c) => c.status === "Applied").length;
  const failed = changes.filter((c) => c.status === "Failed").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Scheduled Changes"
        description="Article and decision tree edits staged to go live automatically on a future effective date. Nothing here changes until the cron applies it — use 'Schedule for later' on an article or decision tree's edit page to add one."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <AdminStatCard title="Pending" value={pending} icon={Clock} color="text-amber-700" />
        <AdminStatCard title="Applied" value={applied} icon={CheckCircle2} color="text-emerald-700" />
        <AdminStatCard title="Failed" value={failed} icon={XCircle} color="text-red-700" />
      </div>

      <ScheduledChangesTable changes={changes} />
    </div>
  );
}
