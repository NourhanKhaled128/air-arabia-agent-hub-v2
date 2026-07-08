import Link from "next/link";
import { PhoneCall, CheckCircle2, XCircle, Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import AdminListTable from "@/components/admin/AdminListTable";
import EscalationRowActions from "@/components/admin/escalation/EscalationRowActions";
import { getEscalationContacts } from "@/lib/escalation-service";
import { deleteManyEscalationContactsAction } from "@/app/admin/actions/escalation-actions";

export default async function EscalationPage() {
  const escalations = await getEscalationContacts();

  const total = escalations.length;
  const active = escalations.filter((e) => e.active).length;
  const inactive = total - active;

  return (
    <div className="space-y-8">

      <AdminPageHeader
        title="Escalation Contacts"
        description="Manage who agents should escalate each issue type to."
        actions={
          <Link
            href="/admin/escalation/new"
            className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            <Plus size={18} />
            New Escalation Contact
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <AdminStatCard title="Total" value={total} icon={PhoneCall} />
        <AdminStatCard title="Active" value={active} icon={CheckCircle2} color="text-emerald-700" />
        <AdminStatCard title="Inactive" value={inactive} icon={XCircle} color="text-slate-500" />
      </div>

      <AdminListTable
        columns={[
          { key: "issueType", label: "Issue Type" },
          { key: "escalateTo", label: "Escalate To" },
          { key: "contactInfo", label: "Contact Info" },
          { key: "status", label: "Status" },
        ]}
        data={escalations}
        searchPlaceholder="Search escalation contacts..."
        searchFn={(item, query) => {
          const q = query.toLowerCase();
          return (
            item.issueType.toLowerCase().includes(q) ||
            item.escalateTo.toLowerCase().includes(q) ||
            item.contactInfo.toLowerCase().includes(q)
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
        onDeleteMany={deleteManyEscalationContactsAction}
        emptyMessage="No escalation contacts yet."
        renderRow={(escalation) => (
          <>
            <td className="px-6 py-5 font-semibold">{escalation.issueType}</td>
            <td className="px-6 py-5">{escalation.escalateTo}</td>
            <td className="px-6 py-5">{escalation.contactInfo}</td>
            <td className="px-6 py-5">
              <AdminBadge color={escalation.active ? "green" : "gray"}>
                {escalation.active ? "Active" : "Inactive"}
              </AdminBadge>
            </td>
            <td className="px-6 py-5">
              <EscalationRowActions id={escalation.id} />
            </td>
          </>
        )}
      />

    </div>
  );
}
