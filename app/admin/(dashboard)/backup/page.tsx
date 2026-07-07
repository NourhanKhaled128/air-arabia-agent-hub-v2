import {
  Database,
  Download,
  Upload,
  RotateCcw,
  Clock,
} from "lucide-react";

export default function BackupPage() {
  return (
    <div className="space-y-8">

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Backup & Restore
        </h1>

        <p className="mt-3 text-slate-500">
          Backup and restore the Agent Hub database.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Database className="mb-3 text-red-700" />
          <p>Database Size</p>
          <h2 className="text-3xl font-bold">248 MB</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Clock className="mb-3 text-blue-700" />
          <p>Last Backup</p>
          <h2 className="text-lg font-bold">
            Today 08:30
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Download className="mb-3 text-emerald-700" />
          <p>Available Backups</p>
          <h2 className="text-3xl font-bold">18</h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <RotateCcw className="mb-3 text-amber-700" />
          <p>Restore Points</p>
          <h2 className="text-3xl font-bold">7</h2>
        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <button className="rounded-2xl bg-red-700 p-8 font-semibold text-white hover:bg-red-800">
          <Download className="mx-auto mb-3" />
          Create Backup
        </button>

        <button className="rounded-2xl border bg-white p-8 font-semibold hover:bg-slate-50">
          <Upload className="mx-auto mb-3" />
          Restore Backup
        </button>

      </div>

    </div>
  );
}