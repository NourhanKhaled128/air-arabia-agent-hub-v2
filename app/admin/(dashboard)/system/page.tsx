import {
  Server,
  Database,
  Cpu,
  HardDrive,
  Activity,
} from "lucide-react";

export default function SystemPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          System Health
        </h1>

      </div>

      <div className="grid gap-6 md:grid-cols-5">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Server className="mb-3 text-red-700" />
          <p>Server</p>
          <h2 className="text-xl font-bold text-emerald-600">
            Online
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Database className="mb-3 text-blue-700" />
          <p>Database</p>
          <h2 className="text-xl font-bold text-emerald-600">
            Healthy
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Cpu className="mb-3 text-amber-700" />
          <p>CPU</p>
          <h2 className="text-3xl font-bold">
            18%
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <HardDrive className="mb-3 text-violet-700" />
          <p>Storage</p>
          <h2 className="text-3xl font-bold">
            42%
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Activity className="mb-3 text-emerald-700" />
          <p>Uptime</p>
          <h2 className="text-3xl font-bold">
            99.98%
          </h2>
        </div>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">
          Services
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between rounded-xl border p-4">
            <span>Next.js Application</span>
            <span className="font-semibold text-emerald-600">
              Running
            </span>
          </div>

          <div className="flex justify-between rounded-xl border p-4">
            <span>Prisma ORM</span>
            <span className="font-semibold text-emerald-600">
              Connected
            </span>
          </div>

          <div className="flex justify-between rounded-xl border p-4">
            <span>Search Engine</span>
            <span className="font-semibold text-emerald-600">
              Indexed
            </span>
          </div>

          <div className="flex justify-between rounded-xl border p-4">
            <span>Email Queue</span>
            <span className="font-semibold text-emerald-600">
              Active
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}