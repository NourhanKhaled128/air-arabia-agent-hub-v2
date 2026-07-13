import AdminPageHeader from "@/components/admin/AdminPageHeader";
import QuickReferenceManager from "@/components/admin/quick-reference/QuickReferenceManager";
import { getQuickReferenceHubs } from "@/lib/quick-reference-service";

export default async function AdminQuickReferencePage() {
  const hubs = await getQuickReferenceHubs();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Quick Reference"
        description="Manage the hub-by-hub facts shown on the champion-facing Quick Reference page."
      />

      <QuickReferenceManager hubs={hubs} />
    </div>
  );
}
