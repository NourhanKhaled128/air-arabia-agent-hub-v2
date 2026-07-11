"use client";

import { useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import {
  markFeedbackReviewedAction,
  deleteFeedbackAction,
} from "@/app/admin/actions/feedback-actions";

interface Props {
  id: number;
  status: string;
}

export default function FeedbackRowActions({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleReview() {
    startTransition(async () => {
      try {
        await markFeedbackReviewedAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Delete this feedback entry permanently?")) return;

    startTransition(async () => {
      try {
        await deleteFeedbackAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {status !== "Reviewed" && (
        <button
          disabled={isPending}
          onClick={handleReview}
          title="Mark reviewed"
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
