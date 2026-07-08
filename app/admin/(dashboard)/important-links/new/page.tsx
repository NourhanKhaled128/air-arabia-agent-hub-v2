import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import ImportantLinkForm from "@/components/admin/important-links/ImportantLinkForm";
import { createImportantLinkAction } from "@/app/admin/actions/important-link-actions";

export default function NewImportantLinkPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader title="New Important Link" />

      <AdminFormCard title="Link Details">
        <ImportantLinkForm action={createImportantLinkAction} />
      </AdminFormCard>
    </div>
  );
}
