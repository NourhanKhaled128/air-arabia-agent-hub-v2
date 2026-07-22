import type { Metadata } from "next";
import { portalLoginAction } from "@/app/actions/portal-auth";

export const metadata: Metadata = {
  title: "Champion Hub Login",
};

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function PortalLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background px-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-surface p-10 shadow-xl">

        <h1 className="text-3xl font-bold text-brand">
          AIR ARABIA
        </h1>

        <p className="mt-1 text-gray-500 dark:text-slate-400">
          Champion Hub Login
        </p>

        <form action={portalLoginAction} className="mt-8 space-y-6">

          <div>
            <label className="mb-2 block font-semibold text-gray-700 dark:text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              autoFocus
              placeholder="you@airarabia.com"
              className="w-full rounded-xl border border-gray-300 dark:border-border-subtle bg-white dark:bg-surface-muted px-4 py-3 text-gray-900 dark:text-slate-100 outline-none focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-gray-700 dark:text-slate-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              className="w-full rounded-xl border border-gray-300 dark:border-border-subtle bg-white dark:bg-surface-muted px-4 py-3 text-gray-900 dark:text-slate-100 outline-none focus:border-brand"
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              Incorrect email or password. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
          >
            Log In
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
          Don&apos;t have an account? Contact your team admin to get set up.
        </p>

      </div>
    </div>
  );
}
