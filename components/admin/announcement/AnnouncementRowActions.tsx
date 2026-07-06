"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteAnnouncementAction } from "@/app/admin/actions/announcement-actions";

interface Props {
  id: number;
}

export default function AnnouncementRowActions({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this announcement permanently?")) return;

    startTransition(async () => {
      try {
        await deleteAnnouncementAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/announcements/${id}`}
        className="rounded-lg border p-2 hover:bg-slate-50"
      >
        <Pencil size={18} />
      </Link>

      <button
        disabled={isPending}
        onClick={handleDelete}
        className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
