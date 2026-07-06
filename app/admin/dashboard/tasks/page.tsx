import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
} from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Review Refund Articles",
    priority: "High",
    status: "Pending",
  },
  {
    id: 2,
    title: "Publish Summer Announcement",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Archive Old Policies",
    priority: "Low",
    status: "Completed",
  },
];

export default function TasksPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Tasks
        </h1>

      </div>

      <div className="space-y-4">

        {tasks.map((task) => (

          <div
            key={task.id}
            className="rounded-2xl bg-white p-6 shadow-sm flex items-center justify-between"
          >

            <div>

              <h2 className="font-semibold text-lg">
                {task.title}
              </h2>

              <div className="mt-2 flex gap-3">

                <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                  {task.priority}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                  {task.status}
                </span>

              </div>

            </div>

            <div>

              {task.status === "Completed" ? (
                <CheckCircle2 className="text-emerald-600" size={28} />
              ) : task.status === "Pending" ? (
                <Clock3 className="text-amber-600" size={28} />
              ) : (
                <AlertTriangle className="text-blue-600" size={28} />
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}