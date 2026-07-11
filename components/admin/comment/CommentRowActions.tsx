"use client";

import { useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import {
  approveCommentAction,
  deleteCommentAction,
} from "@/app/admin/actions/comment-actions";

interface Props {
  id: number;
  status: string;
}

export default function CommentRowActions({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveCommentAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this comment permanently?")) return;

    startTransition(async () => {
      try {
        await deleteCommentAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {status !== "Approved" && (
        <button
          disabled={isPending}
          onClick={handleApprove}
          title="Approve"
          className="rounded-lg border p-2 text-emerald-600 hover:bg-emerald-50"
        >
          <Check size={18} />
        </button>
      )}

      <button
        disabled={isPending}
        onClick={handleDelete}
        title="Delete"
        className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
