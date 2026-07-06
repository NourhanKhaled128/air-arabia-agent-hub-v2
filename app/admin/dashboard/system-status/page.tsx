import {
  Server,
  Database,
  HardDrive,
  Cpu,
  Wifi,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    name: "Next.js Server",
    status: "Online",
    icon: Server,
  },
  {
    name: "Prisma Database",
    status: "Connected",
    icon: Database,
  },
  {
    name: "Storage",
    status: "Healthy",
    icon: HardDrive,
  },
  {
    name: "API",
    status: "Running",
    icon: Wifi,
  },
];

export default function SystemStatusPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          System Status
        </h1>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Cpu className="mb-4 text-red-700"/>
          <p>CPU Usage</p>
          <h2 className="text-3xl font-bold">
            17%
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <HardDrive className="mb-4 text-blue-700"/>
          <p>Memory</p>
          <h2 className="text-3xl font-bold">
            42%
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Database className="mb-4 text-emerald-700"/>
          <p>Database</p>
          <h2 className="text-xl font-bold text-emerald-600">
            Healthy
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Wifi className="mb-4 text-amber-600"/>
          <p>Network</p>
          <h2 className="text-xl font-bold text-emerald-600">
            Connected
          </h2>
        </div>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">
          Running Services
        </h2>

        <div className="space-y-4">

          {services.map((service) => {

            const Icon = service.icon;

            return (

              <div
                key={service.name}
                className="flex items-center justify-between rounded-xl border p-4"
              >

                <div className="flex items-center gap-4">

                  <Icon className="text-red-700"/>

                  <span className="font-medium">
                    {service.name}
                  </span>

                </div>

                <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-emerald-700">

                  <CheckCircle2 size={16}/>

                  {service.status}

                </span>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}