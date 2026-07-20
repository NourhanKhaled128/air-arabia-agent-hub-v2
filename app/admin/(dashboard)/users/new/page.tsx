import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import UserForm from "@/components/admin/users/UserForm";
import { getRoles } from "@/lib/role-service";
import { createUserAction } from "@/app/admin/actions/user-actions";

export default async function NewUserPage() {
  const roles = await getRoles();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New User"
        breadcrumbs={[{ label: "Users", href: "/admin/users" }, { label: "New User" }]}
      />

      <AdminFormCard title="User Details">
        <UserForm action={createUserAction} roles={roles} />
      </AdminFormCard>
    </div>
  );
}
