import AdminPageHeader from "@/components/admin/AdminPageHeader";
import NotAvailableNotice from "@/components/admin/NotAvailableNotice";

export default function BackupPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Backup & Restore"
        description="There is no backup/restore mechanism configured for this database yet."
      />

      <NotAvailableNotice message="Database backup and restore isn't implemented yet. Ask your infrastructure/DB provider about their own backup tooling in the meantime." />
    </div>
  );
}
