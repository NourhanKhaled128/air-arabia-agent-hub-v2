import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import RolesGrid from "@/components/admin/roles/RolesGrid";
import { getRoles } from "@/lib/role-service";

export default async function RolesPage() {
  const roles = await getRoles();

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Roles & Permissions"
        description="Manage user roles and access permissions."
        actions={
          <AdminButton href="/admin/roles/new">
            + New Role
          </AdminButton>
        }
      />

      <RolesGrid roles={roles} />
    </div>
  );
}
