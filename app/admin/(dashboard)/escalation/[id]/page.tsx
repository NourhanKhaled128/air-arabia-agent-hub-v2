import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EscalationComposer from "@/components/admin/escalation/EscalationComposer";
import { getEscalationContactById } from "@/lib/escalation-service";
import { updateEscalationContactAction } from "@/app/admin/actions/escalation-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEscalationContactPage({ params }: Props) {
  const { id } = await params;
  const escalationId = Number(id);

  if (!Number.isInteger(escalationId)) {
    notFound();
  }

  const escalation = await getEscalationContactById(escalationId);

  if (!escalation) {
    notFound();
  }

  const boundUpdate = updateEscalationContactAction.bind(null, escalationId);

  return (
    <div className="space-y-8">

      <AdminPageHeader title="Edit Escalation Contact" />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <EscalationComposer
          action={boundUpdate}
          submitLabel="Save Changes"
          escalation={escalation}
        />
      </div>

    </div>
  );
}
