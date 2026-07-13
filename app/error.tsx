"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 dark:bg-background px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">
        Something went wrong
      </p>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
        This page hit an unexpected error
      </h1>
      <p className="max-w-md text-gray-500 dark:text-slate-400">
        Try again, or head back to the Champion Hub if the problem continues.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-gray-300 dark:border-border-subtle px-6 py-3 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
        >
          Back to Champion Hub
        </Link>
      </div>
    </div>
  );
}
