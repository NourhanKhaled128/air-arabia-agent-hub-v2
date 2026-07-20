import "dotenv/config";
import { prisma } from "../lib/prisma";

const AUTHOR = "Nourhan Khaled";

// 1. RAKBANK article (178) has no decision tree yet.
async function addRakbankTree() {
  const existing = await prisma.decisionTree.findFirst({ where: { sourceArticleId: 178 } });
  if (existing) return console.log("RAKBANK tree already exists — skipping.");

  const tree = await prisma.decisionTree.create({
    data: {
      title: "RAKBANK Platinum Card — What's the Question?",
      slug: `rakbank-platinum-card-whats-the-question-${Date.now()}`,
      description: "Card benefits, linking to AirRewards, and troubleshooting missing points.",
      topic: "AirRewards",
      status: "Published",
      author: AUTHOR,
      sourceArticleId: 178,
    },
  });

  const q1 = await prisma.decisionNode.create({
    data: { treeId: tree.id, type: "question", text: "What's the passenger asking about?", order: 1 },
  });
  const benefitsOutcome = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "outcome",
      text: "No joining fee, 20,000-point AirRewards welcome bonus, free annual return ticket, lounge access, free 10kg extra baggage + 2 meal vouchers, 0% Easy Payment Plan, 50% off VOX Cinemas, complimentary Careem airport transfers. For the exact welcome-bonus posting timeline, direct the passenger to RAKBANK — that's managed bank-side, not through AirRewards.",
      order: 2,
    },
  });
  const linkOutcome = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "outcome",
      text: "Verify the AirRewards account is active in Accel Aero (Search Customers by email). If it shows activation pending, resend the AirRewards activation email. Once active, the passenger contacts RAKBANK directly to link the same email address to their bank account.",
      order: 3,
    },
  });
  const q2 = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "question",
      text: "RAKBANK points aren't showing — was the AirRewards account activated before or after the points were transferred?",
      order: 4,
    },
  });
  const beforeActivationOutcome = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "outcome",
      text: "Points transferred before AirRewards activation do not backfill automatically. The passenger needs RAKBANK to resend the points, or wait for the next monthly transfer cycle.",
      order: 5,
    },
  });
  const afterActivationOutcome = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "outcome",
      text: "Check the monthly claim window first — points post between the 6th and 13th of the month following the transfer. If it's outside that window, confirm the email on the RAKBANK account matches the AirRewards account exactly (a mismatch is the other common cause) before escalating.",
      order: 6,
    },
  });

  await prisma.decisionOption.createMany({
    data: [
      { nodeId: q1.id, label: "Card benefits / welcome bonus", targetNodeId: benefitsOutcome.id, order: 0 },
      { nodeId: q1.id, label: "How to link RAKBANK to AirRewards", targetNodeId: linkOutcome.id, order: 1 },
      { nodeId: q1.id, label: "RAKBANK points not showing in AirRewards", targetNodeId: q2.id, order: 2 },
      { nodeId: q2.id, label: "Transferred before activation", targetNodeId: beforeActivationOutcome.id, order: 0 },
      { nodeId: q2.id, label: "Account was already active when transferred", targetNodeId: afterActivationOutcome.id, order: 1 },
    ],
  });

  console.log(`Created tree "RAKBANK Platinum Card — What's the Question?" (#${tree.id})`);
}

// 2. Etihad Guest transfer article (177) has no decision tree yet.
async function addEtihadGuestTree() {
  const existing = await prisma.decisionTree.findFirst({ where: { sourceArticleId: 177 } });
  if (existing) return console.log("Etihad Guest tree already exists — skipping.");

  const tree = await prisma.decisionTree.create({
    data: {
      title: "AirRewards to Etihad Guest Transfer — What's the Question?",
      slug: `airrewards-etihad-guest-transfer-${Date.now()}`,
      description: "How to convert AirRewards points to Etihad Guest Miles, and troubleshooting.",
      topic: "AirRewards",
      status: "Published",
      author: AUTHOR,
      sourceArticleId: 177,
    },
  });

  const q1 = await prisma.decisionNode.create({
    data: { treeId: tree.id, type: "question", text: "What's the passenger asking about?", order: 1 },
  });
  const howToOutcome = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "outcome",
      text: "Log in to Etihad Guest first, then log in to AirRewards and select \"Convert Points to Etihad Guest Miles.\" Enter the points to convert — even numbers only — and confirm. Rate: 2 AirRewards points = 1 Etihad Guest Mile. Miles should appear within 24 hours. Confirm the amount before submitting — transfers are final and cannot be reversed or refunded.",
      order: 2,
    },
  });
  const q2 = await prisma.decisionNode.create({
    data: { treeId: tree.id, type: "question", text: "Points haven't appeared yet — how long has it been since the transfer?", order: 3 },
  });
  const withinWindowOutcome = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "outcome",
      text: "Still within the normal window — transfers typically reflect within 24 hours. Ask the passenger to check again shortly.",
      order: 4,
    },
  });
  const overdueOutcome = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "outcome",
      text: "Past the normal 24-hour window — advise the passenger to email airrewards@airarabia.com so the transfer can be investigated. The transfer itself cannot be reversed or resubmitted from the passenger's side.",
      order: 5,
    },
  });
  const errorOutcome = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "outcome",
      text: "Points must be transferred in even numbers — an odd amount will not go through; have the passenger round up or down. If they instead hit an error mid-process on the website, have them clear their browser cache and cookies and retry before escalating to airrewards@airarabia.com.",
      order: 6,
    },
  });
  const multiAccountOutcome = await prisma.decisionNode.create({
    data: {
      treeId: tree.id,
      type: "outcome",
      text: "Not possible — one Etihad Guest account can only be linked to a single AirRewards account, and vice versa. Multiple linkages aren't supported.",
      order: 7,
    },
  });

  await prisma.decisionOption.createMany({
    data: [
      { nodeId: q1.id, label: "How to do a transfer", targetNodeId: howToOutcome.id, order: 0 },
      { nodeId: q1.id, label: "Points haven't appeared yet", targetNodeId: q2.id, order: 1 },
      { nodeId: q1.id, label: "Odd point amount / error during transfer", targetNodeId: errorOutcome.id, order: 2 },
      { nodeId: q1.id, label: "Linking a second Etihad Guest account", targetNodeId: multiAccountOutcome.id, order: 3 },
      { nodeId: q2.id, label: "Under 24 hours", targetNodeId: withinWindowOutcome.id, order: 0 },
      { nodeId: q2.id, label: "24 hours or more", targetNodeId: overdueOutcome.id, order: 1 },
    ],
  });

  console.log(`Created tree "AirRewards to Etihad Guest Transfer — What's the Question?" (#${tree.id})`);
}

// 3. Article 156 is internally flagged "Draft for review" despite being Published and
// already verified against the Day 1 training deck this session.
async function resolveDraftCaveat() {
  const article = await prisma.article.findUnique({ where: { id: 156 } });
  if (!article) return console.warn("Article 156 not found — skip.");
  const marker = "Draft for review — condensed from the new-agent training deck; verify wording and screenshots against the current Accel Aero build before publishing.";
  if (!article.overview.includes(marker)) {
    console.log("Draft caveat already resolved — skipping.");
    return;
  }
  const overview = article.overview.replace(
    marker,
    "Content verified against the Accel Aero new-agent training deck on 20 July 2026 — wording and flow are current; screenshots should still be refreshed if the Accel Aero UI changes."
  );
  await prisma.article.update({ where: { id: 156 }, data: { overview } });
  console.log("Resolved Draft-for-review caveat on article 156.");
}

// 4 & 5. Port the DO/DON'T + escalation-trigger pattern from the 3O Name Correction tree
// to the G9 and 9P Name Change trees, which currently just state fee/process facts.
async function upgradeG9NameChangeTree() {
  const node109 = await prisma.decisionNode.findUnique({ where: { id: 109 } });
  if (!node109) throw new Error("Node 109 not found");
  if (node109.text.includes("DO:")) return console.log("G9 Name Change tree already upgraded — skipping.");

  await prisma.decisionNode.update({
    where: { id: 109 },
    data: {
      text: "AED 350 per passenger + fare difference. DO: confirm the request is at least 24h before the first sector's departure, then quote and process directly. DON'T: process it if departure is under 24h without escalating. Urgent same-day-flight case: escalate to the Duty Supervisor rather than promising a standard change.",
    },
  });
  await prisma.decisionNode.update({
    where: { id: 110 },
    data: {
      text: "AED 350 per passenger + fare difference, 24h notice. DO: confirm the requester is an immediate family member of the credit's original owner, raise a Sprinklr case, ask for proof of relationship, and advise the reply comes by email. DON'T: process this for a non-immediate-family requester, or skip the proof-of-relationship request. Urgent same-day-flight case: escalate via Teams and follow up until resolved.",
    },
  });
  await prisma.decisionNode.update({
    where: { id: 111 },
    data: {
      text: "Free of charge. DO: send the request directly to a supervisor with supporting documents — a marriage certificate for a spouse's-name change, or ID/passport mismatch proof. DON'T: raise this as a paid name-change case or ask the passenger to pay when it qualifies as a free correction. Urgent same-day-flight case: escalate via Teams.",
    },
  });
  console.log("Upgraded G9 Name Change tree (nodes 109/110/111) with DO/DON'T + escalation guidance.");
}

async function upgrade9PNameChangeTree() {
  const node175 = await prisma.decisionNode.findUnique({ where: { id: 175 } });
  if (!node175) throw new Error("Node 175 not found");
  if (node175.text.includes("DO:")) return console.log("9P Name Change tree already upgraded — skipping.");

  await prisma.decisionNode.update({
    where: { id: 175 },
    data: {
      text: "PKR 3,500 (domestic) or AED 350 (international) per passenger + fare difference. DO: confirm the request is at least 24h before the first sector's departure, then quote and process directly. DON'T: process it if departure is under 24h without escalating. Urgent same-day-flight case: escalate to the Duty Supervisor rather than promising a standard change.",
    },
  });
  await prisma.decisionNode.update({
    where: { id: 176 },
    data: {
      text: "Same fees (PKR 3,500 domestic / AED 350 international), 24h notice. DO: confirm the requester is an immediate family member of the credit's original owner, raise a Sprinklr case, ask for proof of relationship, and advise the reply comes by email. DON'T: process this for a non-immediate-family requester, or skip the proof-of-relationship request. Urgent same-day-flight case: escalate via Teams and follow up until resolved.",
    },
  });
  await prisma.decisionNode.update({
    where: { id: 177 },
    data: {
      text: "Free of charge. DO: send the request directly to a supervisor with supporting documents — a marriage certificate for a spouse's-name change, or ID/passport mismatch proof. DON'T: raise this as a paid name-change case or ask the passenger to pay when it qualifies as a free correction. Urgent same-day-flight case: escalate via Teams.",
    },
  });
  console.log("Upgraded 9P Name Change tree (nodes 175/176/177) with DO/DON'T + escalation guidance.");
}

async function main() {
  await addRakbankTree();
  await addEtihadGuestTree();
  await resolveDraftCaveat();
  await upgradeG9NameChangeTree();
  await upgrade9PNameChangeTree();
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
