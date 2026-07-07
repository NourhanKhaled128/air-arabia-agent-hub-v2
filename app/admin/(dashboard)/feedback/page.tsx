import {
  MessageSquare,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
} from "lucide-react";

const feedback = [
  {
    id: 1,
    article: "Refund Policy",
    user: "Ahmed Hassan",
    status: "Pending",
    date: "06 Jul 2026",
  },
  {
    id: 2,
    article: "Baggage Rules",
    user: "Sara Ali",
    status: "Approved",
    date: "05 Jul 2026",
  },
  {
    id: 3,
    article: "Seat Selection",
    user: "Mohamed Omar",
    status: "Rejected",
    date: "04 Jul 2026",
  },
];

export default function FeedbackPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Feedback
        </h1>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <MessageSquare className="mb-3 text-red-700"/>
          <p>Total</p>
          <h2 className="text-3xl font-bold">85</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Clock3 className="mb-3 text-amber-700"/>
          <p>Pending</p>
          <h2 className="text-3xl font-bold">9</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <CheckCircle2 className="mb-3 text-emerald-700"/>
          <p>Approved</p>
          <h2 className="text-3xl font-bold">70</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <XCircle className="mb-3 text-red-700"/>
          <p>Rejected</p>
          <h2 className="text-3xl font-bold">6</h2>
        </div>

      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3">

          <Search size={18}/>

          <input
            placeholder="Search..."
            className="w-full outline-none"
          />

        </div>

        <div className="overflow-x-auto">
          <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">Article</th>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>

            </tr>

          </thead>

          <tbody>

            {feedback.map((item) => (

              <tr key={item.id} className="border-t">

                <td className="px-6 py-5">{item.article}</td>

                <td className="px-6 py-5">{item.user}</td>

                <td className="px-6 py-5">{item.status}</td>

                <td className="px-6 py-5">{item.date}</td>

              </tr>

            ))}

          </tbody>

        </table>
        </div>

      </div>

    </div>
  );
}