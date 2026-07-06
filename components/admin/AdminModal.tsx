"use client";

import { ReactNode } from "react";

interface AdminModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function AdminModal({
  open,
  title,
  children,
  onClose,
}: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 hover:bg-slate-100"
          >
            ✕
          </button>

        </div>

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
}