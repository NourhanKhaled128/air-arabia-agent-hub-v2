import { Plus, Pencil, Trash2, Shield, UserCheck } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@airarabia.com",
    role: "Administrator",
    status: "Active",
  },
  {
    id: 2,
    name: "Reservations Supervisor",
    email: "supervisor@airarabia.com",
    role: "Supervisor",
    status: "Active",
  },
  {
    id: 3,
    name: "Agent One",
    email: "agent@airarabia.com",
    role: "Agent",
    status: "Inactive",
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Users
          </h1>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white">
          <Plus size={18} />
          New User
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <UserCheck className="mb-3 text-red-700" />
          <p>Total Users</p>
          <h2 className="text-3xl font-bold">132</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Shield className="mb-3 text-blue-700" />
          <p>Administrators</p>
          <h2 className="text-3xl font-bold">5</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p>Supervisors</p>
          <h2 className="text-3xl font-bold">14</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p>Agents</p>
          <h2 className="text-3xl font-bold">113</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-6 py-5 font-semibold">{user.name}</td>
                <td className="px-6 py-5">{user.email}</td>
                <td className="px-6 py-5">{user.role}</td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      user.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    <button className="rounded-lg border p-2">
                      <Pencil size={18} />
                    </button>
                    <button className="rounded-lg border p-2">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}