"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteImportantLinkAction } from "@/app/admin/actions/important-link-actions";

interface Props {
  id: number;
}

export default function ImportantLinkRowActions({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this important link permanently?")) return;

    startTransition(async () => {
      try {
        await deleteImportantLinkAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <div className="flex gap-3">
      <Link
        href={`/admin/important-links/${id}`}
        className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50"
      >
        <Pencil size={18} />
        Edit
      </Link>

      <button
        disabled={isPending}
        onClick={handleDelete}
        className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
      >
        <Trash2 size={18} />
        Delete
      </button>
    </div>
  );
}
