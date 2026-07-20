import "dotenv/config";
import { prisma } from "../lib/prisma";

const USER = "Nourhan Khaled";

// 1. AUH promo's booking window (1-15 July 2026) has closed. Per instruction: keep it
// published as a reference (e.g. for "what was I quoted" questions) but make the expired
// status impossible to miss, instead of unpublishing it.
async function markAuhPromoExpired() {
  const article = await prisma.article.findFirst({ where: { title: { contains: "Abu Dhabi (AUH)" } } });
  if (!article) return console.warn("AUH promo article not found — skip.");
  if (article.title.includes("Expired")) return console.log("AUH promo already marked expired — skipping.");

  await prisma.article.update({
    where: { id: article.id },
    data: {
      title: article.title + " (Expired — Reference Only)",
      overview:
        "**This promotion has EXPIRED** — its booking window (1–15 July 2026) closed on 15 July 2026, and it can no longer be booked. The details below are kept for reference only (e.g. to confirm a fare a passenger was quoted during the window).\n\n" +
        article.overview,
    },
  });

  await prisma.note.updateMany({
    where: { articleId: article.id },
    data: {
      content:
        "EXPIRED as of 16 July 2026 (booking window was 1–15 July 2026) — no longer bookable. Kept published for reference only, e.g. to confirm what a passenger was quoted during the window. Do not offer this fare to a new caller.",
    },
  });

  await prisma.scenario.create({
    data: {
      articleId: article.id,
      situation: "A passenger says they booked during the AUH promo in early July and wants to confirm the fare they were quoted.",
      response:
        "This promotion's booking window was 1–15 July 2026 — if they booked within that window, the fare details in this article are correct for reference. It is no longer bookable for any new reservation.",
    },
  });

  await prisma.articleUpdate.create({
    data: {
      articleId: article.id,
      title: "Marked expired",
      content: "Booking window closed 15 July 2026. Kept published for reference with a clear expiry warning, per instruction not to remove expired promotions.",
      userName: USER,
    },
  });

  console.log(`Marked AUH promo (article ${article.id}) as expired-for-reference.`);
}

// 2. JED terminal note reformatted into a clear Current / Upcoming structure — both dates
// (12 and 21 Sept 2026) are still in the future relative to today.
async function reformatJedTerminal() {
  const airport = await prisma.airport.findFirst({ where: { code: "JED" } });
  if (!airport) return console.warn("JED not found — skip.");
  const newTerminal =
    "Current — G9 & E5: North Terminal; 9P: Hajj Terminal. Upcoming — all move to Terminal 4 (T4): 9P effective 12 Sept 2026, G9 & E5 effective 21 Sept 2026.";
  if (airport.terminal === newTerminal) return console.log("JED terminal already reformatted — skipping.");
  await prisma.airport.update({ where: { id: airport.id }, data: { terminal: newTerminal } });
  console.log("Reformatted JED terminal into Current/Upcoming structure.");
}

// 3. RUH's "Terminal 5 effective 25/02/2026" note is now in the past (today is 20 July
// 2026) — that change should already be in effect. Flip current terminal to Terminal 5,
// keep the old one as a dated historical reference rather than deleting it.
async function fixRuhTerminal() {
  const airport = await prisma.airport.findFirst({ where: { code: "RUH" } });
  if (!airport) return console.warn("RUH not found — skip.");
  const newTerminal = "Terminal 5 (changed from Terminal 3, effective 25 Feb 2026)";
  if (airport.terminal === newTerminal) return console.log("RUH terminal already fixed — skipping.");
  await prisma.airport.update({ where: { id: airport.id }, data: { terminal: newTerminal } });
  console.log("Fixed RUH terminal: effective date had already passed, flipped current terminal to Terminal 5.");
}

// 4. Dedupe near-identical Airport rows (same code, functionally the same airport).
async function dedupeAirports() {
  const dupesToDelete = [324, 356, 326, 300]; // keep 325 (IST), 357 (NDR/Nador), 323 (SAW), 301 (CMN "Terminal 2")
  const result = await prisma.airport.deleteMany({ where: { id: { in: dupesToDelete } } });
  console.log(`Deduped ${result.count} duplicate airport rows (IST, NDR, SAW, CMN).`);
}

// 5. The one Disruption row has a malformed airportCode field (a full sentence instead
// of a code) covering two airports (GIZ, AHB) — split into two proper rows.
async function fixDisruptionRow() {
  const bad = await prisma.disruption.findFirst({ where: { airportCode: { contains: "Flight cancellation" } } });
  if (!bad) return console.log("Malformed disruption row already fixed — skipping.");

  await prisma.disruption.create({
    data: { airportCode: "GIZ", message: bad.message, level: bad.level, active: bad.active },
  });
  await prisma.disruption.create({
    data: { airportCode: "AHB", message: bad.message, level: bad.level, active: bad.active },
  });
  await prisma.disruption.delete({ where: { id: bad.id } });

  console.log("Split malformed disruption row into two proper rows (GIZ, AHB).");
}

// 6. Populate the EscalationContact directory from what's currently scattered across
// individual articles' Escalation records, so there's one place to look up "who do I
// escalate X to" instead of hunting through articles.
async function populateEscalationContacts() {
  const entries = [
    {
      issueType: "Free Name Spelling Amendment / Correction",
      escalateTo: "Supervisor",
      contactInfo: "Send directly to your shift Supervisor with supporting documents (e.g. marriage certificate, ID/passport mismatch proof).",
      notes: "Applies to G9 and 9P free spelling/marriage-name corrections. For 3O, use the SP/DS case flow in the Name Correction decision tree instead.",
    },
    {
      issueType: "Falcon Travel Booking (G9)",
      escalateTo: "Supervisor",
      contactInfo: "Refer any falcon travel inquiry to your Supervisor before proceeding.",
      notes: "Collect passenger count, falcon count, and destination first.",
    },
    {
      issueType: "Urgent Same-Day Case (any hub)",
      escalateTo: "Microsoft Teams — relevant team channel",
      contactInfo: "Escalate directly on Teams to the relevant team's channel — do not wait for an email reply.",
      notes: "Used for same-day-flight name corrections and other time-critical requests.",
    },
    {
      issueType: "Non-Standard / Exceptional Case Escalation",
      escalateTo: "Manager",
      contactInfo: "Manager support should only be requested for genuinely non-standard or exceptional cases.",
      notes: "Do not escalate routine, clear-cut cases to a manager.",
    },
    {
      issueType: "Modification/Cancellation Exception Request",
      escalateTo: "Duty Supervisor",
      contactInfo: "Escalate exception requests to the Duty Supervisor for review.",
      notes: "Passenger requests a modification/cancellation/refund exception outside standard eligibility — do not grant directly.",
    },
    {
      issueType: "Escalated Complaint (senior review requested)",
      escalateTo: "Duty Supervisor",
      contactInfo: "Escalate the call live to the shift Duty Supervisor.",
      notes: "Use when empathy plus the standard fix doesn't resolve it, or the passenger explicitly asks for someone senior.",
    },
    {
      issueType: "Payment Debited, No Confirmed PNR",
      escalateTo: "Handling Complaints (Payment Issues) — Sprinklr",
      contactInfo: "Follow the payment-issue advanced-search and Sprinklr steps in Handling Complaints – All Hubs.",
      notes: "Do not attempt to rebook directly.",
    },
  ];

  for (const e of entries) {
    const existing = await prisma.escalationContact.findFirst({ where: { issueType: e.issueType } });
    if (existing) continue;
    await prisma.escalationContact.create({ data: e });
  }
  console.log(`Populated EscalationContact directory (added up to ${entries.length} entries).`);
}

// 7. Mirror the DO/DON'T + escalation-trigger guidance now in the G9/9P Name Change
// decision trees back into their source articles, so the guidance isn't tree-only.
async function mirrorDoDontIntoArticles() {
  const g9 = await prisma.article.findUnique({ where: { id: 101 }, include: { notes: true } });
  if (g9 && !g9.notes.some((n) => n.content.includes("DO:"))) {
    await prisma.note.createMany({
      data: [
        {
          articleId: 101,
          type: "Warning",
          content: "Credit card/cash name change — DO confirm the request is at least 24h before the first sector's departure, then process directly. DON'T process it if departure is under 24h without escalating to the Duty Supervisor.",
        },
        {
          articleId: 101,
          type: "Warning",
          content: "Previous-credit name change — DO confirm the requester is an immediate family member, raise a Sprinklr case, and ask for proof of relationship. DON'T process it for a non-immediate-family requester or skip the proof request. Urgent same-day-flight case: escalate via Teams and follow up until resolved.",
        },
        {
          articleId: 101,
          type: "Information",
          content: "Free spelling correction — DO send it directly to a Supervisor with supporting documents. DON'T raise it as a paid name-change case.",
        },
      ],
    });
    console.log("Mirrored DO/DON'T guidance into G9 Name Change article (101).");
  }

  const p9 = await prisma.article.findUnique({ where: { id: 116 }, include: { notes: true } });
  if (p9 && !p9.notes.some((n) => n.content.includes("DO:"))) {
    await prisma.note.createMany({
      data: [
        {
          articleId: 116,
          type: "Warning",
          content: "Credit card/cash name change — DO confirm the request is at least 24h before the first sector's departure, then process directly. DON'T process it if departure is under 24h without escalating to the Duty Supervisor.",
        },
        {
          articleId: 116,
          type: "Warning",
          content: "Previous-credit name change — DO confirm the requester is an immediate family member, raise a Sprinklr case, and ask for proof of relationship. DON'T process it for a non-immediate-family requester or skip the proof request. Urgent same-day-flight case: escalate via Teams and follow up until resolved.",
        },
        {
          articleId: 116,
          type: "Information",
          content: "Free spelling correction — DO send it directly to a Supervisor with supporting documents. DON'T raise it as a paid name-change case.",
        },
      ],
    });
    console.log("Mirrored DO/DON'T guidance into 9P Name Change article (116).");
  }
}

// 8. Backfill ArticleUpdate changelog entries for this session's content edits, since the
// table was completely empty despite being the built-in mechanism for this.
async function backfillChangelog() {
  const entries: { articleId: number; title: string; content: string }[] = [
    { articleId: 113, title: "Fixed refund fee", content: "Corrected International Value bundle refund fee from AED 390 to AED 300 to match the current fare chart." },
    { articleId: 99, title: "Removed misattributed price", content: "Removed an incorrect AED 145 Business Lounge price — that figure belongs to Sharjah Home Check-in, not the lounge." },
    { articleId: 87, title: "Added bassinet spec", content: "Added baby bassinet age/size specification (9-12 months, up to 74cm/11kg)." },
    { articleId: 89, title: "Added wheelchair charges", content: "Added wheelchair assistance charges by departure airport (Sharjah, Abu Dhabi)." },
    { articleId: 156, title: "Added cutoff times; resolved draft caveat", content: "Added Call Center booking-creation cutoff times by region; resolved the internal draft-review caveat after verifying against the training deck." },
    { articleId: 138, title: "Clarified payment channels", content: "Clarified that online payment carries no extra fee, and per-country charges apply specifically to paying at a local office/exchange house; added named service providers by country." },
    { articleId: 101, title: "Added DO/DON'T guidance", content: "Added call-handling DO/DON'T guidance and escalation triggers, mirroring the decision tree." },
    { articleId: 116, title: "Added DO/DON'T guidance", content: "Added call-handling DO/DON'T guidance and escalation triggers, mirroring the decision tree." },
  ];

  for (const e of entries) {
    const existing = await prisma.articleUpdate.findFirst({ where: { articleId: e.articleId, title: e.title } });
    if (existing) continue;
    await prisma.articleUpdate.create({ data: { ...e, userName: USER } });
  }
  console.log(`Backfilled ${entries.length} ArticleUpdate changelog entries.`);
}

async function main() {
  await markAuhPromoExpired();
  await reformatJedTerminal();
  await fixRuhTerminal();
  await dedupeAirports();
  await fixDisruptionRow();
  await populateEscalationContacts();
  await mirrorDoDontIntoArticles();
  await backfillChangelog();
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
