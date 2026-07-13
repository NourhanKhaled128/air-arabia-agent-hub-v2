import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DispositionComposer from "@/components/admin/disposition/DispositionComposer";
import { getDispositionCodeById, getDispositionCategories } from "@/lib/disposition-service";
import { updateDispositionCodeAction } from "@/app/admin/actions/disposition-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditDispositionCodePage({ params }: Props) {
  const { id } = await params;
  const dispositionId = Number(id);

  if (!Number.isInteger(dispositionId)) {
    notFound();
  }

  const disposition = await getDispositionCodeById(dispositionId);

  if (!disposition) {
    notFound();
  }

  const categories = await getDispositionCategories();
  const boundUpdate = updateDispositionCodeAction.bind(null, dispositionId);

  return (
    <div className="space-y-8">

      <AdminPageHeader title="Edit Disposition Code" />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <DispositionComposer
          action={boundUpdate}
          submitLabel="Save Changes"
          disposition={disposition}
          categories={categories}
        />
      </div>

    </div>
  );
}
