import {
  Shield,
  Users,
  CheckCircle2,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

const roles = [
  {
    id: 1,
    name: "Administrator",
    users: 5,
    permissions: 42,
    color: "bg-red-100 text-red-700",
  },
  {
    id: 2,
    name: "Supervisor",
    users: 18,
    permissions: 31,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    name: "Agent",
    users: 121,
    permissions: 14,
    color: "bg-emerald-100 text-emerald-700",
  },
];

export default function RolesPage() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Roles & Permissions
          </h1>

          <p className="mt-3 text-slate-500">
            Manage user roles and access permissions.
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
          <Plus size={18} />
          New Role
        </button>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        {roles.map((role) => (

          <div
            key={role.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >

            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${role.color}`}
            >
              {role.name}
            </span>

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Users</span>
                <span className="font-bold">{role.users}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Permissions</span>
                <span className="font-bold">{role.permissions}</span>
              </div>

            </div>

            <div className="mt-8 flex gap-2">

              <button className="rounded-lg border p-2 hover:bg-slate-50">
                <Pencil size={18} />
              </button>

              <button className="rounded-lg border p-2 hover:bg-slate-50">
                <Trash2 size={18} />
              </button>

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}