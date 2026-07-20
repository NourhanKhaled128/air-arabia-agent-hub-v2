import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import RoleForm from "@/components/admin/roles/RoleForm";
import { getRoleById } from "@/lib/role-service";
import { updateRoleAction } from "@/app/admin/actions/role-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRolePage({ params }: Props) {
  const { id } = await params;
  const roleId = Number(id);

  if (!Number.isInteger(roleId)) {
    notFound();
  }

  const role = await getRoleById(roleId);

  if (!role) {
    notFound();
  }

  const boundUpdate = updateRoleAction.bind(null, roleId);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Edit Role"
        breadcrumbs={[{ label: "Roles", href: "/admin/roles" }, { label: role.name }]}
      />

      <AdminFormCard title="Role Details">
        <RoleForm
          action={boundUpdate}
          submitLabel="Save Changes"
          role={role}
        />
      </AdminFormCard>
    </div>
  );
}
