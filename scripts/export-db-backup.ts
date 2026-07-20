import "dotenv/config";
import { prisma } from "@/lib/prisma";
import fs from "node:fs";
import path from "node:path";

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
  "airport",
  "dispositionCode",
  "escalationContact",
  "comment",
  "feedback",
] as const;

async function main() {
  const dump: Record<string, unknown[]> = {};
  let totalRows = 0;

  for (const model of MODELS) {
    const client = prisma as unknown as Record<string, { findMany: () => Promise<unknown[]> }>;
    const rows = await client[model].findMany();
    dump[model] = rows;
    totalRows += rows.length;
    console.log(`${model}: ${rows.length} rows`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.join(process.cwd(), "backups");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `db-backup-${timestamp}.json`);
  fs.writeFileSync(outFile, JSON.stringify(dump, null, 2));

  console.log(`\nTotal rows: ${totalRows}`);
  console.log(`Written to: ${outFile}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
