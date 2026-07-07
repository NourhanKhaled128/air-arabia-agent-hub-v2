import Link from "next/link";
import { ClipboardList, CheckCircle2, XCircle, Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import DispositionRowActions from "@/components/admin/disposition/DispositionRowActions";
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

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">Label</th>
              <th className="px-6 py-4 text-left">Description</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {dispositions.map((disposition) => (
              <tr key={disposition.id} className="border-t">
                <td className="px-6 py-5 font-semibold">{disposition.code}</td>
                <td className="px-6 py-5">{disposition.label}</td>
                <td className="px-6 py-5 text-slate-500">{disposition.description ?? "-"}</td>
                <td className="px-6 py-5">
                  <AdminBadge color={disposition.active ? "green" : "gray"}>
                    {disposition.active ? "Active" : "Inactive"}
                  </AdminBadge>
                </td>
                <td className="px-6 py-5">
                  <DispositionRowActions id={disposition.id} />
                </td>
              </tr>
            ))}

            {dispositions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No disposition codes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
