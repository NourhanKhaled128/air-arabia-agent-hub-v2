import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const term = process.argv[2];
  const chat = await prisma.chatTemplate.findMany({ where: { content: { contains: term } } });
  const email = await prisma.emailTemplate.findMany({ where: { body: { contains: term } } });
  const notes = await prisma.note.findMany({ where: { content: { contains: term } } });
  const scen = await prisma.scenario.findMany({ where: { OR: [{ situation: { contains: term } }, { response: { contains: term } }] } });
  console.log("ChatTemplates:", chat.map(c => ({ id: c.id, articleId: c.articleId, title: c.title })));
  console.log("EmailTemplates:", email.map(c => ({ id: c.id, articleId: c.articleId, title: c.title })));
  console.log("Notes:", notes.map(c => ({ id: c.id, articleId: c.articleId, content: c.content.slice(0,150) })));
  console.log("Scenarios:", scen.map(c => ({ id: c.id, articleId: c.articleId, situation: c.situation.slice(0,100) })));
}
main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
