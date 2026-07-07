import {
  BookCheck,
  CircleAlert,
  FileClock,
  CircleCheckBig,
} from "lucide-react";

const stats = [
  {
    title: "Published Articles",
    value: 352,
    icon: CircleCheckBig,
    color: "text-emerald-600",
  },
  {
    title: "Draft Articles",
    value: 27,
    icon: FileClock,
    color: "text-amber-600",
  },
  {
    title: "Outdated Articles",
    value: 14,
    icon: CircleAlert,
    color: "text-red-600",
  },
  {
    title: "Coverage",
    value: "96%",
    icon: BookCheck,
    color: "text-blue-600",
  },
];

export default function KnowledgeHealthPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Knowledge Health
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-8 shadow-sm"
            >
              <Icon
                className={`mb-5 ${item.color}`}
                size={30}
              />

              <p className="text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">
          Health Summary
        </h2>

        <div className="mt-6 space-y-4">

          <div className="flex justify-between rounded-xl border p-4">
            <span>Articles reviewed this month</span>
            <span className="font-bold">48</span>
          </div>

          <div className="flex justify-between rounded-xl border p-4">
            <span>Articles requiring review</span>
            <span className="font-bold text-red-600">
              14
            </span>
          </div>

          <div className="flex justify-between rounded-xl border p-4">
            <span>Average article rating</span>
            <span className="font-bold">
              4.8 / 5
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}