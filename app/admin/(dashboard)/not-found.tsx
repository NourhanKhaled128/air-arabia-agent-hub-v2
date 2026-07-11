import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white dark:bg-surface px-6 py-20 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">
        404
      </p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Page not found
      </h1>
      <p className="max-w-md text-slate-500 dark:text-slate-400">
        This admin page doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/admin"
        className="mt-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
      >
        Back to Admin Dashboard
      </Link>
    </div>
  );
}
