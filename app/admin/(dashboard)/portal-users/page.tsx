import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import PortalUsersTable from "@/components/admin/portal-users/PortalUsersTable";
import { getPortalUsers } from "@/lib/portal-user-service";
import { UserCheck, Users as UsersIcon } from "lucide-react";

export default async function PortalUsersPage() {
  const users = await getPortalUsers();

  const activeCount = users.filter((u) => u.status === "Active").length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Agent Accounts"
        description="Manage who can log in to the Champion Hub portal (Knowledge Base, Quizzes, etc.)."
        actions={
          <AdminButton href="/admin/portal-users/new">
            + New Agent
          </AdminButton>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AdminStatCard title="Total Agents" value={users.length} icon={UsersIcon} />
        <AdminStatCard title="Active" value={activeCount} icon={UserCheck} color="text-emerald-700" />
      </div>

      <PortalUsersTable users={users} />
    </div>
  );
}
