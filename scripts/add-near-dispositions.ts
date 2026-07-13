import { prisma } from "../lib/prisma";

interface NearRow {
  type: string;
  subtype: string;
  scenario: string;
  articleTitle: string;
}

// Secondary, genuinely-relevant article attachments for wrap-up rows that already have
// a primary home (see scripts/add-wrapup-disposition-guide.ts). Quality-first: only rows
// with a real, defensible second use case are included here — no loose/forced fits.
const NEAR_ROWS: NearRow[] = [
  // Payment-issue complaints are handled from both the Payments article and the
  // Handling Complaints workflow (which already has a dedicated "payment issues" procedure).
  { type: "Payement & system issues", subtype: "Payment issue New Booking", scenario: "Complaints related to payment issues during a new booking", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },
  { type: "Payement & system issues", subtype: "Payment issue New Booking", scenario: "Complaints related to payment issues during a new booking", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Payement & system issues", subtype: "Payment issue Modification", scenario: "Complaints related to payment issues during modification", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Payement & system issues", subtype: "Payment issue Modification", scenario: "Complaints related to payment issues during modification", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Payement & system issues", subtype: "Payment issue Ancillaries", scenario: "Complaints related to payment issues during adding ancillaries", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Payement & system issues", subtype: "Duplicate Payment", scenario: "Complaints related to duplicate payment", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Payement & system issues", subtype: "Currency issue", scenario: "Complaints related to currency rate/issue during payment", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Payement & system issues", subtype: "Resend payment link", scenario: "Resending payment link requests", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },
  { type: "Payement & system issues", subtype: "System issue", scenario: "Complaints related to system issues", articleTitle: "Contact Center Systems Overview – Accel Aero, Sprinklr, Caesar & Teams" },

  // Baggage complaints are a common entry point via the general complaints article too.
  { type: "Complaint", subtype: "Baggage issues", scenario: "Complaints related Baggage delay, damage, lost,…", articleTitle: "Handling Complaints – All Hubs" },

  // Complaint subtypes that map to a specific topical article beyond the general complaints flow.
  { type: "Complaint", subtype: "Airrewards", scenario: "Complaints related to Airrewards.", articleTitle: "AirRewards Loyalty Program – All Hubs" },
  { type: "Complaint", subtype: "Visa related", scenario: "Complaints related to visas issues", articleTitle: "Visa Applications & Visa-Change Bookings – All Hubs" },
  { type: "Complaint", subtype: "City/online Check-in", scenario: "Complaints related to city check-in or online check-in", articleTitle: "Online Check-in – All Hubs" },
  { type: "Complaint", subtype: "City/online Check-in", scenario: "Complaints related to city check-in or online check-in", articleTitle: "City Check-in – G9 & 3L Only" },
  { type: "Complaint", subtype: "Holidays related", scenario: "Complaints related to holidays", articleTitle: "Air Arabia Holidays – G9" },
  { type: "Complaint", subtype: "Flight Alert related", scenario: "Complaints related to flight alerts that does not include any action taken from our side", articleTitle: "Flight Rescheduling Flexibility Rules – All Hubs" },

  // Credit amount not suitable is a cancellation-flow rejection, but it's fundamentally a credit question.
  { type: "Cancellation", subtype: "Credit amount not suitable", scenario: "Cancellation request was not done as credit amount is not suitable", articleTitle: "Using Credit Vouchers for a New Booking – All Hubs" },

  // Verification failures are a Caller Verification concern regardless of which flow triggered them.
  { type: "Modification", subtype: "Verification Failed", scenario: "Caller verification failed during the modification process.", articleTitle: "Caller Verification – All Hubs" },
  { type: "Cancellation", subtype: "Verification Failed", scenario: "Caller verification failed during the cancellation request.", articleTitle: "Caller Verification – All Hubs" },

  // Cairo refund requests are also a modification/cancellation-checklist matter.
  { type: "Inquiry/Requests", subtype: "Cairo refund", scenario: "Request for refund for Cairo flights.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },

  // Flight status inquiries commonly lead into flight-alert rescheduling questions.
  { type: "Inquiry/Requests", subtype: "Flight status confirmation", scenario: "Confirmation about flight depature and arrival time.", articleTitle: "Flight Rescheduling Flexibility Rules – All Hubs" },
  { type: "Inquiry/Requests", subtype: "Flight Status", scenario: "Inquiries about flight delays, advance, cancellation.", articleTitle: "Flight Rescheduling Flexibility Rules – All Hubs" },

  // No-show taxes come up directly in modification/cancellation calls.
  { type: "Inquiry/Requests", subtype: "No show taxes", scenario: "Requesting no-show taxes.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },

  // The two core baggage-allowance articles are used together.
  { type: "Baggage", subtype: "Restricted items", scenario: "Inquires about restricted items in baggage.", articleTitle: "Hand Carry & Checked-in Baggage Allowance – All Hubs" },

  // Airport services and airport transfers are frequently confused/asked together.
  { type: "Other Ancillary", subtype: "Airport services", scenario: "Inquires/requests related to airport services, like meet and assist, business lounge,..", articleTitle: "Airport Shuttle Bus Services – G9 & 3L" },
  { type: "Other Ancillary", subtype: "Airport transfers", scenario: "Inquires/requests related to transfers to/from airport", articleTitle: "Airport Services – Sharjah (SHJ) Airport Only" },

  // Online check-in issues often come with ancillary cut-off questions.
  { type: "Check-in", subtype: "Online checkin", scenario: "Inquiries about online check-in", articleTitle: "Ancillary Cut-off Times – All Hubs" },

  // Travel agency calls often resemble group-booking handling.
  { type: "Travel agency", subtype: "Travel agency", scenario: "Calls received from Travel agencies", articleTitle: "Group Booking Requests & Inquiries – All Hubs" },

  // Travel requirement guidance overlaps with visa/travel-document questions.
  { type: "Travel requirements", subtype: "Travel guidelines", scenario: "Inquires about travel guidelines related to vaccinations required.", articleTitle: "Visa Applications & Visa-Change Bookings – All Hubs" },
  { type: "Travel requirements", subtype: "Other inquiry", scenario: "Inquires related any other travel requirements", articleTitle: "Visa Applications & Visa-Change Bookings – All Hubs" },
];

async function main() {
  const articleTitles = Array.from(new Set(NEAR_ROWS.map((r) => r.articleTitle)));
  const articles = await prisma.article.findMany({
    where: { title: { in: articleTitles } },
    select: { id: true, title: true, dispositions: { select: { code: true } } },
  });

  const articleByTitle = new Map(articles.map((a) => [a.title, a]));

  for (const title of articleTitles) {
    const article = articleByTitle.get(title);
    if (!article) {
      console.warn(`Article not found: "${title}" — skipping its near dispositions.`);
      continue;
    }

    const existingCodes = new Set(article.dispositions.map((d) => d.code));
    const rowsForArticle = NEAR_ROWS.filter((r) => r.articleTitle === title);

    const toCreate = rowsForArticle
      .map((r) => ({ code: `${r.type} – ${r.subtype}`, content: r.scenario }))
      .filter((entry) => !existingCodes.has(entry.code));

    if (toCreate.length === 0) {
      console.log(`No new near dispositions to add for: ${title}`);
      continue;
    }

    await prisma.article.update({
      where: { id: article.id },
      data: { dispositions: { create: toCreate } },
    });

    console.log(`Added ${toCreate.length} near disposition(s) to: ${title}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
