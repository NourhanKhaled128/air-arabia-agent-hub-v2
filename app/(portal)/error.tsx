"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface px-6 py-20 text-center shadow-sm">
      <AlertTriangle size={40} className="text-red-600" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
        Something went wrong loading this page
      </h1>
      <p className="max-w-md text-gray-500 dark:text-slate-400">
        Try again, or head back to the Knowledge Base.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          Try again
        </button>
        <Link
          href="/Knowledge"
          className="rounded-xl border border-gray-300 dark:border-border-subtle px-6 py-3 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
        >
          Knowledge Base
        </Link>
      </div>
    </div>
  );
}
