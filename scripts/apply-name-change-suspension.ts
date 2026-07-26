import "dotenv/config";
import { prisma } from "../lib/prisma";
import { updateDecisionTree, createDecisionTree } from "../lib/decision-tree-service";
import { buildArticleSectionsCreateData } from "../lib/article-service";
import { emailBodyEn, emailBodyAr, type ArticleTemplateSet } from "./kb-templates/types";
import { G9_3L_TREES } from "./decision-trees/g9-3l";
import { NINE_P_TREES } from "./decision-trees/9p";
import { E5_TREES } from "./decision-trees/e5";
import { G9_3L_TEMPLATES } from "./kb-templates/g9-3l";
import { NINE_P_TEMPLATES } from "./kb-templates/9p";
import { E5_TEMPLATES } from "./kb-templates/e5";
import type { DecisionTreeSpec } from "./decision-trees/types";

// Applies the company memo (effective 1 Aug 2026: paid Name Change suspended across
// G9, E5, 3L, 9P; free exceptions unchanged — genuine spelling correction, genuine
// last-name change with proof) to the live KB. Pulls its text from the already-updated
// scripts/decision-trees/*.ts and scripts/kb-templates/*.ts spec files rather than
// duplicating the policy wording a third time, so the DB matches those source-of-truth
// files exactly. Only touches the 4 Name Change articles/trees + 1 escalation contact —
// does not run the general seed-decision-trees.ts / apply-professional-templates.ts,
// which would also touch every unrelated article's templates.

const AUTHOR = "Nourhan Khaled";

const BANNER =
  "**Policy change effective 1 August 2026:** the paid Name Change option (credit card/cash or previous credit voucher) is suspended. Passengers who need post-booking flexibility should be directed to book the Value or Ultimate bundle (includes a refund option, applicable fees apply) — this can't be retrofitted onto an existing booking. Free-of-charge exceptions continue unchanged: genuine spelling corrections, and genuine last-name changes with applicable proof documents. Applies across G9, E5, 3L and 9P.\n\n";

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

// 1. Add the suspension banner + warning note + changelog entry to the two existing
//    Name Change articles (G9, 9P).
async function updateExistingArticle(slug: string, label: string) {
  const article = await prisma.article.findUnique({ where: { slug }, include: { notes: true } });
  if (!article) throw new Error(`Article not found: ${slug}`);

  if (!article.overview.startsWith("**Policy change effective 1 August 2026:**")) {
    await prisma.article.update({ where: { id: article.id }, data: { overview: BANNER + article.overview } });
    console.log(`${label}: added suspension banner to overview.`);
  } else {
    console.log(`${label}: banner already present — skipping.`);
  }

  const hasNote = article.notes.some((n) => n.content.includes("SUSPENDED EFFECTIVE 1 AUGUST 2026"));
  if (!hasNote) {
    await prisma.note.create({
      data: {
        articleId: article.id,
        type: "Warning",
        content:
          "SUSPENDED EFFECTIVE 1 AUGUST 2026 — the paid Name Change option (credit card/cash or family credit voucher) is no longer offered. Redirect passengers who want post-booking flexibility to the Value or Ultimate bundle at time of booking (includes a refund option, applicable fees apply). Free exceptions (genuine spelling correction, genuine last-name change with proof) are unaffected and continue via the existing supervisor process.",
      },
    });
    console.log(`${label}: added suspension warning note.`);
  } else {
    console.log(`${label}: warning note already present — skipping.`);
  }

  const hasChangelog = await prisma.articleUpdate.findFirst({
    where: { articleId: article.id, title: "Paid Name Change suspended" },
  });
  if (!hasChangelog) {
    await prisma.articleUpdate.create({
      data: {
        articleId: article.id,
        title: "Paid Name Change suspended",
        content:
          "Per company memo: paid Name Change (credit card/cash or family credit voucher) suspended effective 1 Aug 2026 across G9, E5, 3L and 9P. Free exceptions (spelling correction, genuine last-name change with proof) unaffected. Updated overview, added warning note, and updated decision tree/chat/email content accordingly.",
        userName: AUTHOR,
      },
    });
    console.log(`${label}: added changelog entry.`);
  }

  return article;
}

// 2. Replace the G9 / 9P Name Change decision tree nodes with the (already-updated)
//    spec text from scripts/decision-trees/*.ts.
async function updateExistingTree(
  specs: DecisionTreeSpec[],
  title: string,
  sourceArticleId: number,
  label: string
) {
  const spec = specs.find((s) => s.title === title);
  if (!spec) throw new Error(`Spec not found for tree: ${title}`);

  const existing = await prisma.decisionTree.findFirst({ where: { title } });
  if (!existing) throw new Error(`Live tree not found: ${title}`);

  const specFirstOutcome = spec.nodes.find((n) => n.type === "outcome")?.text ?? "";
  const liveFirstOutcome = await prisma.decisionNode.findFirst({
    where: { treeId: existing.id, type: "outcome" },
    orderBy: { order: "asc" },
  });

  if (liveFirstOutcome?.text === specFirstOutcome) {
    console.log(`${label}: tree already up to date — skipping.`);
    return;
  }

  await updateDecisionTree(existing.id, {
    title: spec.title,
    slug: existing.slug,
    description: spec.description,
    topic: spec.topic,
    status: "Published",
    author: AUTHOR,
    sourceArticleId,
    nodes: spec.nodes.map((node) => ({
      clientKey: node.clientKey,
      type: node.type,
      text: node.text,
      order: node.clientKey,
      options: (node.options ?? []).map((opt) => ({ label: opt.label, targetClientKey: opt.targetClientKey })),
    })),
  });
  console.log(`${label}: tree nodes replaced with suspension-policy content.`);
}

// 3. Create the new 3L / E5 Name Change articles — neither hub had a dedicated
//    Name Change article in the KB before this policy.
interface NewArticleSpec {
  slug: string;
  title: string;
  siblingSlugForPlacement: string;
  description: string;
  overview: string;
  keywords: string[];
}

const NEW_ARTICLES: NewArticleSpec[] = [
  {
    slug: "3l-name-change-3l",
    title: "3L Name Change",
    siblingSlugForPlacement: "3l-early-home-check-in-abu-dhabi-sharjah-airports",
    description:
      "Paid Name Change suspended effective 1 Aug 2026 — free exceptions only (spelling correction, genuine last-name change with proof).",
    overview:
      BANNER +
      "Historically, 3L followed the same paid Name Change structure as G9: AED 350 per passenger + fare difference, 24h notice before the first sector's departure (credit card/cash, or a previous credit voucher for immediate family with a Sprinklr case and proof of relationship).\n\n" +
      "Effective 1 August 2026, that paid option is suspended. The only two free exceptions remain: a genuine spelling correction, or a genuine last-name change (e.g. after marriage) with proof documents — both sent directly to a supervisor.",
    keywords: ["name change", "spelling correction", "suspended", "3l"],
  },
  {
    slug: "e5-name-change-e5",
    title: "E5 Name Change",
    siblingSlugForPlacement: "e5-tv-handling-e5",
    description:
      "Paid Name Change suspended effective 1 Aug 2026 — free exceptions only (spelling correction, genuine last-name change with proof).",
    overview:
      BANNER +
      "Effective 1 August 2026, the paid Name Change option is suspended on E5. The only two free exceptions remain: a genuine spelling correction, or a genuine last-name change (e.g. after marriage) with proof documents — both sent directly to a supervisor. Anything outside these two exceptions is not offered; direct the passenger to book the Value or Ultimate bundle for future flexibility.",
    keywords: ["name change", "spelling correction", "suspended", "e5"],
  },
];

async function createNewArticle(spec: NewArticleSpec) {
  const existing = await prisma.article.findUnique({ where: { slug: spec.slug } });
  if (existing) {
    console.log(`${spec.title}: article already exists (#${existing.id}) — skipping creation.`);
    return existing;
  }

  const sibling = await prisma.article.findUnique({
    where: { slug: spec.siblingSlugForPlacement },
    select: { categoryId: true, folderId: true },
  });
  if (!sibling) throw new Error(`Sibling article not found for placement: ${spec.siblingSlugForPlacement}`);

  const article = await prisma.article.create({
    data: {
      title: spec.title,
      slug: spec.slug,
      categoryId: sibling.categoryId,
      folderId: sibling.folderId,
      description: spec.description,
      overview: spec.overview,
      author: AUTHOR,
      status: "Published",
      ...buildArticleSectionsCreateData({
        notes: [
          {
            type: "Warning",
            content:
              "SUSPENDED EFFECTIVE 1 AUGUST 2026 — the paid Name Change option is no longer offered. Redirect passengers who want post-booking flexibility to the Value or Ultimate bundle at time of booking (includes a refund option, applicable fees apply). Free exceptions (genuine spelling correction, genuine last-name change with proof) continue via the existing supervisor process.",
          },
        ],
        keywords: spec.keywords,
        updates: [
          {
            title: "Article created",
            content:
              "New article created to document the Name Change policy per the 1 Aug 2026 company memo suspending the paid option — this hub previously had no dedicated Name Change article in the KB.",
            userName: AUTHOR,
          },
        ],
      }),
    },
  });
  console.log(`${spec.title}: created article #${article.id}.`);
  return article;
}

// 4. Create the new 3L / E5 Name Change decision trees.
async function createNewTree(specs: DecisionTreeSpec[], title: string, sourceArticleId: number, label: string) {
  const existing = await prisma.decisionTree.findFirst({ where: { title } });
  if (existing) {
    console.log(`${label}: tree already exists (#${existing.id}) — skipping.`);
    return;
  }
  const spec = specs.find((s) => s.title === title);
  if (!spec) throw new Error(`Spec not found for tree: ${title}`);

  const tree = await createDecisionTree({
    title: spec.title,
    slug: `${slugify(spec.title)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    description: spec.description,
    topic: spec.topic,
    status: "Published",
    author: AUTHOR,
    sourceArticleId,
    nodes: spec.nodes.map((node) => ({
      clientKey: node.clientKey,
      type: node.type,
      text: node.text,
      order: node.clientKey,
      options: (node.options ?? []).map((opt) => ({ label: opt.label, targetClientKey: opt.targetClientKey })),
    })),
  });
  console.log(`${label}: created tree #${tree.id}.`);
}

// 5. Replace chat/email templates for exactly the 4 Name Change article slugs (does
//    NOT touch any other article's templates, unlike the general apply-professional-templates.ts).
const TEMPLATE_SLUGS = ["g9-name-change-g9", "9p-name-change-9p", "3l-name-change-3l", "e5-name-change-e5"];
const ALL_TEMPLATES: Record<string, ArticleTemplateSet> = {
  ...G9_3L_TEMPLATES,
  ...NINE_P_TEMPLATES,
  ...E5_TEMPLATES,
};

async function updateTemplates(slug: string) {
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) throw new Error(`Article not found for templates: ${slug}`);
  const set = ALL_TEMPLATES[slug];
  if (!set) throw new Error(`No template set found for slug: ${slug}`);

  await prisma.chatTemplate.deleteMany({ where: { articleId: article.id } });
  await prisma.emailTemplate.deleteMany({ where: { articleId: article.id } });

  const chatCreate = set.flatMap((s) => [
    { title: `${s.emailSubjectEn} (English)`, content: s.chatEn },
    { title: `${s.emailSubjectAr} (Arabic)`, content: s.chatAr },
  ]);
  const emailCreate = set.flatMap((s) => [
    { title: `${s.emailSubjectEn} (English)`, subject: s.emailSubjectEn, body: emailBodyEn(s.emailIssueEn, s.emailResolutionEn) },
    { title: `${s.emailSubjectAr} (Arabic)`, subject: s.emailSubjectAr, body: emailBodyAr(s.emailIssueAr, s.emailResolutionAr) },
  ]);

  await prisma.article.update({
    where: { id: article.id },
    data: { chatTemplates: { create: chatCreate }, emailTemplates: { create: emailCreate } },
  });
  console.log(`${slug}: replaced chat/email templates (${chatCreate.length} chat, ${emailCreate.length} email).`);
}

// 6. Broaden the EscalationContact "Free Name Spelling Amendment / Correction" entry
//    to cover 3L/E5 too, and name the second exception explicitly.
async function updateEscalationContact() {
  const entry = await prisma.escalationContact.findFirst({
    where: { issueType: "Free Name Spelling Amendment / Correction" },
  });
  if (!entry) {
    console.warn("EscalationContact 'Free Name Spelling Amendment / Correction' not found — skipping.");
    return;
  }
  const newNotes =
    "Applies to G9, 9P, 3L and E5 free spelling corrections and genuine last-name changes (e.g. marriage) with proof. Paid Name Change is suspended effective 1 Aug 2026 across all four. For 3O, use the SP/DS case flow in the Name Correction decision tree instead (separate, unaffected policy).";
  if (entry.notes === newNotes) {
    console.log("EscalationContact: already up to date — skipping.");
    return;
  }
  await prisma.escalationContact.update({ where: { id: entry.id }, data: { notes: newNotes } });
  console.log("EscalationContact: updated notes for suspension + 3L/E5 coverage.");
}

async function main() {
  const g9 = await updateExistingArticle("g9-name-change-g9", "G9 Name Change (101)");
  const p9 = await updateExistingArticle("9p-name-change-9p", "9P Name Change (116)");

  await updateExistingTree(G9_3L_TREES, "G9 Name Change — How Is It Being Paid?", g9.id, "G9 tree");
  await updateExistingTree(NINE_P_TREES, "9P Name Change — How Is It Being Paid?", p9.id, "9P tree");

  const threeL = await createNewArticle(NEW_ARTICLES[0]);
  const e5 = await createNewArticle(NEW_ARTICLES[1]);

  await createNewTree(G9_3L_TREES, "3L Name Change — How Is It Being Paid?", threeL.id, "3L tree");
  await createNewTree(E5_TREES, "E5 Name Change — Which Category?", e5.id, "E5 tree");

  for (const slug of TEMPLATE_SLUGS) {
    await updateTemplates(slug);
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
