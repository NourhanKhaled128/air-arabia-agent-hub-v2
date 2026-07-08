import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminListTable from "@/components/admin/AdminListTable";
import UserRowActions from "@/components/admin/users/UserRowActions";
import { getUsers } from "@/lib/user-service";
import { deleteManyUsersAction } from "@/app/admin/actions/user-actions";
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

      <AdminListTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
        ]}
        data={users}
        searchPlaceholder="Search users..."
        searchFn={(user, query) => {
          const q = query.toLowerCase();
          return (
            user.name.toLowerCase().includes(q) ||
            user.email.toLowerCase().includes(q)
          );
        }}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ],
          },
          {
            key: "role",
            label: "Role",
            options: roleOptions,
          },
        ]}
        filterFn={(user, values) => {
          if (values.status && user.status !== values.status) return false;
          if (values.role && user.role.name !== values.role) return false;
          return true;
        }}
        onDeleteMany={deleteManyUsersAction}
        emptyMessage="No users yet."
        renderRow={(user) => (
          <>
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
          </>
        )}
      />
    </div>
  );
}
