import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminStatCard from "@/components/admin/AdminStatCard";
import DisruptionsTable from "@/components/admin/disruptions/DisruptionsTable";
import { getDisruptions } from "@/lib/disruption-service";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

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

      <DisruptionsTable disruptions={disruptions} />
    </div>
  );
}
