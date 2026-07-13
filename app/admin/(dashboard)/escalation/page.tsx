import Link from "next/link";
import { PhoneCall, CheckCircle2, XCircle, Plus } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import EscalationContactsTable from "@/components/admin/escalation/EscalationContactsTable";
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
        description="Manage who champions should escalate each issue type to."
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

      <EscalationContactsTable escalations={escalations} />

    </div>
  );
}
