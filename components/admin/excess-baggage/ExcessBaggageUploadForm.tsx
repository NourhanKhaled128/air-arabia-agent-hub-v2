"use client";

import { useActionState } from "react";
import { Upload } from "lucide-react";
import { uploadExcessBaggageRatesAction } from "@/app/admin/actions/excess-baggage-actions";

interface ActionResult {
  success?: boolean;
  count?: number;
  error?: string;
}

const initialState: ActionResult = {};

export default function ExcessBaggageUploadForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult, formData: FormData) => uploadExcessBaggageRatesAction(formData),
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-2 block font-semibold">
          Upload Excess Baggage Rates (.xlsx)
        </label>

        <input
          type="file"
          name="file"
          accept=".xlsx,.xls"
          required
          className="w-full rounded-xl border border-slate-300 p-3 outline-none transition focus:border-red-600"
        />

        <p className="mt-2 text-sm text-slate-500">
          Expects the standard rates workbook with sheets named exactly &quot;G9 &amp; 3L&quot;, &quot;E5&quot;, &quot;3O&quot; and &quot;9P&quot;. Uploading replaces the entire rate table and automatically updates the matching Knowledge Base articles, chat/email templates and decision trees for each hub.
        </p>
      </div>

      {state.error && (
        <p className="text-sm font-semibold text-red-600">{state.error}</p>
      )}

      {state.success && (
        <p className="text-sm font-semibold text-emerald-600">
          Uploaded successfully — {state.count} rate rows imported and pushed to the Knowledge Base.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-60"
      >
        <Upload size={18} />
        {isPending ? "Uploading & applying..." : "Upload & Apply"}
      </button>
    </form>
  );
}
