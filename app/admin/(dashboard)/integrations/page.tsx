import AdminPageHeader from "@/components/admin/AdminPageHeader";
import NotAvailableNotice from "@/components/admin/NotAvailableNotice";

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Integrations"
        description="No third-party services are connected to the Agent Hub yet."
      />

      <NotAvailableNotice message="No external integrations (cloud storage, email, analytics, etc.) are configured for this application yet." />
    </div>
  );
}
