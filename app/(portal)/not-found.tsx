import Link from "next/link";
import { Search } from "lucide-react";

export default function PortalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface px-6 py-20 text-center shadow-sm">
      <Search size={40} className="text-gray-400 dark:text-slate-500" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
        We couldn&apos;t find that page
      </h1>
      <p className="max-w-md text-gray-500 dark:text-slate-400">
        The article or page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Try searching the Knowledge Base instead.
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/Knowledge"
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          Browse Knowledge Base
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-gray-300 dark:border-border-subtle px-6 py-3 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
