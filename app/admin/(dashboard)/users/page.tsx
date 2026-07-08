import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import UsersTable from "@/components/admin/users/UsersTable";
import { getUsers } from "@/lib/user-service";
import { UserCheck, Shield, Users as UsersIcon } from "lucide-react";

export default async function UsersPage() {
  const users = await getUsers();

  const activeCount = users.filter((u) => u.status === "Active").length;
  const adminCount = users.filter((u) => u.role.name === "Administrator").length;
  const roleOptions = Array.from(new Set(users.map((u) => u.role.name))).map((name) => ({
    value: name,
    label: name,
  }));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Users"
        description="Manage who has access to the Air Arabia admin CMS."
        actions={
          <AdminButton href="/admin/users/new">
            + New User
          </AdminButton>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <AdminStatCard title="Total Users" value={users.length} icon={UsersIcon} />
        <AdminStatCard title="Active" value={activeCount} icon={UserCheck} color="text-emerald-700" />
        <AdminStatCard title="Administrators" value={adminCount} icon={Shield} color="text-blue-700" />
      </div>

      <UsersTable users={users} roleOptions={roleOptions} />
    </div>
  );
}
