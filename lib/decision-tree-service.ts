import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface DecisionTreeNodeInput {
  clientKey: number;
  type: "question" | "outcome";
  text: string;
  image?: string | null;
  order: number;
  options: { label: string; targetClientKey: number | null; targetTreeId?: number | null }[];
}

export interface DecisionTreeInput {
  title: string;
  slug: string;
  description?: string | null;
  topic?: string | null;
  status: string;
  author: string;
  sourceArticleId?: number | null;
  nodes: DecisionTreeNodeInput[];
}

export async function getAllDecisionTrees() {
  const trees = await prisma.decisionTree.findMany({
    include: {
      sourceArticle: { select: { title: true } },
      nodes: { select: { id: true, type: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return trees.map((tree) => ({
    ...tree,
    nodeCount: tree.nodes.length,
    outcomeCount: tree.nodes.filter((n) => n.type === "outcome").length,
  }));
}

export async function getDecisionTreeById(id: number) {
  return prisma.decisionTree.findUnique({
    where: { id },
    include: {
      nodes: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { order: "asc" }, include: { targetTree: { select: { id: true, title: true, slug: true } } } } },
      },
    },
  });
}

export async function getDecisionTreeBySlug(slug: string) {
  return prisma.decisionTree.findUnique({
    where: { slug },
    include: {
      sourceArticle: { select: { id: true, slug: true, title: true } },
      nodes: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { order: "asc" }, include: { targetTree: { select: { id: true, title: true, slug: true } } } } },
      },
    },
  });
}

export async function getAllDecisionTreesForLinking() {
  return prisma.decisionTree.findMany({
    select: { id: true, title: true, slug: true },
    orderBy: { title: "asc" },
  });
}

export async function getDecisionTreesForArticle(articleId: number) {
  return prisma.decisionTree.findMany({
    where: { sourceArticleId: articleId, status: "Published" },
    select: { id: true, slug: true, title: true },
  });
}

export async function createDecisionTree(input: DecisionTreeInput) {
  return prisma.$transaction(async (tx) => {
    const tree = await tx.decisionTree.create({
      data: {
        title: input.title,
        slug: input.slug,
        description: input.description || null,
        topic: input.topic || null,
        status: input.status,
        author: input.author,
        sourceArticleId: input.sourceArticleId ?? null,
      },
    });

    await insertNodesAndOptionsTx(tx, tree.id, input.nodes);

    return tree;
  });
}

export async function updateDecisionTree(id: number, input: DecisionTreeInput) {
  return prisma.$transaction(async (tx) => {
    const tree = await tx.decisionTree.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description || null,
        topic: input.topic || null,
        status: input.status,
        author: input.author,
        sourceArticleId: input.sourceArticleId ?? null,
      },
    });

    await tx.decisionNode.deleteMany({ where: { treeId: id } });
    await insertNodesAndOptionsTx(tx, id, input.nodes);

    return tree;
  });
}

async function insertNodesAndOptionsTx(
  tx: Prisma.TransactionClient,
  treeId: number,
  nodes: DecisionTreeNodeInput[]
) {
  const keyToId = new Map<number, number>();

  for (const node of nodes) {
    const created = await tx.decisionNode.create({
      data: {
        treeId,
        type: node.type,
        text: node.text,
        image: node.image || null,
        order: node.order,
      },
    });
    keyToId.set(node.clientKey, created.id);
  }

  for (const node of nodes) {
    const nodeId = keyToId.get(node.clientKey);
    if (!nodeId) continue;

    for (const [index, option] of node.options.entries()) {
      const targetNodeId =
        option.targetClientKey != null ? (keyToId.get(option.targetClientKey) ?? null) : null;

      await tx.decisionOption.create({
        data: {
          nodeId,
          label: option.label,
          targetNodeId,
          targetTreeId: option.targetTreeId ?? null,
          order: index,
        },
      });
    }
  }
}

export async function deleteDecisionTree(id: number) {
  return prisma.decisionTree.delete({ where: { id } });
}
