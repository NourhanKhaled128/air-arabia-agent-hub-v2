import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EscalationComposer from "@/components/admin/escalation/EscalationComposer";
import { createEscalationContactAction } from "@/app/admin/actions/escalation-actions";

export default function NewEscalationContactPage() {
  return (
    <div className="space-y-8">

      <AdminPageHeader title="New Escalation Contact" />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <EscalationComposer action={createEscalationContactAction} submitLabel="Create Escalation Contact" />
      </div>

    </div>
  );
}
