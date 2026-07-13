import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DispositionComposer from "@/components/admin/disposition/DispositionComposer";
import { createDispositionCodeAction } from "@/app/admin/actions/disposition-actions";
import { getDispositionCategories } from "@/lib/disposition-service";

export default async function NewDispositionCodePage() {
  const categories = await getDispositionCategories();

  return (
    <div className="space-y-8">

      <AdminPageHeader title="New Disposition Code" />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <DispositionComposer
          action={createDispositionCodeAction}
          submitLabel="Create Disposition Code"
          categories={categories}
        />
      </div>

    </div>
  );
}
