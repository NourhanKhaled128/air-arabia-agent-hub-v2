import { prisma } from "../lib/prisma";

interface WrapupRow {
  type: string;
  subtype: string | null;
  scenario: string;
  articleTitle: string;
}

const WRAPUP_ROWS: WrapupRow[] = [
  { type: "New booking", subtype: "Flight full", scenario: "New Booking request was not done as flight is full.", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },
  { type: "New booking", subtype: "NB Inquiry", scenario: "New Booking inquiry and passenger did not to wish to book", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },
  { type: "New booking", subtype: "High price", scenario: "New Booking request was not done as price was high.", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },
  { type: "New booking", subtype: "Timing not suitable", scenario: "New Booking request was not done as flight time is not suitable.", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },
  { type: "New booking", subtype: "NB done", scenario: "New Booking request was done", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },
  { type: "New booking", subtype: "Discounts/offers", scenario: "Inquiry about discounts or offers", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },

  { type: "Modification", subtype: "Flight full", scenario: "Modification request was not done as flight is full.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Modification", subtype: "Modification Inquiry", scenario: "Modification inquiry and passenger did not to wish to proceed", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Modification", subtype: "High price", scenario: "Modification request was not done as price was high.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Modification", subtype: "Flight timing not suitable", scenario: "Modification request was not done as flight time is not suitable.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Modification", subtype: "Date change Done", scenario: "Date modification was completed.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Modification", subtype: "Destination change Done", scenario: "Destination change was completed.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Modification", subtype: "Not eligible", scenario: "Modification request but was not eligible.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Modification", subtype: "Verification Failed", scenario: "Caller verification failed during the modification process.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Modification", subtype: "Name change", scenario: "Name change request inquiry/completed", articleTitle: "Modification & Cancellation Checklists – All Hubs" },

  { type: "Cancellation", subtype: "Inquiry only", scenario: "Passenger inquired about cancellation only and did not proceed.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Cancellation", subtype: "Cancel Ticket", scenario: "Cancel of entire ticket was done", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Cancellation", subtype: "Cancel Segment", scenario: "Cancel of a specific segment of a ticket was done", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Cancellation", subtype: "Not eligible", scenario: "Cancellation request but was not eligible.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Cancellation", subtype: "Credit amount not suitable", scenario: "Cancellation request was not done as credit amount is not suitable", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Cancellation", subtype: "Verification Failed", scenario: "Caller verification failed during the cancellation request.", articleTitle: "Modification & Cancellation Checklists – All Hubs" },

  { type: "Flight Alert", subtype: "Modification request", scenario: "Modification is done due to flight Alert", articleTitle: "Flight Rescheduling Flexibility Rules – All Hubs" },
  { type: "Flight Alert", subtype: "Cancellation request", scenario: "Cancellation & credit voucher requests due to flight Alert", articleTitle: "Flight Rescheduling Flexibility Rules – All Hubs" },
  { type: "Flight Alert", subtype: "Refund request", scenario: "Refund is requested due to flight Alert", articleTitle: "Flight Rescheduling Flexibility Rules – All Hubs" },
  { type: "Flight Alert", subtype: "Confirm timings", scenario: "Confirmation of new flight timings due to a flight alert.", articleTitle: "Flight Rescheduling Flexibility Rules – All Hubs" },
  { type: "Flight Alert", subtype: "Other", scenario: "Any other requests related to flight alerts.", articleTitle: "Flight Rescheduling Flexibility Rules – All Hubs" },

  { type: "Payement & system issues", subtype: "Resend payment link", scenario: "Resending payment link requests", articleTitle: "Payment Channels & Charges – All Hubs" },
  { type: "Payement & system issues", subtype: "Payment issue New Booking", scenario: "Complaints related to payment issues during a new booking", articleTitle: "Payment Channels & Charges – All Hubs" },
  { type: "Payement & system issues", subtype: "Payment issue Modification", scenario: "Complaints related to payment issues during modification", articleTitle: "Payment Channels & Charges – All Hubs" },
  { type: "Payement & system issues", subtype: "Payment issue Ancillaries", scenario: "Complaints related to payment issues during adding ancillaries", articleTitle: "Payment Channels & Charges – All Hubs" },
  { type: "Payement & system issues", subtype: "Duplicate Payment", scenario: "Complaints related to duplicate payment", articleTitle: "Payment Channels & Charges – All Hubs" },
  { type: "Payement & system issues", subtype: "Currency issue", scenario: "Complaints related to currency rate/issue during payment", articleTitle: "Payment Channels & Charges – All Hubs" },
  { type: "Payement & system issues", subtype: "Payment options/charges", scenario: "Complaints related to payment options or charges", articleTitle: "Payment Channels & Charges – All Hubs" },
  { type: "Payement & system issues", subtype: "System issue", scenario: "Complaints related to system issues", articleTitle: "Payment Channels & Charges – All Hubs" },

  { type: "Baggage", subtype: "Baggage upgrade", scenario: "Inquires/requests related to increasing baggage allowance where option is available", articleTitle: "Hand Carry & Checked-in Baggage Allowance – All Hubs" },
  { type: "Baggage", subtype: "Baggage not available", scenario: "Inquires/requests related to increasing baggage allowance baggage but option is not available.", articleTitle: "Hand Carry & Checked-in Baggage Allowance – All Hubs" },
  { type: "Baggage", subtype: "Dimensions", scenario: "Inquires about baggage dimensions.", articleTitle: "Hand Carry & Checked-in Baggage Allowance – All Hubs" },
  { type: "Baggage", subtype: "Restricted items", scenario: "Inquires about restricted items in baggage.", articleTitle: "Restricted Items in Checked-in Baggage – All Hubs" },
  { type: "Baggage", subtype: "Baggage inquiry", scenario: "Inquires about other baggage inquiries", articleTitle: "Hand Carry & Checked-in Baggage Allowance – All Hubs" },

  { type: "Other Ancillary", subtype: "Seat related", scenario: "Inquires/requests related to seats", articleTitle: "Seating – Front Row Benefits & Exit Seat Rules – All Hubs" },
  { type: "Other Ancillary", subtype: "Meal related", scenario: "Inquires/requests related to Meals", articleTitle: "SkyTime – Onboard Entertainment – All Hubs" },
  { type: "Other Ancillary", subtype: "Airport services", scenario: "Inquires/requests related to airport services, like meet and assist, business lounge,..", articleTitle: "Airport Services – Sharjah (SHJ) Airport Only" },
  { type: "Other Ancillary", subtype: "Airport transfers", scenario: "Inquires/requests related to transfers to/from airport", articleTitle: "Airport Shuttle Bus Services – G9 & 3L" },
  { type: "Other Ancillary", subtype: "Insurance related", scenario: "Inquires/requests related to Travel Insurance", articleTitle: "Travel Insurance – All Hubs" },

  { type: "Credit related", subtype: "Credit inquiry", scenario: "Inquires about available credit balance, expiry date,...", articleTitle: "Using Credit Vouchers for a New Booking – All Hubs" },
  { type: "Credit related", subtype: "Credit Extend", scenario: "Requests for extension of credit voucher", articleTitle: "Using Credit Vouchers for a New Booking – All Hubs" },
  { type: "Credit related", subtype: "Credit exception", scenario: "Requests for credit exception; for example to use for someone else.", articleTitle: "Using Credit Vouchers for a New Booking – All Hubs" },

  { type: "Travel requirements", subtype: "Travel guidelines", scenario: "Inquires about travel guidelines related to vaccinations required.", articleTitle: "Travel Restrictions – Children, Infants & Pregnant Women – All Hubs" },
  { type: "Travel requirements", subtype: "Visa/PP information", scenario: "Inquires related to visa or travel documents", articleTitle: "Visa Applications & Visa-Change Bookings – All Hubs" },
  { type: "Travel requirements", subtype: "Other inquiry", scenario: "Inquires related any other travel requirements", articleTitle: "Travel Restrictions – Children, Infants & Pregnant Women – All Hubs" },

  { type: "Holidays", subtype: "New Booking", scenario: "Holiday package new booking requests", articleTitle: "Air Arabia Holidays – G9" },
  { type: "Holidays", subtype: "Cancellation", scenario: "Holiday package cancellation requests", articleTitle: "Air Arabia Holidays – G9" },
  { type: "Holidays", subtype: "Followup", scenario: "Follow-up on holiday booking requests either new booking, cancellation,….", articleTitle: "Air Arabia Holidays – G9" },
  { type: "Holidays", subtype: "Other", scenario: "Any other holiday-related inquiries", articleTitle: "Air Arabia Holidays – G9" },

  { type: "Travel agency", subtype: null, scenario: "Calls received from Travel agencies", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },

  { type: "Complaint", subtype: "Flight Alert related", scenario: "Complaints related to flight alerts that does not include any action taken from our side", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Website related", scenario: "Complaints related to our website where issue cannot be resolved from Call Center", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Baggage issues", scenario: "Complaints related Baggage delay, damage, lost,…", articleTitle: "Baggage Claims – All Hubs" },
  { type: "Complaint", subtype: "Call Center related", scenario: "Complaints related to call center like wrong booking/modification, wrong info,...", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Airport related", scenario: "Complaints related to airports like staff attitude, wrong handling, …", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Onboard related", scenario: "Complaints related to onboard services like meal not provided, seat purchased was not allocated, Cabin crew issues,…", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Office related", scenario: "Complaints related to office bookings or staff, like wrong booking, wrong info, staff attitude,…", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Holidays related", scenario: "Complaints related to holidays", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "T&C related", scenario: "Complaints related to terms and conditions of modification/cxn,…", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Visa related", scenario: "Complaints related to visas issues", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Service not available", scenario: "Complaints about unavailable services that passengger needs and we are not providing", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Airrewards", scenario: "Complaints related to Airrewards.", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "City/online Check-in", scenario: "Complaints related to city check-in or online check-in", articleTitle: "Handling Complaints – All Hubs" },
  { type: "Complaint", subtype: "Other", scenario: "Any other Complaints where the subtype is not available.", articleTitle: "Handling Complaints – All Hubs" },

  { type: "Inquiry/Requests", subtype: "Airrewards", scenario: "inquiries related to Airrewards.", articleTitle: "AirRewards Loyalty Program – All Hubs" },
  { type: "Inquiry/Requests", subtype: "Child/infant/pregnant women policy", scenario: "Inquiries about policies for children, infants, or pregnant women.", articleTitle: "Travel Restrictions – Children, Infants & Pregnant Women – All Hubs" },
  { type: "Inquiry/Requests", subtype: "Office details", scenario: "Inquiries about office location,timings,…", articleTitle: "Islamabad Sales Office – New Address (9P & G9)" },
  { type: "Inquiry/Requests", subtype: "Name Spelling amendment", scenario: "Requests for name spelling amendments.", articleTitle: "Name Change – G9" },
  { type: "Inquiry/Requests", subtype: "Contact details change", scenario: "Requests for mobile#, email address changes,…", articleTitle: "Caller Verification – All Hubs" },
  { type: "Inquiry/Requests", subtype: "Ok to board", scenario: "Inquiries about 'Ok to board' requirements, procedure, status, charges,...", articleTitle: "Ok to Board (OTB) – G9" },
  { type: "Inquiry/Requests", subtype: "Airports/terminals", scenario: "Inquiries about depature or arrivalairports or terminals.", articleTitle: "Airport Services – Sharjah (SHJ) Airport Only" },
  { type: "Inquiry/Requests", subtype: "Email itinerary", scenario: "Requests to email the itinerary.", articleTitle: "Making a New Booking – Accel Aero (All Hubs)" },
  { type: "Inquiry/Requests", subtype: "Flight status confirmation", scenario: "Confirmation about flight depature and arrival time.", articleTitle: "Contact Center Systems Overview – Accel Aero, Sprinklr, Caesar & Teams" },
  { type: "Inquiry/Requests", subtype: "No show taxes", scenario: "Requesting no-show taxes.", articleTitle: "No Show Airport Taxes – All Hubs" },
  { type: "Inquiry/Requests", subtype: "Wheel Chair", scenario: "Requests for wheelchair assistance.", articleTitle: "Wheelchair Assistance – All Hubs" },
  { type: "Inquiry/Requests", subtype: "Cairo refund", scenario: "Request for refund for Cairo flights.", articleTitle: "CAI (Cairo) Flights – Business Class, Basic & Ultimate Economy – All Hubs" },
  { type: "Inquiry/Requests", subtype: "Flight Status", scenario: "Inquiries about flight delays, advance, cancellation.", articleTitle: "Contact Center Systems Overview – Accel Aero, Sprinklr, Caesar & Teams" },

  { type: "Check-in", subtype: "Online checkin", scenario: "Inquiries about online check-in", articleTitle: "Online Check-in – All Hubs" },
  { type: "Check-in", subtype: "Bus service", scenario: "Inquiries about bus services", articleTitle: "Airport Shuttle Bus Services – G9 & 3L" },
  { type: "Check-in", subtype: "City Check-in", scenario: "Inquiries about city check-in", articleTitle: "City Check-in – G9 & 3L Only" },

  { type: "Exception cases", subtype: "Refund", scenario: "Requests for an exception for refund while pax is not eligbile", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Exception cases", subtype: "Cancellation", scenario: "Requests for an exception for cancellation while pax is not eligbile", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Exception cases", subtype: "Modification", scenario: "Requests for an exception for Modificaiton while pax is not eligbile", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
  { type: "Exception cases", subtype: "Other", scenario: "Any other exceptions", articleTitle: "Modification & Cancellation Checklists – All Hubs" },
];

async function seedGlobalDispositionCodes() {
  const alreadySeeded = await prisma.dispositionCode.findFirst({ where: { category: { not: null } } });
  if (alreadySeeded) {
    console.log("Global wrap-up disposition codes already seeded — skipping.");
    return;
  }

  await prisma.dispositionCode.createMany({
    data: WRAPUP_ROWS.map((row) => ({
      category: row.type,
      code: row.subtype ?? row.type,
      label: row.subtype ?? row.type,
      description: row.scenario,
      active: true,
    })),
  });

  console.log(`Seeded ${WRAPUP_ROWS.length} wrap-up disposition codes across ${new Set(WRAPUP_ROWS.map((r) => r.type)).size} categories.`);
}

async function attachToArticles() {
  const articleTitles = Array.from(new Set(WRAPUP_ROWS.map((r) => r.articleTitle)));
  const articles = await prisma.article.findMany({
    where: { title: { in: articleTitles } },
    select: { id: true, title: true, dispositions: { select: { code: true } } },
  });

  const articleByTitle = new Map(articles.map((a) => [a.title, a]));

  for (const title of articleTitles) {
    const article = articleByTitle.get(title);
    if (!article) {
      console.warn(`Article not found: "${title}" — skipping its wrap-up dispositions.`);
      continue;
    }

    const existingCodes = new Set(article.dispositions.map((d) => d.code));
    const rowsForArticle = WRAPUP_ROWS.filter((r) => r.articleTitle === title);
    const multiType = new Set(rowsForArticle.map((r) => r.type)).size > 1;

    function codeFor(row: WrapupRow) {
      if (multiType && row.subtype) return `${row.type} – ${row.subtype}`;
      return row.subtype ?? row.type;
    }

    const toCreate = rowsForArticle
      .filter((r) => !existingCodes.has(codeFor(r)))
      .map((r) => ({
        code: codeFor(r),
        content: r.scenario,
      }));

    if (toCreate.length === 0) {
      console.log(`No new dispositions to add for: ${title}`);
      continue;
    }

    await prisma.article.update({
      where: { id: article.id },
      data: { dispositions: { create: toCreate } },
    });

    console.log(`Added ${toCreate.length} disposition(s) to: ${title}`);
  }
}

async function main() {
  await seedGlobalDispositionCodes();
  await attachToArticles();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
