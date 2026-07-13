import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";

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
  const backup: Record<string, unknown[]> = {};
  let totalRows = 0;

  for (const model of MODELS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = await (prisma as any)[model].findMany();
    backup[model] = rows;
    totalRows += rows.length;
    console.log(`${model}: ${rows.length} rows`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.resolve(__dirname, "..", "backups");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `backup-${timestamp}.json`);

  fs.writeFileSync(outPath, JSON.stringify(backup, null, 2));

  console.log(`\nTotal rows: ${totalRows}`);
  console.log(`Backup written to: ${outPath}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
