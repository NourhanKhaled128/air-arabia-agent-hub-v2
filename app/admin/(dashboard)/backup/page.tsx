import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Download } from "lucide-react";

export default function BackupPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Backup & Restore"
        description="Download a full snapshot of the database as JSON."
      />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="max-w-2xl text-slate-500">
          This downloads every table (articles, quizzes, agent accounts, comments, etc.)
          as a single JSON file. Password hashes are excluded from the export. Restore
          isn&apos;t available as a self-service action here — a misapplied restore
          could overwrite live production data with no undo — so restoring from a
          backup is a CLI operation for whoever manages the database directly
          (<code className="rounded bg-slate-100 px-1.5 py-0.5">scripts/restore-db-backup.ts</code>).
        </p>

        <a
          href="/admin/backup/export"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          <Download size={18} />
          Download Backup
        </a>
      </div>
    </div>
  );
}
