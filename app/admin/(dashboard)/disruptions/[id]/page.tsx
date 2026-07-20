import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import DisruptionForm from "@/components/admin/disruptions/DisruptionForm";
import { getDisruptionById } from "@/lib/disruption-service";
import { updateDisruptionAction } from "@/app/admin/actions/disruption-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDisruptionPage({ params }: Props) {
  const { id } = await params;
  const disruptionId = Number(id);

  if (!Number.isInteger(disruptionId)) {
    notFound();
  }

  const disruption = await getDisruptionById(disruptionId);

  if (!disruption) {
    notFound();
  }

  const boundUpdate = updateDisruptionAction.bind(null, disruptionId);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Edit Alert"
        breadcrumbs={[{ label: "Disruptions", href: "/admin/disruptions" }, { label: disruption.airportCode }]}
      />

      <AdminFormCard title="Alert Details">
        <DisruptionForm
          action={boundUpdate}
          submitLabel="Save Changes"
          disruption={disruption}
        />
      </AdminFormCard>
    </div>
  );
}
