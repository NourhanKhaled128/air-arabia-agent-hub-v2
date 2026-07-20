import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";

// Parents before children, respecting every foreign key in schema.prisma.
const TOPO_ORDER = [
  "category",
  "role",
  "trainingCourse",
  "excessBaggageRate",
  "sidebarLink",
  "importantLink",
  "homeWidget",
  "announcement",
  "mediaFile",
  "notification",
  "auditLog",
  "appSetting",
  "airport",
  "dispositionCode",
  "escalationContact",
  "disruption",
  "categoryFolder",
  "user",
  "lesson",
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
  "attachment",
  "comment",
  "feedback",
  "decisionTree",
  "decisionNode",
  "decisionOption",
] as const;

const TABLE_NAME: Record<(typeof TOPO_ORDER)[number], string> = {
  category: "Category",
  role: "Role",
  trainingCourse: "TrainingCourse",
  excessBaggageRate: "ExcessBaggageRate",
  sidebarLink: "SidebarLink",
  importantLink: "ImportantLink",
  homeWidget: "HomeWidget",
  announcement: "Announcement",
  mediaFile: "MediaFile",
  notification: "Notification",
  auditLog: "AuditLog",
  appSetting: "AppSetting",
  airport: "Airport",
  dispositionCode: "DispositionCode",
  escalationContact: "EscalationContact",
  disruption: "Disruption",
  categoryFolder: "CategoryFolder",
  user: "User",
  lesson: "Lesson",
  article: "Article",
  articleUpdate: "ArticleUpdate",
  procedureStep: "ProcedureStep",
  disposition: "Disposition",
  escalation: "Escalation",
  note: "Note",
  reference: "Reference",
  keyword: "Keyword",
  articleImage: "ArticleImage",
  scenario: "Scenario",
  chatTemplate: "ChatTemplate",
  emailTemplate: "EmailTemplate",
  attachment: "Attachment",
  comment: "Comment",
  feedback: "Feedback",
  decisionTree: "DecisionTree",
  decisionNode: "DecisionNode",
  decisionOption: "DecisionOption",
};

type Dump = Record<string, Record<string, unknown>[]>;

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: tsx scripts/restore-db-backup.ts <backup-file.json>");
    process.exit(1);
  }

  const dump = JSON.parse(fs.readFileSync(file, "utf8")) as Dump;
  const prisma = new PrismaClient();
  const client = prisma as unknown as Record<
    string,
    { createMany: (args: { data: unknown[] }) => Promise<{ count: number }> }
  >;

  console.log("--- Inserting rows (dependency order) ---");
  for (const model of TOPO_ORDER) {
    const rows = dump[model] ?? [];
    if (rows.length === 0) continue;
    const result = await client[model].createMany({ data: rows });
    console.log(`${model}: inserted ${result.count} / ${rows.length}`);
  }

  console.log("\n--- Resetting auto-increment sequences ---");
  for (const model of TOPO_ORDER) {
    const table = TABLE_NAME[model];
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 0));`
    );
  }

  console.log("\nRestore complete.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
