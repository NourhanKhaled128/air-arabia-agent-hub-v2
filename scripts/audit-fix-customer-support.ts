import { prisma } from "../lib/prisma";
import { getDecisionTreeById, updateDecisionTree, type DecisionTreeNodeInput } from "../lib/decision-tree-service";

async function addEscalations() {
  const complaints = await prisma.article.findFirst({ where: { title: "Handling Complaints – All Hubs" } });
  if (complaints) {
    const existing = await prisma.escalation.count({ where: { articleId: complaints.id } });
    if (existing === 0) {
      await prisma.article.update({
        where: { id: complaints.id },
        data: {
          escalations: {
            create: [
              {
                department: "Duty Supervisor",
                condition: "Empathy and the standard fix don't resolve it, or the passenger asks to speak to someone senior",
                content: "Escalate the call live to the shift Duty Supervisor",
              },
            ],
          },
          references: {
            create: [
              {
                title: "Feedback/Complaint form (website & app)",
                type: "Internal SOP",
              },
            ],
          },
        },
      });
      console.log("Added escalation + reference to: Handling Complaints – All Hubs");
    }
  }

  const systems = await prisma.article.findFirst({
    where: { title: "Contact Center Systems Overview – Accel Aero, Sprinklr, Caesar & Teams" },
  });
  if (systems) {
    const existing = await prisma.escalation.count({ where: { articleId: systems.id } });
    if (existing === 0) {
      await prisma.article.update({
        where: { id: systems.id },
        data: {
          escalations: {
            create: [
              {
                department: "Relevant team (via Microsoft Teams)",
                condition: "Case is urgent or needs same-day action",
                content: "Escalate directly on Microsoft Teams to the relevant team's channel — do not wait for an email reply",
              },
            ],
          },
        },
      });
      console.log("Added escalation to: Contact Center Systems Overview");
    }
  }
}

async function expandComplaintTypeTree() {
  const tree = await getDecisionTreeById(53);
  if (!tree) {
    console.warn("Tree 53 not found — skipping.");
    return;
  }

  // Only run once: check whether the AirRewards outcome branch already exists.
  const alreadyExpanded = tree.nodes.some((n) => n.text.startsWith("Raise it under Complaints > Airrewards"));
  if (alreadyExpanded) {
    console.log("Tree 53 already expanded — skipping.");
    return;
  }

  const questionNode = tree.nodes.find((n) => n.id === 278);
  const catchAllNode = tree.nodes.find((n) => n.id === 281);
  if (!questionNode || !catchAllNode) {
    console.warn("Tree 53 does not have the expected node ids (278/281) — skipping to avoid corrupting it.");
    return;
  }

  const NEW_BRANCHES: { label: string; outcome: string }[] = [
    { label: "AirRewards complaint", outcome: "Raise it under Complaints > Airrewards in Sprinklr." },
    { label: "Website issue that can't be resolved from the Call Center", outcome: "Raise it under Complaints > Website related in Sprinklr." },
    { label: "Airport complaint — staff attitude, wrong handling", outcome: "Raise it under Complaints > Airport related in Sprinklr." },
    { label: "Onboard complaint — meal not provided, seat not allocated, cabin crew", outcome: "Raise it under Complaints > Onboard related in Sprinklr." },
    { label: "Office complaint — wrong booking/info, staff attitude at a sales office", outcome: "Raise it under Complaints > Office related in Sprinklr." },
    { label: "Holiday booking complaint", outcome: "Raise it under Complaints > Holidays related in Sprinklr." },
    { label: "Terms & conditions complaint (modification/cancellation T&Cs)", outcome: "Raise it under Complaints > T&C related in Sprinklr." },
    { label: "Visa complaint", outcome: "Raise it under Complaints > Visa related in Sprinklr." },
    { label: "Service the passenger needs isn't available", outcome: "Raise it under Complaints > Service not available in Sprinklr." },
    { label: "City / online check-in complaint", outcome: "Raise it under Complaints > City/online Check-in in Sprinklr." },
    { label: "Flight alert complaint — no action taken from our side", outcome: "Raise it under Complaints > Flight Alert related in Sprinklr." },
  ];

  // Reuse each existing node's real id as its clientKey so updateDecisionTree preserves wiring.
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

  let nextClientKey = Math.max(...tree.nodes.map((n) => n.id)) + 1000;
  const newOutcomeNodes: DecisionTreeNodeInput[] = [];
  const newOptionsForQuestion: { label: string; targetClientKey: number; targetTreeId?: number | null }[] = [];

  for (const [index, branch] of NEW_BRANCHES.entries()) {
    const clientKey = nextClientKey++;
    newOutcomeNodes.push({
      clientKey,
      type: "outcome",
      text: branch.outcome,
      order: catchAllNode.order + index + 1,
      options: [],
    });
    newOptionsForQuestion.push({ label: branch.label, targetClientKey: clientKey });
  }

  const updatedNodes = existingNodes.map((n) => {
    if (n.clientKey !== 278) return n;

    // Replace the vague "any other complaint type" option with the specific new branches,
    // and repoint the remaining catch-all to a clearly-final "Other" outcome.
    const keptOptions = n.options.filter(
      (o) => !o.label.startsWith("Any other complaint type")
    );

    return {
      ...n,
      options: [
        ...keptOptions,
        ...newOptionsForQuestion,
        { label: "Anything else not listed above", targetClientKey: 281 },
      ],
    };
  });

  const finalNodes = updatedNodes.map((n) =>
    n.clientKey === 281
      ? { ...n, text: "Listen, empathize, acknowledge the inconvenience, then offer a solution, escalate to a supervisor, or raise it under Complaints > Other in Sprinklr." }
      : n
  );

  await updateDecisionTree(53, {
    title: tree.title,
    slug: tree.slug,
    description: tree.description,
    topic: tree.topic,
    status: tree.status,
    author: tree.author,
    sourceArticleId: tree.sourceArticleId,
    nodes: [...finalNodes, ...newOutcomeNodes],
  });

  console.log(`Expanded tree 53 with ${NEW_BRANCHES.length} new complaint-type branches.`);
}

async function main() {
  await addEscalations();
  await expandComplaintTypeTree();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
