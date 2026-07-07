import {
  Pencil,
  Clock3,
  User,
} from "lucide-react";

const edits = [
  {
    id: 1,
    article: "Refund Policy",
    editor: "Administrator",
    time: "5 min ago",
  },
  {
    id: 2,
    article: "Baggage Rules",
    editor: "QA Team",
    time: "18 min ago",
  },
  {
    id: 3,
    article: "Seat Selection",
    editor: "Reservations Supervisor",
    time: "1 hour ago",
  },
  {
    id: 4,
    article: "Payment Policy",
    editor: "Administrator",
    time: "Today",
  },
];

export default function RecentEditsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Recent Edits
        </h1>

      </div>

      <div className="space-y-4">

        {edits.map((edit) => (

          <div
            key={edit.id}
            className="rounded-3xl bg-white p-6 shadow-sm flex items-center justify-between"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-xl bg-blue-100 p-4">

                <Pencil className="text-blue-700" />

              </div>

              <div>

                <h2 className="font-semibold">
                  {edit.article}
                </h2>

                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                  <User size={14} />

                  {edit.editor}

                </div>

              </div>

            </div>

            <div className="flex items-center gap-2 text-slate-500">

              <Clock3 size={16} />

              {edit.time}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}