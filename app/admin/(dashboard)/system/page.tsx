import fs from "node:fs";
import path from "node:path";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, XCircle } from "lucide-react";

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

function getLatestMigration() {
  try {
    const dir = path.join(process.cwd(), "prisma", "migrations");
    const entries = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
    return entries[entries.length - 1] ?? "Unknown";
  } catch {
    return "Unavailable";
  }
}

export default async function SystemPage() {
  const [dbHealthy, latestMigration] = await Promise.all([checkDatabase(), Promise.resolve(getLatestMigration())]);

  const deployInfo = [
    { label: "Environment", value: process.env.VERCEL_ENV ?? "local" },
    { label: "Commit", value: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "—" },
    { label: "Commit message", value: process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "—" },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="System Health"
        description="Basic signals about the running deployment and database."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Database</h2>
          <div className="flex items-center gap-2">
            {dbHealthy ? (
              <>
                <CheckCircle2 className="text-emerald-600" size={20} />
                <span className="font-semibold text-emerald-700">Reachable</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-600" size={20} />
                <span className="font-semibold text-red-700">Unreachable</span>
              </>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Latest applied migration (per the committed folder): <code className="rounded bg-slate-100 px-1.5 py-0.5">{latestMigration}</code>
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Deployment</h2>
          <dl className="space-y-2 text-sm">
            {deployInfo.map((item) => (
              <div key={item.label} className="flex justify-between gap-4">
                <dt className="text-slate-500">{item.label}</dt>
                <dd className="font-semibold text-slate-800">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
