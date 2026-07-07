import Link from "next/link";
import { PhoneCall, CheckCircle2, XCircle, Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminBadge from "@/components/admin/AdminBadge";
import EscalationRowActions from "@/components/admin/escalation/EscalationRowActions";
import { getEscalationContacts } from "@/lib/escalation-service";

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

      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">Issue Type</th>
              <th className="px-6 py-4 text-left">Escalate To</th>
              <th className="px-6 py-4 text-left">Contact Info</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {escalations.map((escalation) => (
              <tr key={escalation.id} className="border-t">
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
              </tr>
            ))}

            {escalations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No escalation contacts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
