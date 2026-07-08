import { History } from "lucide-react";
import { formatRelativeTime } from "@/lib/format";

interface Update {
  id: number;
  action: string;
  userName: string;
  createdAt: Date;
}

interface Props {
  updates?: Update[];
}

export default function UpdatesSection({ updates }: Props) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center gap-3">
        <History className="text-red-700" />

        <h2 className="text-2xl font-bold">
          Updates
        </h2>
      </div>

      {!updates && (
        <p className="text-gray-500">
          Updates will appear here after you save this article.
        </p>
      )}

      {updates && updates.length === 0 && (
        <p className="text-gray-500">
          No updates recorded yet.
        </p>
      )}

      {updates && updates.length > 0 && (
        <div className="space-y-4">
          {updates.map((update) => (
            <div
              key={update.id}
              className="flex items-center justify-between rounded-2xl border p-4"
            >
              <div>
                <p className="font-semibold">{update.action}</p>
                <p className="text-sm text-gray-500">by {update.userName}</p>
              </div>

              <p className="text-sm text-gray-500">
                {formatRelativeTime(update.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
