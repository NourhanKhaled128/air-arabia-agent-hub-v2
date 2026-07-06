"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCategoryAction } from "@/app/admin/actions/category-actions";

interface Props {
  id: number;
}

export default function CategoryRowActions({ id }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this category permanently?")) return;

    startTransition(async () => {
      try {
        await deleteCategoryAction(id);
      } catch (error) {
        console.error(error);
        alert("Operation failed.");
      }
    });
  }

  return (
    <div className="flex gap-3">
      <Link
        href={`/admin/categories/${id}`}
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
