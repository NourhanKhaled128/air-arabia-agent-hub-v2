import "dotenv/config";
import { prisma } from "../lib/prisma";
async function main() {
  const ids = process.argv.slice(2).map(Number);
  const email = await prisma.emailTemplate.findMany({ where: { id: { in: ids } } });
  for (const e of email) console.log(`\n--- [${e.id}] ${e.title} ---\nSubject: ${e.subject}\n${e.body}`);
}
main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
