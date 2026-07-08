"use client";

import { Trash2, X } from "lucide-react";

interface Props {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  deleting?: boolean;
}

export default function AdminBulkActionsBar({
  count,
  onClear,
  onDelete,
  deleting,
}: Props) {
  if (count === 0) return null;

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
      <span className="font-semibold text-red-800">
        {count} selected
      </span>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          <X size={16} />
          Clear
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
        >
          <Trash2 size={16} />
          Delete Selected
        </button>
      </div>
    </div>
  );
}
