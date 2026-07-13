import { prisma } from "../lib/prisma";
import { buildArticleSectionsCreateData } from "../lib/article-service";
import { AUTHOR, TRAINING_CATEGORY_ID, slugify, MODULES } from "./training-flow-content";

async function main() {
  const deleted = await prisma.article.deleteMany({ where: { categoryId: TRAINING_CATEGORY_ID } });
  console.log(`Deleted ${deleted.count} existing Training article(s).`);

  for (const mod of MODULES) {
    const article = await prisma.article.create({
      data: {
        title: mod.title,
        slug: `${slugify(mod.title)}-${Date.now()}`,
        categoryId: TRAINING_CATEGORY_ID,
        description: mod.description,
        overview: mod.overview,
        author: AUTHOR,
        status: "Published",
        ...buildArticleSectionsCreateData({
          procedures: mod.procedures,
          scenarios: mod.scenarios,
          notes: mod.notes,
          keywords: mod.keywords,
        }),
      },
    });
    console.log(`Created: ${mod.title} (#${article.id})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
