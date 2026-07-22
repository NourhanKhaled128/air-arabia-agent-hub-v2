"use client";

import { useState, useTransition } from "react";
import { Upload } from "lucide-react";
import AdminInput from "@/components/admin/AdminInput";
import AdminButton from "@/components/admin/AdminButton";
import { bulkCreatePortalUsersAction } from "@/app/admin/actions/portal-user-actions";

interface Row {
  name: string;
  email: string;
}

interface Summary {
  created: number;
  skippedDuplicate: number;
  rejectedDomain: number;
}

function parseCsv(text: string): Row[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, email] = line.split(",").map((v) => v.trim());
      return { name, email };
    })
    .filter((row) => row.email && row.email.toLowerCase() !== "email");
}

export default function PortalUserImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!file || !password) {
      setError("Choose a CSV file and set a temporary password.");
      return;
    }
    setError(null);

    startTransition(async () => {
      try {
        const text = await file.text();
        const rows = parseCsv(text);
        const result = await bulkCreatePortalUsersAction({ rows, password });
        setSummary(result);
      } catch (err) {
        console.error(err);
        setError("Import failed.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block font-semibold">CSV file (columns: name, email)</label>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <AdminInput
        type="password"
        label="Temporary password for every imported account"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="font-semibold text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
      >
        <Upload size={18} />
        {isPending ? "Importing..." : "Import"}
      </button>

      {summary && (
        <div className="rounded-xl border bg-slate-50 p-4">
          <p className="font-semibold">{summary.created} account(s) created.</p>
          {summary.skippedDuplicate > 0 && (
            <p className="text-slate-600">{summary.skippedDuplicate} skipped (email already exists).</p>
          )}
          {summary.rejectedDomain > 0 && (
            <p className="text-slate-600">
              {summary.rejectedDomain} rejected (not an @airarabia.com/@gocozmo.com email).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
