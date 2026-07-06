"use client";

import AdminModal from "./AdminModal";

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeleteConfirmationModal({
  open,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onCancel,
  onDelete,
}: Props) {
  return (
    <AdminModal
      open={open}
      title={title}
      onClose={onCancel}
    >

      <p className="text-slate-600">
        {message}
      </p>

      <div className="mt-8 flex justify-end gap-3">

        <button
          onClick={onCancel}
          className="rounded-xl border px-6 py-3 font-semibold hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          onClick={onDelete}
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          Delete
        </button>

      </div>

    </AdminModal>
  );
}