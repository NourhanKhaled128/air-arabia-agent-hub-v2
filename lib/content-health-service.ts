import { prisma } from "@/lib/prisma";

export async function getUncategorizedArticles() {
  return prisma.article.findMany({
    where: { categoryId: null },
    select: { id: true, title: true, status: true },
    orderBy: { title: "asc" },
  });
}

export async function getEmptyCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
  });
  return categories.filter((c) => c._count.articles === 0);
}

/** DecisionOption.targetNodeId has no FK constraint in the schema, unlike targetTreeId
 * — nothing stops it pointing at a node that's since been deleted. */
export async function getDanglingDecisionLinks() {
  const [options, nodes] = await Promise.all([
    prisma.decisionOption.findMany({
      where: { targetNodeId: { not: null } },
      select: { id: true, label: true, targetNodeId: true, node: { select: { tree: { select: { title: true, id: true } } } } },
    }),
    prisma.decisionNode.findMany({ select: { id: true } }),
  ]);

  const nodeIds = new Set(nodes.map((n) => n.id));
  return options.filter((o) => o.targetNodeId !== null && !nodeIds.has(o.targetNodeId));
}

export async function getStaleArticles(months = 6) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);

  return prisma.article.findMany({
    where: { status: "Published", updatedAt: { lt: cutoff } },
    select: { id: true, title: true, slug: true, updatedAt: true },
    orderBy: { updatedAt: "asc" },
  });
}
