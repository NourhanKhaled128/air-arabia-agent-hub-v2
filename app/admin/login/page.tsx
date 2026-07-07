import type { Metadata } from "next";
import { loginAction } from "@/app/admin/actions/auth-actions";

export const metadata: Metadata = {
  title: "KB Admin",
};

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">

        <h1 className="text-3xl font-bold text-red-700">
          AIR ARABIA
        </h1>

        <p className="mt-1 text-slate-500">
          Content Management Login
        </p>

        <form action={loginAction} className="mt-8 space-y-6">

          <div>
            <label className="mb-2 block font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              autoFocus
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-red-600"
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-red-600">
              Incorrect email or password. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            Log In
          </button>

        </form>

      </div>
    </div>
  );
}
