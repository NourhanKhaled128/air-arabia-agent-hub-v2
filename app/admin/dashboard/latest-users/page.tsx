import {
  UserPlus,
  Shield,
} from "lucide-react";

const users = [
  {
    id: 1,
    name: "Ahmed Hassan",
    role: "Agent",
    joined: "Today",
  },
  {
    id: 2,
    name: "Sara Ali",
    role: "Supervisor",
    joined: "Yesterday",
  },
  {
    id: 3,
    name: "Mohamed Omar",
    role: "Administrator",
    joined: "2 days ago",
  },
  {
    id: 4,
    name: "Fatma Khaled",
    role: "Agent",
    joined: "3 days ago",
  },
];

export default function LatestUsersPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Latest Users
        </h1>

      </div>

      <div className="space-y-4">

        {users.map((user) => (

          <div
            key={user.id}
            className="rounded-3xl bg-white p-6 shadow-sm flex items-center justify-between"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-full bg-red-100 p-4">

                <UserPlus className="text-red-700"/>

              </div>

              <div>

                <h2 className="font-semibold text-lg">
                  {user.name}
                </h2>

                <p className="text-slate-500">
                  Joined {user.joined}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">

              <Shield size={16}/>

              {user.role}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}