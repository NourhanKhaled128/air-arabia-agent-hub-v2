import { prisma } from "../lib/prisma";
import { getDecisionTreeById, updateDecisionTree, type DecisionTreeNodeInput } from "../lib/decision-tree-service";

async function expandHolidaysTree() {
  const tree = await getDecisionTreeById(27);
  if (!tree) {
    console.warn("Tree 27 not found — skipping.");
    return;
  }

  const alreadyExpanded = tree.nodes.some((n) => n.text.startsWith("Point the passenger to the concerned team"));
  if (alreadyExpanded) {
    console.log("Tree 27 already expanded — skipping.");
    return;
  }

  const questionNode = tree.nodes.find((n) => n.type === "question");
  if (!questionNode) {
    console.warn("Tree 27 has no question node — skipping.");
    return;
  }

  const existingNodes: DecisionTreeNodeInput[] = tree.nodes.map((n) => ({
    clientKey: n.id,
    type: n.type as "question" | "outcome",
    text: n.text,
    image: n.image,
    order: n.order,
    options: n.options.map((o) => ({
      label: o.label,
      targetClientKey: o.targetNodeId,
      targetTreeId: o.targetTreeId,
    })),
  }));

  const maxOrder = Math.max(...tree.nodes.map((n) => n.order));
  const followUpKey = Math.max(...tree.nodes.map((n) => n.id)) + 1000;
  const otherKey = followUpKey + 1;

  const newOutcomeNodes: DecisionTreeNodeInput[] = [
    {
      clientKey: followUpKey,
      type: "outcome",
      text: "Point the passenger to the concerned team — holiday requests (new booking or cancellation) are handled by the team that was assigned the original Sprinklr request, not re-raised from scratch.",
      order: maxOrder + 1,
      options: [],
    },
    {
      clientKey: otherKey,
      type: "outcome",
      text: "For any other holiday-related question that isn't a new booking, cancellation, or follow-up, raise it under Complaints > Holidays related in Sprinklr if it's a complaint, or as a general holiday request otherwise.",
      order: maxOrder + 2,
      options: [],
    },
  ];

  const updatedNodes = existingNodes.map((n) => {
    if (n.clientKey !== questionNode.id) return n;
    return {
      ...n,
      options: [
        ...n.options,
        { label: "Follow up on an existing holiday request", targetClientKey: followUpKey },
        { label: "Any other holiday-related question", targetClientKey: otherKey },
      ],
    };
  });

  await updateDecisionTree(27, {
    title: tree.title,
    slug: tree.slug,
    description: tree.description,
    topic: tree.topic,
    status: tree.status,
    author: tree.author,
    sourceArticleId: tree.sourceArticleId,
    nodes: [...updatedNodes, ...newOutcomeNodes],
  });

  console.log("Expanded tree 27 (Air Arabia Holidays) with Follow-up and Other branches.");
}

async function main() {
  await expandHolidaysTree();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
