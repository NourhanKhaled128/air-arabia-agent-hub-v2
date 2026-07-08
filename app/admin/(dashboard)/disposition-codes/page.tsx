import Link from "next/link";
import { ClipboardList, CheckCircle2, XCircle, Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import DispositionCodesTable from "@/components/admin/disposition/DispositionCodesTable";
import { getDispositionCodes } from "@/lib/disposition-service";

export default async function DispositionCodesPage() {
  const dispositions = await getDispositionCodes();

  const total = dispositions.length;
  const active = dispositions.filter((d) => d.active).length;
  const inactive = total - active;

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Disposition Codes"
        description="Manage the call-outcome codes agents select after each call."
        actions={
          <Link
            href="/admin/disposition-codes/new"
            className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            <Plus size={18} />
            New Disposition Code
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <AdminStatCard title="Total" value={total} icon={ClipboardList} />
        <AdminStatCard title="Active" value={active} icon={CheckCircle2} color="text-emerald-700" />
        <AdminStatCard title="Inactive" value={inactive} icon={XCircle} color="text-slate-500" />
      </div>

      <DispositionCodesTable dispositions={dispositions} />

    </div>
  );
}
