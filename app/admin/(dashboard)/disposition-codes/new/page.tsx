import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DispositionComposer from "@/components/admin/disposition/DispositionComposer";
import { createDispositionCodeAction } from "@/app/admin/actions/disposition-actions";

export default function NewDispositionCodePage() {
  return (
    <div className="space-y-8">

      <AdminPageHeader title="New Disposition Code" />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <DispositionComposer action={createDispositionCodeAction} submitLabel="Create Disposition Code" />
      </div>

    </div>
  );
}
