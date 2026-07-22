import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import PortalUserForm from "@/components/admin/portal-users/PortalUserForm";
import { createPortalUserAction } from "@/app/admin/actions/portal-user-actions";

export default async function NewPortalUserPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New Agent"
        breadcrumbs={[{ label: "Agent Accounts", href: "/admin/portal-users" }, { label: "New Agent" }]}
      />

      <AdminFormCard title="Agent Details">
        <PortalUserForm action={createPortalUserAction} />
      </AdminFormCard>
    </div>
  );
}
