import {
  FileClock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const approvals = [
  {
    id: 1,
    title: "Refund SOP Update",
    author: "Reservations Supervisor",
  },
  {
    id: 2,
    title: "New Baggage Policy",
    author: "QA Team",
  },
  {
    id: 3,
    title: "Airport Services",
    author: "Training Team",
  },
];

export default function PendingApprovalsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Pending Approvals
        </h1>

      </div>

      <div className="space-y-5">

        {approvals.map((item) => (

          <div
            key={item.id}
            className="rounded-3xl bg-white p-6 shadow-sm flex items-center justify-between"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-xl bg-amber-100 p-4">

                <FileClock className="text-amber-700"/>

              </div>

              <div>

                <h2 className="font-semibold">
                  {item.title}
                </h2>

                <p className="text-slate-500">
                  {item.author}
                </p>

              </div>

            </div>

            <div className="flex gap-2">

              <button className="rounded-xl bg-emerald-600 p-3 text-white hover:bg-emerald-700">
                <CheckCircle2 size={18}/>
              </button>

              <button className="rounded-xl bg-red-600 p-3 text-white hover:bg-red-700">
                <XCircle size={18}/>
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}