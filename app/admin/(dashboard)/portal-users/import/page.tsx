import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import PortalUserImportForm from "@/components/admin/portal-users/PortalUserImportForm";

export default function ImportPortalUsersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Bulk Import Agents"
        breadcrumbs={[{ label: "Agent Accounts", href: "/admin/portal-users" }, { label: "Import" }]}
      />

      <AdminFormCard title="Upload CSV">
        <PortalUserImportForm />
      </AdminFormCard>
    </div>
  );
}
