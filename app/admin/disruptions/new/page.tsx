import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import DisruptionForm from "@/components/admin/disruptions/DisruptionForm";
import { createDisruptionAction } from "@/app/admin/actions/disruption-actions";

export default function NewDisruptionPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader title="New Alert" />

      <AdminFormCard title="Alert Details">
        <DisruptionForm action={createDisruptionAction} />
      </AdminFormCard>
    </div>
  );
}
