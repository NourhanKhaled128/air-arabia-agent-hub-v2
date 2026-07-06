import {
  Activity,
  FileText,
  Bell,
  Users,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Refund Policy Published",
    module: "Knowledge Base",
    icon: FileText,
    time: "5 minutes ago",
  },
  {
    id: 2,
    title: "Announcement Sent",
    module: "Announcements",
    icon: Bell,
    time: "20 minutes ago",
  },
  {
    id: 3,
    title: "New User Added",
    module: "Users",
    icon: Users,
    time: "1 hour ago",
  },
];

export default function DashboardActivityPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Recent Activity
        </h1>

      </div>

      <div className="space-y-4">

        {activities.map((activity) => {

          const Icon = activity.icon;

          return (

            <div
              key={activity.id}
              className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between"
            >

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-red-100 p-3">

                  <Icon className="text-red-700" size={20} />

                </div>

                <div>

                  <h2 className="font-semibold">
                    {activity.title}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {activity.module}
                  </p>

                </div>

              </div>

              <div className="text-sm text-slate-500">
                {activity.time}
              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}