"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import PortalUserRowActions from "./PortalUserRowActions";
import { deleteManyPortalUsersAction } from "@/app/admin/actions/portal-user-actions";

interface PortalUser {
  id: number;
  name: string;
  email: string;
  status: string;
  lastLoginAt: Date | null;
  team: { name: string } | null;
}

interface Props {
  users: PortalUser[];
}

export default function PortalUsersTable({ users }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status" },
        { key: "team", label: "Team" },
        { key: "lastLoginAt", label: "Last Login" },
      ]}
      data={users}
      searchPlaceholder="Search agents..."
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
      ]}
      filterFn={(user, values) => {
        if (values.status && user.status !== values.status) return false;
        return true;
      }}
      onDeleteMany={deleteManyPortalUsersAction}
      emptyMessage="No agent accounts yet."
      renderRow={(user) => (
        <>
          <td className="px-6 py-5 font-semibold">{user.name}</td>
          <td className="px-6 py-5 text-slate-600">{user.email}</td>
          <td className="px-6 py-5">
            <AdminBadge color={user.status === "Active" ? "green" : "gray"}>
              {user.status}
            </AdminBadge>
          </td>
          <td className="px-6 py-5 text-slate-600">{user.team?.name ?? "—"}</td>
          <td className="px-6 py-5 text-slate-600">
            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}
          </td>
          <td className="px-6 py-5">
            <PortalUserRowActions id={user.id} />
          </td>
        </>
      )}
    />
  );
}
