import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AuditLogTable from "@/components/admin/AuditLogTable";
import { getAuditLogs } from "@/lib/audit-service";

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Audit Trail" />

      <AuditLogTable logs={logs} />
    </div>
  );
}
