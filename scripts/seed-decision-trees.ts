import { prisma } from "../lib/prisma";
import { createDecisionTree } from "../lib/decision-tree-service";
import type { DecisionTreeSpec } from "./decision-trees/types";
import { GENERAL_TREES } from "./decision-trees/general";
import { G9_3L_TREES } from "./decision-trees/g9-3l";
import { THREE_O_TREES } from "./decision-trees/3o";
import { NINE_P_TREES } from "./decision-trees/9p";
import { E5_TREES } from "./decision-trees/e5";
import { NEW_CATEGORY_TREES } from "./decision-trees/new-categories";

const AUTHOR = "Nourhan Khaled";

const ALL_TREES: DecisionTreeSpec[] = [
  ...GENERAL_TREES,
  ...G9_3L_TREES,
  ...THREE_O_TREES,
  ...NINE_P_TREES,
  ...E5_TREES,
  ...NEW_CATEGORY_TREES,
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function main() {
  console.log(`Loaded ${ALL_TREES.length} decision tree specs.`);

  let created = 0;

  for (const [index, spec] of ALL_TREES.entries()) {
    const existing = await prisma.decisionTree.findFirst({ where: { title: spec.title } });
    if (existing) {
      console.log(`Skip (already exists): ${spec.title}`);
      continue;
    }

    const sourceArticle = await prisma.article.findUnique({
      where: { slug: spec.sourceArticleSlug },
      select: { id: true },
    });

    if (!sourceArticle) {
      console.warn(`No source article found for slug: ${spec.sourceArticleSlug} (tree: ${spec.title})`);
    }

    const tree = await createDecisionTree({
      title: spec.title,
      slug: `${slugify(spec.title)}-${Date.now()}-${index}`,
      description: spec.description,
      topic: spec.topic,
      status: "Published",
      author: AUTHOR,
      sourceArticleId: sourceArticle?.id ?? null,
      nodes: spec.nodes.map((node) => ({
        clientKey: node.clientKey,
        type: node.type,
        text: node.text,
        order: node.clientKey,
        options: (node.options ?? []).map((opt) => ({
          label: opt.label,
          targetClientKey: opt.targetClientKey,
        })),
      })),
    });

    created++;
    console.log(`Created: ${spec.title} (#${tree.id}, ${spec.nodes.length} nodes)`);
  }

  console.log(`Done. Created ${created} of ${ALL_TREES.length} trees.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
