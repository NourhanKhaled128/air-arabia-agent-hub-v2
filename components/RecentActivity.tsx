import { getRecentAuditLogs } from "@/lib/audit-service";
import { formatRelativeTime } from "@/lib/format";

export default async function RecentActivity() {
  const activity = await getRecentAuditLogs(5);

  return (
    <section className="h-[420px] rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          Recent Activity

        </h2>

      </div>

      <div className="h-[300px] space-y-4 overflow-y-auto pr-2">

        {activity.length === 0 && (
          <p className="text-gray-500">No activity yet.</p>
        )}

        {activity.map((item) => (

          <div
            key={item.id}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:bg-red-50"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-semibold">

                {item.action} {item.entity}

              </h3>

              <span className="text-sm text-gray-500">

                {formatRelativeTime(item.createdAt)}

              </span>

            </div>

            <p className="mt-2 text-gray-600">

              by {item.userName}

            </p>

          </div>

        ))}

      </div>

    </section>
  );
}
