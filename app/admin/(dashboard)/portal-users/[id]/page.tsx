import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import PortalUserForm from "@/components/admin/portal-users/PortalUserForm";
import { getPortalUserById } from "@/lib/portal-user-service";
import { updatePortalUserAction } from "@/app/admin/actions/portal-user-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPortalUserPage({ params }: Props) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    notFound();
  }

  const user = await getPortalUserById(userId);

  if (!user) {
    notFound();
  }

  const boundUpdate = updatePortalUserAction.bind(null, userId);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Edit Agent"
        breadcrumbs={[{ label: "Agent Accounts", href: "/admin/portal-users" }, { label: user.name }]}
      />

      <AdminFormCard title="Agent Details">
        <PortalUserForm
          action={boundUpdate}
          submitLabel="Save Changes"
          user={user}
          passwordRequired={false}
        />
      </AdminFormCard>
    </div>
  );
}
