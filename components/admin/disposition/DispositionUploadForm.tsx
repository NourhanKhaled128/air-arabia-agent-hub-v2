"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";
import { uploadDispositionCodesAction } from "@/app/admin/actions/disposition-actions";

interface ActionResult {
  success?: boolean;
  count?: number;
  error?: string;
}

const initialState: ActionResult = {};

export default function DispositionUploadForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => uploadDispositionCodesAction(formData),
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">

      <div>
        <label className="mb-2 block font-semibold">
          Upload Disposition Codes (.xlsx / .xls)
        </label>

        <input
          type="file"
          name="file"
          accept=".xlsx,.xls"
          required
          className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-red-600"
        />

        <p className="mt-2 text-sm text-slate-500">
          Expects a header row with columns: code, label — category/type, description (or &quot;Call Scenario&quot;), and active are optional. Column names are matched flexibly, so the original Type / Subtype / Call Scenario wrap-up sheet can be uploaded as-is. Uploading replaces the entire disposition codes list — it does not affect the Disposition section already added to individual articles.
        </p>
      </div>

      {state.error && (
        <p className="text-sm font-semibold text-red-600">{state.error}</p>
      )}

      {state.success && (
        <p className="text-sm font-semibold text-emerald-600">
          Uploaded successfully — {state.count} disposition codes imported.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
      >
        <Upload size={18} />
        {isPending ? "Uploading..." : "Upload Sheet"}
      </button>

    </form>
  );
}
