import "dotenv/config";
import { prisma } from "../lib/prisma";
import { createDecisionTree, type DecisionTreeInput, type DecisionTreeNodeInput } from "../lib/decision-tree-service";
import { buildArticleSectionsCreateData } from "../lib/article-service";
import type { ArticleChangePayload } from "../lib/scheduled-change-service";
import type { Prisma } from "@prisma/client";

// Applies the company memo (effective 1 Aug 2026: paid Name Change suspended across
// G9, E5, 3L, 9P; free exceptions unchanged — genuine spelling correction, genuine
// last-name change with proof) WITHOUT changing anything in the live KB today.
//
// What this script does:
//   1. Creates the 3L and E5 Name Change articles + decision trees now, Published,
//      describing today's real (still-active) policy — neither hub had one before.
//   2. Queues 8 ScheduledChange rows (G9/9P/3L/E5 x article+tree), effectiveDate
//      2026-08-01T00:00:00Z, whose payload rewrites each into the suspended-policy
//      wording. Nothing changes until the daily cron (app/api/cron/apply-scheduled-changes)
//      picks these up on/after that date.
//   3. Updates the EscalationContact "Free Name Spelling Amendment / Correction" entry
//      now — informational guidance for agents, doesn't assert current availability,
//      safe to broaden immediately to mention 3L/E5.
//
// Run with: npx tsx scripts/schedule-name-change-suspension.ts

const AUTHOR = "Nourhan Khaled";
const EFFECTIVE_DATE = new Date("2026-08-01T00:00:00Z");

// ---------------------------------------------------------------------------
// 1. Create the 3L and E5 Name Change articles + trees now — today-accurate content.
// ---------------------------------------------------------------------------

async function ensureThreeLArticleAndTree() {
  const existingArticle = await prisma.article.findUnique({ where: { slug: "3l-name-change-3l" } });
  let articleId: number;

  if (existingArticle) {
    console.log(`3L Name Change: article already exists (#${existingArticle.id}) — skipping creation.`);
    articleId = existingArticle.id;
  } else {
    const sibling = await prisma.article.findUnique({
      where: { slug: "3l-early-home-check-in-abu-dhabi-sharjah-airports" },
      select: { categoryId: true, folderId: true },
    });
    if (!sibling) throw new Error("Sibling article not found for 3L placement: 3l-early-home-check-in-abu-dhabi-sharjah-airports");

    const article = await prisma.article.create({
      data: {
        title: "3L Name Change",
        slug: "3l-name-change-3l",
        categoryId: sibling.categoryId,
        folderId: sibling.folderId,
        description: "Fee, family-voucher and free-exception rules for 3L name change requests.",
        overview:
          "3L follows the same paid Name Change structure as G9 (same UAE hub group): AED 350 per passenger + fare difference, 24h notice before the first sector's departure, or a previous credit voucher for immediate family (Sprinklr case, proof of relationship). Two free exceptions apply regardless of payment method: a genuine spelling correction, or a genuine last-name change (e.g. after marriage) with proof documents — both sent directly to a supervisor.",
        author: AUTHOR,
        status: "Published",
        ...buildArticleSectionsCreateData({
          notes: [
            {
              type: "Information",
              content: "Mirrors the G9 Name Change fee structure — same AED 350 + fare difference, same 24h notice, same free-exception process.",
            },
          ],
          keywords: ["name change", "spelling correction", "3l"],
          chatTemplates: [
            {
              title: "Name change too close to departure (English)",
              content:
                "I'm sorry, but name changes need at least 24 hours' notice before the first sector's departure — let me check with a supervisor to see if there's any airport-level exception.",
            },
            {
              title: "Name change via family credit (English)",
              content:
                "Since your spouse counts as immediate family, this is permitted — I'll raise a Sprinklr case now and just need proof of the relationship to process it.",
            },
            {
              title: "Free spelling correction (English)",
              content:
                "Not a problem at all — a spelling correction like that is completely free. I'll send this directly to a supervisor to process rather than raising a paid case.",
            },
          ],
          emailTemplates: [
            {
              title: "Name change request too close to departure",
              subject: "Name change request too close to departure",
              body: "Dear [Customer Name],\n\nThank you for your name change request ahead of your flight.\n\nName changes must be requested at least 24 hours prior to the first sector's departure. As your flight departs sooner than that, we're checking with our team to see if any airport-level exception can apply.\n\nBest regards,\nAir Arabia Customer Support",
            },
            {
              title: "Name change using family credit — proof required",
              subject: "Name change using family credit — proof required",
              body: "Dear [Customer Name],\n\nThank you for your request to apply your family member's credit voucher to your booking with a name change.\n\nAn immediate family member's credit qualifies. We've raised a Sprinklr case for this request — please reply with proof of relationship so we can proceed.\n\nBest regards,\nAir Arabia Customer Support",
            },
            {
              title: "Free spelling correction request",
              subject: "Free spelling correction request",
              body: "Dear [Customer Name],\n\nThank you for flagging the spelling discrepancy between your booking and passport.\n\nThis qualifies as a free spelling correction. We've forwarded your request directly to a supervisor for processing — no charge applies.\n\nBest regards,\nAir Arabia Customer Support",
            },
          ],
        }),
      },
    });
    console.log(`3L Name Change: created article #${article.id}.`);
    articleId = article.id;
  }

  const existingTree = await prisma.decisionTree.findFirst({ where: { title: "3L Name Change — How Is It Being Paid?" } });
  if (existingTree) {
    console.log(`3L Name Change: tree already exists (#${existingTree.id}) — skipping.`);
    return articleId;
  }

  const nodes: DecisionTreeNodeInput[] = [
    {
      clientKey: 1,
      type: "question",
      text: "How is the passenger paying for the name change?",
      order: 1,
      options: [
        { label: "Credit card or cash", targetClientKey: 2 },
        { label: "Previous credit voucher (immediate family only)", targetClientKey: 3 },
        { label: "Spelling correction or genuine last-name change", targetClientKey: 4 },
      ],
    },
    { clientKey: 2, type: "outcome", order: 2, text: "AED 350 per passenger + fare difference. Must be done 24h prior to the first sector's departure (same fee structure as G9).", options: [] },
    { clientKey: 3, type: "outcome", order: 3, text: "Same AED 350 + fare difference, 24h notice. Raise a Sprinklr case, ask for proof of relationship — passenger gets a reply by email.", options: [] },
    { clientKey: 4, type: "outcome", order: 4, text: "Free of charge. Send the request to a supervisor directly with supporting documents (e.g. marriage certificate, ID mismatch proof).", options: [] },
  ];

  const tree = await createDecisionTree({
    title: "3L Name Change — How Is It Being Paid?",
    slug: `3l-name-change-how-is-it-being-paid-${Date.now()}`,
    description: "Route the name change request by payment method.",
    topic: "3L",
    status: "Published",
    author: AUTHOR,
    sourceArticleId: articleId,
    nodes,
  });
  console.log(`3L Name Change: created tree #${tree.id}.`);

  return articleId;
}

async function ensureE5ArticleAndTree() {
  const existingArticle = await prisma.article.findUnique({ where: { slug: "e5-name-change-e5" } });
  let articleId: number;

  if (existingArticle) {
    console.log(`E5 Name Change: article already exists (#${existingArticle.id}) — skipping creation.`);
    articleId = existingArticle.id;
  } else {
    const sibling = await prisma.article.findUnique({
      where: { slug: "e5-tv-handling-e5" },
      select: { categoryId: true, folderId: true },
    });
    if (!sibling) throw new Error("Sibling article not found for E5 placement: e5-tv-handling-e5");

    const article = await prisma.article.create({
      data: {
        title: "E5 Name Change",
        slug: "e5-name-change-e5",
        categoryId: sibling.categoryId,
        folderId: sibling.folderId,
        description: "Free-exception rules for E5 name change requests.",
        overview:
          "A paid Name Change option exists on E5 for requests outside the two free exceptions — confirm the current fee with a supervisor or Sales at the time of the request, since it isn't yet standardized in this KB. The two free exceptions apply regardless: a genuine spelling correction, or a genuine last-name change (e.g. after marriage) with proof documents — both sent directly to a supervisor.",
        author: AUTHOR,
        status: "Published",
        ...buildArticleSectionsCreateData({
          notes: [
            {
              type: "Information",
              content: "The pre-suspension E5 paid-name-change fee isn't documented in this KB — confirm with a supervisor rather than quoting a figure.",
            },
          ],
          keywords: ["name change", "spelling correction", "e5"],
          chatTemplates: [
            {
              title: "Free spelling correction (English)",
              content:
                "Not a problem at all — a spelling correction like that is completely free. I'll send this directly to a supervisor to process.",
            },
            {
              title: "Free name update after marriage (English)",
              content:
                "Congratulations on the wedding! Updating to your husband's last name is free of charge — please send proof of documents like the marriage certificate, and I'll forward this directly to a supervisor.",
            },
            {
              title: "Paid name change — confirm fee (English)",
              content:
                "This falls outside the free exceptions, so it's a paid name change — let me check the current fee with a supervisor before I quote it to you.",
            },
          ],
          emailTemplates: [
            {
              title: "Free spelling correction request",
              subject: "Free spelling correction request",
              body: "Dear [Customer Name],\n\nThank you for flagging the spelling discrepancy between your booking and passport.\n\nThis qualifies as a free spelling correction. We've forwarded your request directly to a supervisor for processing — no charge applies.\n\nBest regards,\nAir Arabia Customer Support",
            },
            {
              title: "Free name update after marriage",
              subject: "Free name update after marriage",
              body: "Dear [Customer Name],\n\nThank you for your request to update your ticket to your spouse's last name.\n\nThis update is free of charge. Please send proof of documents (e.g. marriage certificate) — we're forwarding this directly to a supervisor for processing.\n\nBest regards,\nAir Arabia Customer Support",
            },
            {
              title: "Paid name change — fee to be confirmed",
              subject: "Your name change request",
              body: "Dear [Customer Name],\n\nThank you for your name change request.\n\nAs this falls outside our two free exceptions (spelling correction, genuine last-name change with proof), it's handled as a paid case. We're confirming the current fee with our team and will follow up shortly.\n\nBest regards,\nAir Arabia Customer Support",
            },
          ],
        }),
      },
    });
    console.log(`E5 Name Change: created article #${article.id}.`);
    articleId = article.id;
  }

  const existingTree = await prisma.decisionTree.findFirst({ where: { title: "E5 Name Change — Which Category?" } });
  if (existingTree) {
    console.log(`E5 Name Change: tree already exists (#${existingTree.id}) — skipping.`);
    return articleId;
  }

  const nodes: DecisionTreeNodeInput[] = [
    {
      clientKey: 1,
      type: "question",
      text: "What kind of name change is this?",
      order: 1,
      options: [
        { label: "Genuine spelling correction", targetClientKey: 2 },
        { label: "Genuine last-name change (e.g. marriage) with proof", targetClientKey: 2 },
        { label: "Anything else", targetClientKey: 3 },
      ],
    },
    { clientKey: 2, type: "outcome", order: 2, text: "Free of charge. Send the request directly to a supervisor with the supporting document (e.g. marriage certificate, ID/passport mismatch proof). These are the only two free exceptions.", options: [] },
    { clientKey: 3, type: "outcome", order: 3, text: "Paid name change — confirm the current fee with a supervisor before quoting it; it isn't yet standardized in this KB.", options: [] },
  ];

  const tree = await createDecisionTree({
    title: "E5 Name Change — Which Category?",
    slug: `e5-name-change-which-category-${Date.now()}`,
    description: "Free exception, or a paid case to confirm with a supervisor.",
    topic: "E5",
    status: "Published",
    author: AUTHOR,
    sourceArticleId: articleId,
    nodes,
  });
  console.log(`E5 Name Change: created tree #${tree.id}.`);

  return articleId;
}

// ---------------------------------------------------------------------------
// 2. Queue the 8 ScheduledChange rows — nothing below this point touches live content.
// ---------------------------------------------------------------------------

const SUSPENSION_BANNER =
  "**Effective 1 August 2026:** the paid Name Change option (credit card/cash or previous credit voucher) is suspended. Passengers who need post-booking flexibility should be directed to book the Value or Ultimate bundle (includes a refund option, applicable fees apply) — this can't be retrofitted onto an existing booking. Free-of-charge exceptions continue unchanged: genuine spelling corrections, and genuine last-name changes with applicable proof documents. Applies across G9, E5, 3L and 9P.\n\n";

const SUSPENSION_NOTE =
  "SUSPENDED EFFECTIVE 1 AUGUST 2026 — the paid Name Change option (credit card/cash or family credit voucher) is no longer offered. Redirect passengers who want post-booking flexibility to the Value or Ultimate bundle at time of booking (includes a refund option, applicable fees apply). Free exceptions (genuine spelling correction, genuine last-name change with proof) are unaffected and continue via the existing supervisor process.";

async function scheduleArticleSuspension(
  slug: string,
  label: string,
  overrides: {
    chatTemplates: { title: string; content: string }[];
    emailTemplates: { title: string; subject: string; body: string }[];
  }
) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      procedures: true,
      dispositions: true,
      escalations: true,
      notes: true,
      references: true,
      keywords: true,
      scenarios: true,
      images: true,
      attachments: true,
      chatTemplates: true,
      emailTemplates: true,
    },
  });
  if (!article) throw new Error(`Article not found: ${slug}`);

  const existing = await prisma.scheduledChange.findFirst({
    where: { entityType: "Article", entityId: article.id, label },
  });
  if (existing) {
    console.log(`${label}: already scheduled (#${existing.id}) — skipping.`);
    return;
  }

  const payload: ArticleChangePayload = {
    title: article.title,
    categoryId: article.categoryId,
    folderId: article.folderId,
    description: article.description,
    overview: article.overview.startsWith("**Effective 1 August 2026:**") ? article.overview : SUSPENSION_BANNER + article.overview,
    author: article.author,
    status: article.status,
    coverImage: article.coverImage,
    procedures: article.procedures.map((p) => ({ title: p.title ?? undefined, content: p.content, image: p.image ?? undefined })),
    dispositions: article.dispositions.map((d) => ({
      category: d.category ?? undefined,
      code: d.code ?? undefined,
      content: d.content,
      scenario: d.scenario ?? undefined,
      images: d.images,
    })),
    escalations: article.escalations.map((e) => ({
      department: e.department ?? undefined,
      condition: e.condition ?? undefined,
      content: e.content,
      images: e.images,
    })),
    notes: [
      ...article.notes.map((n) => ({ type: n.type, content: n.content, images: n.images })),
      { type: "Warning", content: SUSPENSION_NOTE },
    ],
    references: article.references.map((r) => ({ title: r.title, type: r.type, link: r.link ?? undefined, images: r.images })),
    keywords: article.keywords.map((k) => k.value),
    scenarios: article.scenarios.map((s) => ({ situation: s.situation, response: s.response, images: s.images })),
    images: article.images.map((i) => ({ url: i.image })),
    attachments: article.attachments.map((a) => ({ fileName: a.fileName, url: a.url, mimeType: a.mimeType, size: a.size })),
    chatTemplates: overrides.chatTemplates,
    emailTemplates: overrides.emailTemplates,
    updates: [
      {
        title: "Paid Name Change suspended",
        content:
          "Per company memo: paid Name Change (credit card/cash or family credit voucher) suspended effective 1 Aug 2026 across G9, E5, 3L and 9P. Free exceptions (spelling correction, genuine last-name change with proof) unaffected.",
        userName: AUTHOR,
      },
    ],
  };

  const change = await prisma.scheduledChange.create({
    data: {
      entityType: "Article",
      entityId: article.id,
      label,
      effectiveDate: EFFECTIVE_DATE,
      status: "Pending",
      payload: payload as unknown as Prisma.InputJsonValue,
      createdBy: AUTHOR,
    },
  });
  console.log(`${label}: scheduled (#${change.id}) for ${EFFECTIVE_DATE.toISOString()}.`);
}

async function scheduleTreeSuspension(
  title: string,
  label: string,
  rewrite: (nodes: { id: number; type: string; text: string }[]) => { paidId: number; familyId: number; freeId: number; questionId: number }
) {
  const tree = await prisma.decisionTree.findFirst({
    where: { title },
    include: { nodes: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } } },
  });
  if (!tree) throw new Error(`Tree not found: ${title}`);

  const existing = await prisma.scheduledChange.findFirst({
    where: { entityType: "DecisionTree", entityId: tree.id, label },
  });
  if (existing) {
    console.log(`${label}: already scheduled (#${existing.id}) — skipping.`);
    return;
  }

  const { paidId, familyId, freeId, questionId } = rewrite(
    tree.nodes.map((n) => ({ id: n.id, type: n.type, text: n.text }))
  );

  const nodes: DecisionTreeNodeInput[] = tree.nodes.map((node) => {
    let text = node.text;
    if (node.id === paidId) {
      text =
        "SUSPENDED EFFECTIVE 1 AUGUST 2026 — the paid Name Change option (credit card/cash) is no longer offered. Advise the passenger that post-booking flexibility now requires booking the Value or Ultimate bundle (includes a refund option, applicable fees apply) — it can't be added retroactively to an existing booking.";
    } else if (node.id === familyId) {
      text =
        "SUSPENDED EFFECTIVE 1 AUGUST 2026 — paid Name Change funded by a previous credit voucher (immediate family) is suspended on the same terms as the credit/cash path. Advise the passenger to use Value/Ultimate bundle flexibility going forward.";
    } else if (node.id === freeId) {
      text =
        "Free of charge — unaffected by the paid-option suspension. Two allowed exceptions only: (1) a genuine spelling correction, and (2) a genuine last-name change (e.g. after marriage) with applicable proof documents. Send the request directly to a supervisor with the supporting document. Don't process anything outside these two exceptions as a free case.";
    }

    return {
      clientKey: node.id,
      type: node.type as "question" | "outcome",
      text,
      image: node.image ?? undefined,
      order: node.order,
      options: node.options.map((opt) => ({
        label:
          node.id === questionId && opt.targetNodeId === freeId
            ? "Free exception — spelling correction or genuine last-name change"
            : opt.label,
        targetClientKey: opt.targetNodeId,
        targetTreeId: opt.targetTreeId ?? undefined,
      })),
    };
  });

  const payload: DecisionTreeInput = {
    title: tree.title,
    slug: tree.slug,
    description: tree.description ?? undefined,
    topic: tree.topic ?? undefined,
    status: tree.status,
    author: tree.author,
    sourceArticleId: tree.sourceArticleId,
    nodes,
  };

  const change = await prisma.scheduledChange.create({
    data: {
      entityType: "DecisionTree",
      entityId: tree.id,
      label,
      effectiveDate: EFFECTIVE_DATE,
      status: "Pending",
      payload: payload as unknown as Prisma.InputJsonValue,
      createdBy: AUTHOR,
    },
  });
  console.log(`${label}: scheduled (#${change.id}) for ${EFFECTIVE_DATE.toISOString()}.`);
}

// E5's tree has a different (2-outcome) shape than G9/9P/3L — no family-voucher branch,
// and its "anything else" outcome today reads "confirm the fee with a supervisor"
// rather than a fee, since no pre-suspension E5 fee is documented in this KB. That
// outcome is what needs to flip to "not offered" on 1 Aug.
async function scheduleE5TreeSuspension() {
  const title = "E5 Name Change — Which Category?";
  const label = "E5 Name Change tree — paid option suspension";

  const tree = await prisma.decisionTree.findFirst({
    where: { title },
    include: { nodes: { orderBy: { order: "asc" }, include: { options: { orderBy: { order: "asc" } } } } },
  });
  if (!tree) throw new Error(`Tree not found: ${title}`);

  const existing = await prisma.scheduledChange.findFirst({
    where: { entityType: "DecisionTree", entityId: tree.id, label },
  });
  if (existing) {
    console.log(`${label}: already scheduled (#${existing.id}) — skipping.`);
    return;
  }

  const outcomes = tree.nodes.filter((n) => n.type === "outcome");
  const free = outcomes.find((n) => /free of charge/i.test(n.text));
  const paid = outcomes.find((n) => n.id !== free?.id);
  if (!free || !paid) {
    throw new Error("Could not identify free/paid nodes on the E5 Name Change tree by content — tree shape may have changed.");
  }

  const nodes: DecisionTreeNodeInput[] = tree.nodes.map((node) => ({
    clientKey: node.id,
    type: node.type as "question" | "outcome",
    text:
      node.id === paid.id
        ? "Not offered — the paid Name Change option was suspended effective 1 August 2026. Do not process a paid name change under any circumstances. Advise the passenger that post-booking flexibility now requires booking the Value or Ultimate bundle (includes a refund option, applicable fees apply) at time of booking — it can't be added retroactively to an existing booking."
        : node.text,
    image: node.image ?? undefined,
    order: node.order,
    options: node.options.map((opt) => ({
      label: opt.label,
      targetClientKey: opt.targetNodeId,
      targetTreeId: opt.targetTreeId ?? undefined,
    })),
  }));

  const payload: DecisionTreeInput = {
    title: tree.title,
    slug: tree.slug,
    description: tree.description ?? undefined,
    topic: tree.topic ?? undefined,
    status: tree.status,
    author: tree.author,
    sourceArticleId: tree.sourceArticleId,
    nodes,
  };

  const change = await prisma.scheduledChange.create({
    data: {
      entityType: "DecisionTree",
      entityId: tree.id,
      label,
      effectiveDate: EFFECTIVE_DATE,
      status: "Pending",
      payload: payload as unknown as Prisma.InputJsonValue,
      createdBy: AUTHOR,
    },
  });
  console.log(`${label}: scheduled (#${change.id}) for ${EFFECTIVE_DATE.toISOString()}.`);
}

// Finds the paid/family/free/question node ids by content, not position — robust
// whether or not a given tree has already picked up other unrelated edits.
function identifyNameChangeNodes(nodes: { id: number; type: string; text: string }[]) {
  const question = nodes.find((n) => n.type === "question");
  const outcomes = nodes.filter((n) => n.type === "outcome");
  const family = outcomes.find((n) => /sprinklr/i.test(n.text));
  const free = outcomes.find((n) => /free of charge/i.test(n.text));
  const paid = outcomes.find((n) => n.id !== family?.id && n.id !== free?.id);

  if (!question || !family || !free || !paid) {
    throw new Error("Could not identify paid/family/free/question nodes by content — tree shape may have changed.");
  }

  return { questionId: question.id, familyId: family.id, freeId: free.id, paidId: paid.id };
}

// ---------------------------------------------------------------------------
// 3. Broaden the EscalationContact entry now (informational, not scheduled).
// ---------------------------------------------------------------------------

async function updateEscalationContact() {
  const entry = await prisma.escalationContact.findFirst({
    where: { issueType: "Free Name Spelling Amendment / Correction" },
  });
  if (!entry) {
    console.warn("EscalationContact 'Free Name Spelling Amendment / Correction' not found — skipping.");
    return;
  }
  const newNotes =
    "Applies to G9, 9P, 3L and E5 free spelling corrections and genuine last-name changes (e.g. marriage) with proof. The paid Name Change option is scheduled to be suspended effective 1 Aug 2026 across all four (see /admin/scheduled-changes). For 3O, use the SP/DS case flow in the Name Correction decision tree instead (separate, unaffected policy).";
  if (entry.notes === newNotes) {
    console.log("EscalationContact: already up to date — skipping.");
    return;
  }
  await prisma.escalationContact.update({ where: { id: entry.id }, data: { notes: newNotes } });
  console.log("EscalationContact: updated notes for upcoming suspension + 3L/E5 coverage.");
}

async function main() {
  await ensureThreeLArticleAndTree();
  await ensureE5ArticleAndTree();

  await scheduleArticleSuspension("g9-name-change-g9", "G9 Name Change — paid option suspension", {
    chatTemplates: [
      {
        title: "Paid name change no longer available (English)",
        content:
          "I'm sorry, but as of 1 August 2026 the paid Name Change option has been suspended, so this isn't something we can process for a fee anymore. If you'd like flexibility on a future booking, I'd recommend booking the Value or Ultimate bundle, which includes a refund option.",
      },
      {
        title: "Name change via family credit no longer available (English)",
        content:
          "I understand you were hoping to use your sibling's credit voucher for this — but that paid name-change route was suspended on 1 August 2026 and isn't available anymore, regardless of the funding source.",
      },
      {
        title: "Free spelling correction request (English)",
        content:
          "Not a problem at all — a spelling correction like that is completely free and unaffected by the recent suspension of paid name changes. I'll send this directly to a supervisor to process.",
      },
    ],
    emailTemplates: [
      {
        title: "Paid name change no longer available",
        subject: "Paid name change no longer available",
        body: "Dear [Customer Name],\n\nThank you for your name change request.\n\nEffective 1 August 2026, the paid Name Change option has been suspended and can no longer be processed for a fee. For flexibility on a future booking, we'd recommend the Value or Ultimate bundle, which includes a refund option (applicable fees apply).\n\nBest regards,\nAir Arabia Customer Support",
      },
      {
        title: "Name change via family credit no longer available",
        subject: "Name change via family credit no longer available",
        body: "Dear [Customer Name],\n\nThank you for your request to apply your family member's credit voucher to your booking with a name change.\n\nEffective 1 August 2026, paid name changes — including those funded by a family member's credit voucher — have been suspended and are no longer available.\n\nBest regards,\nAir Arabia Customer Support",
      },
      {
        title: "Free spelling correction request",
        subject: "Free spelling correction request",
        body: "Dear [Customer Name],\n\nThank you for flagging the spelling discrepancy between your booking and passport.\n\nThis qualifies as a free spelling correction, which remains unaffected by the 1 August 2026 suspension of paid name changes. We've forwarded your request directly to a supervisor for processing — no charge applies.\n\nBest regards,\nAir Arabia Customer Support",
      },
    ],
  });

  await scheduleArticleSuspension("9p-name-change-9p", "9P Name Change — paid option suspension", {
    chatTemplates: [
      {
        title: "Paid name change no longer available (English)",
        content:
          "I'm sorry, but as of 1 August 2026 the paid Name Change option has been suspended, so this isn't something we can process for a fee anymore, in AED or PKR. For flexibility on a future booking, I'd recommend the Value or Ultimate bundle, which includes a refund option.",
      },
      {
        title: "Name change via family credit no longer available (English)",
        content:
          "I understand you were hoping to use your spouse's credit voucher for this — but that paid route was suspended on 1 August 2026 and isn't available anymore, regardless of the funding source.",
      },
      {
        title: "Free name update after marriage (English)",
        content:
          "Congratulations on the wedding! Updating to your husband's last name is free of charge and unaffected by the recent suspension of paid name changes — please send proof of documents like the marriage certificate, and I'll forward this directly to a supervisor.",
      },
    ],
    emailTemplates: [
      {
        title: "Paid name change no longer available",
        subject: "Paid name change no longer available",
        body: "Dear [Customer Name],\n\nThank you for asking about the name change fee.\n\nEffective 1 August 2026, the paid Name Change option has been suspended (both the AED and PKR fee) and can no longer be processed. For flexibility on a future booking, we'd recommend the Value or Ultimate bundle, which includes a refund option (applicable fees apply).\n\nBest regards,\nAir Arabia Customer Support",
      },
      {
        title: "Name change via family credit no longer available",
        subject: "Name change via family credit no longer available",
        body: "Dear [Customer Name],\n\nThank you for your request to use a credit voucher for a name change on your international 9P sector for your spouse.\n\nEffective 1 August 2026, paid name changes — including those funded by a family member's credit voucher — have been suspended and are no longer available.\n\nBest regards,\nAir Arabia Customer Support",
      },
      {
        title: "Free name update after marriage",
        subject: "Free name update after marriage",
        body: "Dear [Customer Name],\n\nThank you for your request to update your ticket to your husband's last name.\n\nThis update is free of charge and remains unaffected by the 1 August 2026 suspension of paid name changes. Please send proof of documents (e.g. marriage certificate) — we're forwarding this directly to a supervisor for processing.\n\nBest regards,\nAir Arabia Customer Support",
      },
    ],
  });

  const threeLArticle = await prisma.article.findUnique({ where: { slug: "3l-name-change-3l" } });
  if (threeLArticle) {
    await scheduleArticleSuspension("3l-name-change-3l", "3L Name Change — paid option suspension", {
      chatTemplates: [
        {
          title: "Paid name change no longer available (English)",
          content:
            "I'm sorry, but as of 1 August 2026 the paid Name Change option has been suspended on 3L, so this isn't something we can process for a fee anymore. For flexibility on a future booking, I'd recommend the Value or Ultimate bundle, which includes a refund option.",
        },
        {
          title: "Name change via family credit no longer available (English)",
          content:
            "I understand you were hoping to use your spouse's credit voucher for this — but that paid route was suspended on 1 August 2026 and isn't available anymore, regardless of the funding source.",
        },
        {
          title: "Free spelling correction request (English)",
          content:
            "Not a problem at all — a spelling correction like that is completely free and unaffected by the recent suspension of paid name changes. I'll send this directly to a supervisor to process.",
        },
      ],
      emailTemplates: [
        {
          title: "Paid name change no longer available",
          subject: "Paid name change no longer available",
          body: "Dear [Customer Name],\n\nThank you for your name change request on your 3L booking.\n\nEffective 1 August 2026, the paid Name Change option has been suspended on 3L and can no longer be processed for a fee. For flexibility on a future booking, we'd recommend the Value or Ultimate bundle, which includes a refund option (applicable fees apply).\n\nBest regards,\nAir Arabia Customer Support",
        },
        {
          title: "Name change via family credit no longer available",
          subject: "Name change via family credit no longer available",
          body: "Dear [Customer Name],\n\nThank you for your request to apply your spouse's credit voucher to your booking with a name change.\n\nEffective 1 August 2026, paid name changes — including those funded by a family member's credit voucher — have been suspended on 3L and are no longer available.\n\nBest regards,\nAir Arabia Customer Support",
        },
        {
          title: "Free spelling correction request",
          subject: "Free spelling correction request",
          body: "Dear [Customer Name],\n\nThank you for flagging the spelling discrepancy between your booking and passport.\n\nThis qualifies as a free spelling correction, which remains unaffected by the 1 August 2026 suspension of paid name changes. We've forwarded your request directly to a supervisor for processing — no charge applies.\n\nBest regards,\nAir Arabia Customer Support",
        },
      ],
    });
  }

  const e5Article = await prisma.article.findUnique({ where: { slug: "e5-name-change-e5" } });
  if (e5Article) {
    await scheduleArticleSuspension("e5-name-change-e5", "E5 Name Change — paid option suspension", {
      chatTemplates: [
        {
          title: "Paid name change no longer available (English)",
          content:
            "I'm sorry, but the paid Name Change option was suspended on 1 August 2026 and isn't available anymore. If you'd like flexibility on a future booking, I'd recommend booking the Value or Ultimate bundle, which includes a refund option.",
        },
        {
          title: "Free spelling correction request (English)",
          content:
            "Not a problem at all — a spelling correction like that is completely free and unaffected by the suspension of paid name changes. I'll send this directly to a supervisor to process.",
        },
        {
          title: "Free name update after marriage (English)",
          content:
            "Congratulations on the wedding! Updating to your husband's last name is free of charge and unaffected by the suspension of paid name changes — please send proof of documents like the marriage certificate, and I'll forward this directly to a supervisor.",
        },
      ],
      emailTemplates: [
        {
          title: "Paid name change no longer available",
          subject: "Paid name change no longer available",
          body: "Dear [Customer Name],\n\nThank you for your name change request.\n\nThe paid Name Change option was suspended effective 1 August 2026 and is no longer available. For flexibility on a future booking, we'd recommend the Value or Ultimate bundle, which includes a refund option (applicable fees apply).\n\nBest regards,\nAir Arabia Customer Support",
        },
        {
          title: "Free spelling correction request",
          subject: "Free spelling correction request",
          body: "Dear [Customer Name],\n\nThank you for flagging the spelling discrepancy between your booking and passport.\n\nThis qualifies as a free spelling correction, which remains unaffected by the 1 August 2026 suspension of paid name changes. We've forwarded your request directly to a supervisor for processing — no charge applies.\n\nBest regards,\nAir Arabia Customer Support",
        },
        {
          title: "Free name update after marriage",
          subject: "Free name update after marriage",
          body: "Dear [Customer Name],\n\nThank you for your request to update your ticket to your husband's last name.\n\nThis update is free of charge and remains unaffected by the 1 August 2026 suspension of paid name changes. Please send proof of documents (e.g. marriage certificate) — we're forwarding this directly to a supervisor for processing.\n\nBest regards,\nAir Arabia Customer Support",
        },
      ],
    });
  }

  await scheduleTreeSuspension("G9 Name Change — How Is It Being Paid?", "G9 Name Change tree — paid option suspension", identifyNameChangeNodes);
  await scheduleTreeSuspension("9P Name Change — How Is It Being Paid?", "9P Name Change tree — paid option suspension", identifyNameChangeNodes);
  if (threeLArticle) {
    await scheduleTreeSuspension("3L Name Change — How Is It Being Paid?", "3L Name Change tree — paid option suspension", identifyNameChangeNodes);
  }
  if (e5Article) {
    await scheduleE5TreeSuspension();
  }

  await updateEscalationContact();
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
