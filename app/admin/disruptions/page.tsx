import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import DisruptionRowActions from "@/components/admin/disruptions/DisruptionRowActions";
import { getDisruptions } from "@/lib/disruption-service";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

const levelStyles: Record<string, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

export default async function DisruptionsPage() {
  const disruptions = await getDisruptions();

  const activeCount = disruptions.filter((d) => d.active).length;
  const highCount = disruptions.filter((d) => d.level === "High" && d.active).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Flight Disruptions"
        description="Manage airport alerts shown on the public Flight Disruptions page."
        actions={
          <AdminButton href="/admin/disruptions/new">
            + New Alert
          </AdminButton>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <AdminStatCard title="Total Alerts" value={disruptions.length} icon={AlertTriangle} />
        <AdminStatCard title="Active" value={activeCount} icon={CheckCircle2} color="text-emerald-700" />
        <AdminStatCard title="High Severity (Active)" value={highCount} icon={ShieldAlert} color="text-red-700" />
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm">
              <th className="px-6 py-4">Airport</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Active</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {disruptions.map((disruption) => (
              <tr key={disruption.id} className="border-t">
                <td className="px-6 py-5 font-bold">{disruption.airportCode}</td>
                <td className="px-6 py-5 text-slate-600">{disruption.message}</td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      levelStyles[disruption.level] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {disruption.level}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      disruption.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {disruption.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <DisruptionRowActions id={disruption.id} />
                </td>
              </tr>
            ))}

            {disruptions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No alerts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
