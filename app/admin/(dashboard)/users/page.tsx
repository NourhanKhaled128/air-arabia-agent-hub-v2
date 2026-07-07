import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import UserRowActions from "@/components/admin/users/UserRowActions";
import { getUsers } from "@/lib/user-service";
import { UserCheck, Shield, Users as UsersIcon } from "lucide-react";

export default async function UsersPage() {
  const users = await getUsers();

  const activeCount = users.filter((u) => u.status === "Active").length;
  const adminCount = users.filter((u) => u.role.name === "Administrator").length;

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

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-6 py-5 font-semibold">{user.name}</td>
                <td className="px-6 py-5 text-slate-600">{user.email}</td>
                <td className="px-6 py-5">
                  <AdminBadge color="blue">{user.role.name}</AdminBadge>
                </td>
                <td className="px-6 py-5">
                  <AdminBadge color={user.status === "Active" ? "green" : "gray"}>
                    {user.status}
                  </AdminBadge>
                </td>
                <td className="px-6 py-5">
                  <UserRowActions id={user.id} />
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
