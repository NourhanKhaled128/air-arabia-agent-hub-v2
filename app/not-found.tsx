import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 dark:bg-background px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand">
        404
      </p>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
        Page not found
      </h1>
      <p className="max-w-md text-gray-500 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
      >
        Back to Agent Hub
      </Link>
    </div>
  );
}
