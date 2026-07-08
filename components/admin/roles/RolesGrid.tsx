"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import AdminBulkActionsBar from "@/components/admin/AdminBulkActionsBar";
import RoleRowActions from "./RoleRowActions";
import { deleteManyRolesAction } from "@/app/admin/actions/role-actions";

interface Role {
  id: number;
  name: string;
  color: string;
  permissions: string[];
  _count: { users: number };
}

interface Props {
  roles: Role[];
}

export default function RolesGrid({ roles }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((role) => role.name.toLowerCase().includes(q));
  }, [roles, query]);

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected role(s) permanently?`)) return;

    setDeleting(true);
    try {
      await deleteManyRolesAction(Array.from(selected));
      setSelected(new Set());
    } catch (error) {
      console.error(error);
      alert("Bulk delete failed. Make sure no users are assigned to the selected roles.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search roles..."
          className="w-full max-w-md rounded-xl border border-gray-300 py-3 pl-11 pr-4"
        />
      </div>

      <AdminBulkActionsBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
        onDelete={handleDeleteSelected}
        deleting={deleting}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {filtered.map((role) => (
          <div
            key={role.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${role.color}`}
              >
                {role.name}
              </span>

              <input
                type="checkbox"
                checked={selected.has(role.id)}
                onChange={() => toggle(role.id)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Users</span>
                <span className="font-bold">{role._count.users}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Permissions</span>
                <span className="font-bold">{role.permissions.length}</span>
              </div>
            </div>

            <div className="mt-8">
              <RoleRowActions id={role.id} />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-slate-500">
            {roles.length === 0 ? "No roles yet." : "No roles match your search."}
          </p>
        )}
      </div>
    </div>
  );
}
