import {
  Link2,
  CheckCircle2,
  XCircle,
  Settings,
  RefreshCw,
} from "lucide-react";

const integrations = [
  {
    id: 1,
    name: "Prisma Database",
    status: "Connected",
    description: "Primary application database.",
  },
  {
    id: 2,
    name: "Cloud Storage",
    status: "Connected",
    description: "Images and attachments.",
  },
  {
    id: 3,
    name: "Email Service",
    status: "Disconnected",
    description: "Notifications & password reset.",
  },
  {
    id: 4,
    name: "Analytics",
    status: "Connected",
    description: "Usage statistics.",
  },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Integrations
        </h1>

        <p className="mt-3 text-slate-500">
          Manage external services connected to the Agent Hub.
        </p>

      </div>

      <div className="grid gap-6">

        {integrations.map((integration) => (

          <div
            key={integration.id}
            className="rounded-3xl bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <Link2 className="text-red-700" />

                <div>

                  <h2 className="text-xl font-semibold">
                    {integration.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {integration.description}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                {integration.status === "Connected" ? (
                  <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">
                    <CheckCircle2 size={18} />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700">
                    <XCircle size={18} />
                    Disconnected
                  </span>
                )}

                <button className="rounded-xl border p-3 hover:bg-slate-50">
                  <Settings size={18} />
                </button>

                <button className="rounded-xl border p-3 hover:bg-slate-50">
                  <RefreshCw size={18} />
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}