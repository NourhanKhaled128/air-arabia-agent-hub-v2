import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import UserForm from "@/components/admin/users/UserForm";
import { getUserById } from "@/lib/user-service";
import { getRoles } from "@/lib/role-service";
import { updateUserAction } from "@/app/admin/actions/user-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    notFound();
  }

  const [user, roles] = await Promise.all([
    getUserById(userId),
    getRoles(),
  ]);

  if (!user) {
    notFound();
  }

  const boundUpdate = updateUserAction.bind(null, userId);

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Edit User" />

      <AdminFormCard title="User Details">
        <UserForm
          action={boundUpdate}
          submitLabel="Save Changes"
          user={user}
          roles={roles}
          passwordRequired={false}
        />
      </AdminFormCard>
    </div>
  );
}
