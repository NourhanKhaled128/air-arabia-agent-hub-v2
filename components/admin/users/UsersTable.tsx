"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import UserRowActions from "./UserRowActions";
import { deleteManyUsersAction } from "@/app/admin/actions/user-actions";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  role: { name: string };
}

interface Props {
  users: User[];
  roleOptions: { value: string; label: string }[];
}

export default function UsersTable({ users, roleOptions }: Props) {
  return (
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
  );
}
