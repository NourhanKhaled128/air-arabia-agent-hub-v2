import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const categories = await prisma.category.findMany({
    include: { folders: true, articles: { select: { id: true, title: true, folderId: true, status: true } } },
    orderBy: { order: "asc" },
  });

  for (const cat of categories) {
    console.log(`\n### CATEGORY [${cat.id}] ${cat.name} (group: ${cat.group})`);
    const noFolderArticles = cat.articles.filter((a) => !a.folderId);
    for (const a of noFolderArticles) console.log(`  - [${a.id}] ${a.title} (${a.status})`);
    for (const folder of cat.folders) {
      console.log(`  Folder [${folder.id}] ${folder.name}`);
      const arts = cat.articles.filter((a) => a.folderId === folder.id);
      for (const a of arts) console.log(`    - [${a.id}] ${a.title} (${a.status})`);
    }
  }

  const trees = await prisma.decisionTree.findMany({ select: { id: true, title: true, topic: true, status: true } });
  console.log(`\n### DECISION TREES (${trees.length})`);
  for (const t of trees) console.log(`  - [${t.id}] ${t.title} (topic: ${t.topic}, ${t.status})`);

  const airports = await prisma.airport.count();
  const excessRates = await prisma.excessBaggageRate.count();
  console.log(`\nAirports: ${airports}, ExcessBaggageRate rows: ${excessRates}`);
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
