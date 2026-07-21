"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, BarChart3 } from "lucide-react";
import {
  deleteQuizAction,
  publishQuizAction,
  unpublishQuizAction,
} from "@/app/admin/actions/quiz-actions";

interface Props {
  id: number;
  status: string;
}

export default function QuizRowActions({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this quiz and all its submissions permanently?")) return;

    startTransition(async () => {
      try {
        await deleteQuizAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  function handleToggleStatus() {
    startTransition(async () => {
      try {
        if (status === "Published") {
          await unpublishQuizAction(id);
        } else {
          await publishQuizAction(id);
        }
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/quizzes/${id}/results`}
        className="rounded-lg border p-2 hover:bg-slate-50"
        title="View results"
      >
        <BarChart3 size={18} />
      </Link>

      <button
        disabled={isPending}
        onClick={handleToggleStatus}
        className="rounded-lg border p-2 hover:bg-slate-50"
        title={status === "Published" ? "Unpublish" : "Publish"}
      >
        {status === "Published" ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

      <Link
        href={`/admin/quizzes/${id}`}
        className="rounded-lg border p-2 hover:bg-slate-50"
        title="Edit"
      >
        <Pencil size={18} />
      </Link>

      <button
        disabled={isPending}
        onClick={handleDelete}
        className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
