"use client";

import { useTransition } from "react";
import { Download, Trash2 } from "lucide-react";
import { deleteMediaFileAction } from "@/app/admin/actions/media-actions";

interface Props {
  id: number;
  url: string;
}

export default function MediaRowActions({ id, url }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this file permanently?")) return;

    startTransition(async () => {
      try {
        await deleteMediaFileAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <div className="flex gap-2">
      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border p-2 hover:bg-slate-50"
      >
        <Download size={18} />
      </a>

      <button
        disabled={isPending}
        onClick={handleDelete}
        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
