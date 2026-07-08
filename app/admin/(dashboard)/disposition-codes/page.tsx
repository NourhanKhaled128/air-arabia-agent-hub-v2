import Link from "next/link";
import { ClipboardList, CheckCircle2, XCircle, Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminListTable from "@/components/admin/AdminListTable";
import DispositionRowActions from "@/components/admin/disposition/DispositionRowActions";
import { getDispositionCodes } from "@/lib/disposition-service";
import { deleteManyDispositionCodesAction } from "@/app/admin/actions/disposition-actions";

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

      <AdminListTable
        columns={[
          { key: "code", label: "Code" },
          { key: "label", label: "Label" },
          { key: "description", label: "Description" },
          { key: "status", label: "Status" },
        ]}
        data={dispositions}
        searchPlaceholder="Search disposition codes..."
        searchFn={(item, query) => {
          const q = query.toLowerCase();
          return (
            item.code.toLowerCase().includes(q) ||
            item.label.toLowerCase().includes(q) ||
            (item.description ?? "").toLowerCase().includes(q)
          );
        }}
        filters={[
          {
            key: "active",
            label: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        ]}
        filterFn={(item, values) => {
          if (values.active === "active" && !item.active) return false;
          if (values.active === "inactive" && item.active) return false;
          return true;
        }}
        onDeleteMany={deleteManyDispositionCodesAction}
        emptyMessage="No disposition codes yet."
        renderRow={(disposition) => (
          <>
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
          </>
        )}
      />

    </div>
  );
}
