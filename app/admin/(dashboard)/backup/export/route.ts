import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-dal";
import { prisma } from "@/lib/prisma";

// Same model list as scripts/backup-database.ts, but streamed back as a download
// instead of written to local disk (Vercel's filesystem is ephemeral) — and with
// passwordHash stripped from User/PortalUser before it ever leaves the server.
const MODELS = [
  "article",
  "articleUpdate",
  "procedureStep",
  "disposition",
  "escalation",
  "note",
  "reference",
  "keyword",
  "articleImage",
  "scenario",
  "chatTemplate",
  "emailTemplate",
  "decisionTree",
  "decisionNode",
  "decisionOption",
  "excessBaggageRate",
  "attachment",
  "disruption",
  "category",
  "categoryFolder",
  "sidebarLink",
  "importantLink",
  "homeWidget",
  "announcement",
  "trainingCourse",
  "lesson",
  "mediaFile",
  "notification",
  "auditLog",
  "appSetting",
  "role",
  "user",
  "portalUser",
  "team",
  "airport",
  "dispositionCode",
  "escalationContact",
  "comment",
  "feedback",
] as const;

const SENSITIVE_FIELDS = ["passwordHash"];

export async function GET() {
  await requirePermission("manage_settings");

  const backup: Record<string, unknown[]> = {};

  for (const model of MODELS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: Record<string, unknown>[] = await (prisma as any)[model].findMany();
    backup[model] = rows.map((row) => {
      const clean = { ...row };
      for (const field of SENSITIVE_FIELDS) delete clean[field];
      return clean;
    });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="champion-hub-backup-${timestamp}.json"`,
    },
  });
}
