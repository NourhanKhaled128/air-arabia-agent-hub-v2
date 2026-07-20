import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import RoleForm from "@/components/admin/roles/RoleForm";
import { createRoleAction } from "@/app/admin/actions/role-actions";

export default function NewRolePage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New Role"
        breadcrumbs={[{ label: "Roles", href: "/admin/roles" }, { label: "New Role" }]}
      />

      <AdminFormCard title="Role Details">
        <RoleForm action={createRoleAction} />
      </AdminFormCard>
    </div>
  );
}
