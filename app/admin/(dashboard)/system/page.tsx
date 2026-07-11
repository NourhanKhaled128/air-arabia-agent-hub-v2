import AdminPageHeader from "@/components/admin/AdminPageHeader";
import NotAvailableNotice from "@/components/admin/NotAvailableNotice";

export default function SystemPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="System Health"
        description="Server metrics aren't collected by this application yet."
      />

      <NotAvailableNotice message="No server-metrics collection (CPU, memory, uptime) is wired up in this environment yet." />
    </div>
  );
}
