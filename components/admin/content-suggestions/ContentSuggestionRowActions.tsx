"use client";

import { useTransition } from "react";
import { CheckCircle2, Trash2 } from "lucide-react";
import {
  resolveContentSuggestionAction,
  deleteContentSuggestionAction,
} from "@/app/admin/actions/content-suggestion-actions";

interface Props {
  id: number;
  status: string;
}

export default function ContentSuggestionRowActions({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <div className="flex gap-3">
      {status === "New" && (
        <button
          disabled={isPending}
          onClick={() => run(() => resolveContentSuggestionAction(id))}
          className="flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          <CheckCircle2 size={18} />
          Resolve
        </button>
      )}

      <button
        disabled={isPending}
        onClick={() => {
          if (!confirm("Delete this suggestion permanently?")) return;
          run(() => deleteContentSuggestionAction(id));
        }}
        className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
      >
        <Trash2 size={18} />
        Delete
      </button>
    </div>
  );
}
