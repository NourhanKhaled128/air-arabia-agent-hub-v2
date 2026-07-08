"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteAirportAction } from "@/app/admin/actions/airport-actions";

interface Props {
  id: number;
}

export default function AirportRowActions({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this airport permanently?")) return;

    startTransition(async () => {
      try {
        await deleteAirportAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <button
      disabled={isPending}
      onClick={handleDelete}
      className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
    >
      <Trash2 size={18} />
      Delete
    </button>
  );
}
