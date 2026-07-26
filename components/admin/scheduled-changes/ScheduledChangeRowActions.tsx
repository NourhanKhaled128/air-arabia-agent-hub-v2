"use client";

import { useTransition } from "react";
import { cancelScheduledChangeAction } from "@/app/admin/actions/scheduled-change-actions";

interface Props {
  id: number;
  status: string;
}

export default function ScheduledChangeRowActions({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  if (status !== "Pending") return null;

  function handleCancel() {
    if (!confirm("Cancel this scheduled change? It will never be applied.")) return;

    startTransition(async () => {
      try {
        await cancelScheduledChangeAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <button
      disabled={isPending}
      onClick={handleCancel}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      Cancel
    </button>
  );
}
