import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import RoleRowActions from "@/components/admin/roles/RoleRowActions";
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

      <div className="grid gap-6 md:grid-cols-3">

        {roles.map((role) => (

          <div
            key={role.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${role.color}`}
            >
              {role.name}
            </span>

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Users</span>
                <span className="font-bold">{role._count.users}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Permissions</span>
                <span className="font-bold">{role.permissions.length}</span>
              </div>

            </div>

            <div className="mt-8">
              <RoleRowActions id={role.id} />
            </div>

          </div>

        ))}

        {roles.length === 0 && (
          <p className="col-span-full py-10 text-center text-slate-500">
            No roles yet.
          </p>
        )}

      </div>
    </div>
  );
}
