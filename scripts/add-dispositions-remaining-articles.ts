import { prisma } from "../lib/prisma";

interface NewRow {
  category: string;
  code: string;
  description: string;
  articleTitle: string;
}

// Every one of these articles currently has zero Disposition entries. Each row is grounded
// directly in that article's own overview/procedures — see scripts/add-wrapup-disposition-guide.ts
// and scripts/add-near-dispositions.ts for the earlier wrap-up-guide-derived dispositions.
const NEW_ROWS: NewRow[] = [
  // Bundle Fares
  { category: "Bundle Fares", code: "G9 – Bundle comparison", description: "Passenger unsure which G9 bundle (Basic/Value/Ultimate) fits their needs — point them to the bundle matching what matters most (baggage, seat, meal, or flexibility).", articleTitle: "Bundle Fares – G9" },
  { category: "Bundle Fares", code: "G9 – Modification cut-off inquiry", description: "Passenger asks about the modification/cancellation cut-off before booking a G9 bundle.", articleTitle: "Bundle Fares – G9" },
  { category: "Bundle Fares", code: "3O – Bundle comparison", description: "Passenger unsure which 3O bundle fits their needs — confirm Domestic vs Morocco International first, since the charts differ.", articleTitle: "Bundle Fares – 3O (Domestic & International)" },
  { category: "Bundle Fares", code: "3O – Modification cut-off inquiry", description: "Passenger asks about the modification/cancellation cut-off before booking a 3O bundle.", articleTitle: "Bundle Fares – 3O (Domestic & International)" },
  { category: "Bundle Fares", code: "9P – Bundle comparison", description: "Passenger unsure which 9P bundle fits their needs — confirm Domestic vs International first, since figures are in different currencies (PKR vs AED).", articleTitle: "Bundle Fares – 9P (Domestic & International)" },
  { category: "Bundle Fares", code: "9P – Modification cut-off inquiry", description: "Passenger asks about the modification/cancellation cut-off before booking a 9P bundle.", articleTitle: "Bundle Fares – 9P (Domestic & International)" },

  // Excess Baggage
  { category: "Excess Baggage", code: "G9 – Rate inquiry", description: "Passenger asks the excess baggage rate for their G9 route — confirm point-to-point vs connection first, since both change the rate.", articleTitle: "Excess Baggage Rates – G9" },
  { category: "Excess Baggage", code: "3O – Rate inquiry", description: "Passenger asks the excess baggage rate — confirm direction of travel (from/to Morocco) since currencies differ.", articleTitle: "Excess Baggage Rates – 3O" },
  { category: "Excess Baggage", code: "3O – No baggage fare", description: "Passenger without a baggage fare asks about the first-20kg rate.", articleTitle: "Excess Baggage Rates – 3O" },
  { category: "Excess Baggage", code: "9P – Rate inquiry", description: "Passenger asks the excess baggage rate — confirm Domestic vs International departing/arriving Pakistan, since all three have separate tables.", articleTitle: "Excess Baggage Rates – 9P" },
  { category: "Excess Baggage", code: "E5 – Rate inquiry", description: "Passenger asks the excess baggage rate — confirm direction of travel (from/to Egypt) since currencies and destinations differ.", articleTitle: "Excess Baggage Rates – E5" },
  { category: "Excess Baggage", code: "E5 – No baggage fare", description: "Passenger without a baggage fare asks about the first-20kg rate.", articleTitle: "Excess Baggage Rates – E5" },

  // TV Handling
  { category: "TV Handling", code: "G9 – TV fee inquiry", description: "Passenger asks about bringing a TV and the applicable fee band based on screen size.", articleTitle: "TV Handling – G9" },
  { category: "TV Handling", code: "G9 – Oversized TV", description: "Passenger's TV exceeds 60 inches and cannot be accepted on a G9 flight.", articleTitle: "TV Handling – G9" },
  { category: "TV Handling", code: "3O – TV fee inquiry", description: "Passenger asks about bringing a TV — the 40–60 inch band requires MAD 500 plus a signed indemnity form.", articleTitle: "TV Handling – 3O" },
  { category: "TV Handling", code: "3O – Oversized TV", description: "Passenger's TV exceeds 60 inches and cannot be accepted on a 3O flight.", articleTitle: "TV Handling – 3O" },
  { category: "TV Handling", code: "9P – TV fee inquiry", description: "Passenger asks about bringing a TV — confirm Domestic vs International since the 40–60 inch fee differs (PKR vs AED).", articleTitle: "TV Handling – 9P" },
  { category: "TV Handling", code: "9P – Oversized TV", description: "Passenger's TV exceeds 60 inches and cannot be accepted on a 9P flight.", articleTitle: "TV Handling – 9P" },
  { category: "TV Handling", code: "E5 – TV fee inquiry", description: "Passenger asks about bringing a TV — the 40–60 inch band is EGP 2,000 per TV plus airport handling fees; maximum accepted size is 60 inch.", articleTitle: "TV Handling – E5" },

  // Cargo & Trade
  { category: "Cargo & Trade", code: "G9 – Cargo inquiry", description: "Passenger or business asks about sending or receiving cargo via Sharjah.", articleTitle: "Cargo & Trade Support – G9" },
  { category: "Cargo & Trade", code: "3O – Cargo inquiry", description: "Passenger or business asks about sending or receiving cargo via Morocco.", articleTitle: "Cargo & Trade Support – 3O" },
  { category: "Cargo & Trade", code: "3O – Trade/travel agency support", description: "Travel agency asks for their dedicated Morocco trade support contact.", articleTitle: "Cargo & Trade Support – 3O" },
  { category: "Cargo & Trade", code: "E5 – Cargo inquiry", description: "Passenger or business asks about sending cargo via Egypt.", articleTitle: "Cargo & Trade Contacts – E5" },
  { category: "Cargo & Trade", code: "E5 – Trade/travel agency support", description: "Travel agency asks for their dedicated Egypt trade support contact.", articleTitle: "Cargo & Trade Contacts – E5" },

  // Pets & Animals
  { category: "Pets & Animals", code: "G9 – Falcon booking", description: "Passenger wants to book travel with a falcon on G9 — collect passenger/falcon count and destination, send to SPV, and book at least 48h prior to departure.", articleTitle: "Pets & Animals (Falcons) – G9" },
  { category: "Pets & Animals", code: "G9 – Pet not accepted", description: "Passenger asks about travelling with a pet other than a falcon, or on a non-G9 hub — pets/animals aren't accepted on any Air Arabia flight except G9 falcons.", articleTitle: "Pets & Animals (Falcons) – G9" },

  // Special Discounts
  { category: "Special Discounts", code: "G9 – Discount card booking request", description: "Passenger wants to book using a Homat Al Watan, Fazaa, Waffer, or Esaad discount card — create a Sprinklr case and request ID + relationship proof; don't create an on-hold booking.", articleTitle: "Special Discounts – Homat Al Watan, Fazaa, Waffer & Esaad – G9" },
  { category: "Special Discounts", code: "G9 – Discount eligibility inquiry", description: "Passenger asks whether their discount card qualifies and what it covers (fare/surcharge only, not taxes or ancillaries).", articleTitle: "Special Discounts – Homat Al Watan, Fazaa, Waffer & Esaad – G9" },

  // Home/Early Check-in
  { category: "Check-in", code: "3L – Home check-in request", description: "Sharjah or Abu Dhabi resident wants Home Check-in — confirm MORAFIQ registration (Abu Dhabi) or booking window (Sharjah, up to 6h prior).", articleTitle: "Early & Home Check-in – Abu Dhabi & Sharjah Airports" },
  { category: "Check-in", code: "3L – Early check-in request", description: "Passenger wants Abu Dhabi Early Check-in at a select location — confirm the handling fee by passenger type.", articleTitle: "Early & Home Check-in – Abu Dhabi & Sharjah Airports" },
  { category: "Check-in", code: "Check-in counter timing inquiry", description: "Passenger asks when check-in counters open/close — standard is 3h/1h prior to departure, except 9P Domestic (2h/45min).", articleTitle: "Check-in Timings – All Hubs" },

  // Military Vouchers
  { category: "Military Vouchers", code: "9P – APW/TAC booking", description: "Army/Air Force/Navy officer or family member requests booking using an APW or TAC voucher — confirm the required documents for that voucher type.", articleTitle: "APW/TAC Military Vouchers – 9P" },
  { category: "Military Vouchers", code: "9P – Name change attempt on voucher", description: "Passenger with an APW/TAC ticket requests a name change — not allowed on either voucher type.", articleTitle: "APW/TAC Military Vouchers – 9P" },

  // Special Cases
  { category: "Special Cases", code: "9P – Transport of dead body", description: "Passenger asks about requirements to transport a deceased passenger — attendant ticket, death certificate, coffin box certificate, police NOC, and CNIC copy required.", articleTitle: "Transport of Dead Body – 9P" },

  // Name Correction (3O decision flow)
  { category: "Name Change", code: "3O – Spelling correction (free)", description: "Simple spelling correction (e.g. Ali → Aly) — free, raise a DS Form directly.", articleTitle: "Name Correction Request – Decision Flow – 3O" },
  { category: "Name Change", code: "3O – AirRewards name mismatch (free)", description: "Booking made from an AirRewards account with a wrong name — verify ID/contact details, raise a DS Form if confirmed in Accelaero.", articleTitle: "Name Correction Request – Decision Flow – 3O" },
  { category: "Name Change", code: "3O – Spouse/family name change (free)", description: "Passenger wants to change to spouse's last name — raise an SP case, request marriage certificate.", articleTitle: "Name Correction Request – Decision Flow – 3O" },
  { category: "Name Change", code: "3O – Wrong first/last name (charged)", description: "First/last name is wrong — a charge applies; verify passport number and DOB, raise an SP case with proof of documents.", articleTitle: "Name Correction Request – Decision Flow – 3O" },
  { category: "Name Change", code: "3O – Total name change (not permitted)", description: "Passenger requests a total name change — not permitted since the ticket is nominative; offer fare-bundle-based alternatives.", articleTitle: "Name Correction Request – Decision Flow – 3O" },

  // RAK Bank / Travel Fusion
  { category: "RAK Bank Tickets", code: "Modification/cancellation request", description: "Passenger with a RAK Bank ticket asks to modify or cancel — not possible through any channel, no exceptions.", articleTitle: "RAK Bank Tickets — No Modification or Cancellation – All Hubs" },
  { category: "Travel Fusion", code: "Action requested on hold booking", description: "Passenger with a Travel Fusion–sourced PNR requests a credit transfer, name change, modification, or cancellation — hold all actions and direct them to Travel Fusion.", articleTitle: "Travel Fusion Bookings – All Hubs" },

  // Promotions
  { category: "Promotions", code: "Emirates Islamic Visa Card promo inquiry", description: "Passenger asks about the Emirates Islamic Visa Card 10%/20% promo — confirm booking/travel windows and that it's UAE-origin only before quoting.", articleTitle: "Emirates Islamic Visa Card Promotion — 10%/20% Off" },
  { category: "Promotions", code: "AUH promotion inquiry", description: "Passenger asks about the Abu Dhabi (AUH) promotion starting prices — confirm the promotion is still within its booking window before quoting.", articleTitle: "Promotion — Flights to Abu Dhabi (AUH)" },

  // AirRewards
  { category: "AirRewards", code: "Etihad Guest points transfer", description: "Passenger wants to convert AirRewards points to Etihad Guest Miles (2:1 ratio) — confirm the amount is an even number before submitting, since it can't be reversed.", articleTitle: "Transferring AirRewards Points to Etihad Guest – All Hubs" },
  { category: "AirRewards", code: "RAKBANK points linking", description: "Passenger asks why RAKBANK card points aren't showing in AirRewards — confirm AirRewards activation timing first; monthly claims post between the 6th–13th of the following month.", articleTitle: "RAKBANK Air Arabia Platinum Credit Card & Points Linking – All Hubs" },

  // Misc General Information
  { category: "Ticket Types", code: "Passenger age classification", description: "Passenger unsure how their travelling group is classified — ask if all are above 12; if not, ask if any are below 2, to classify Adult/Child/Infant.", articleTitle: "Ticket Types – All Hubs" },
  { category: "Travel requirements", code: "Fit to Fly certificate inquiry", description: "Passenger asks what a Fit to Fly certificate must include — signed/stamped by a doctor, valid 14 days, pregnancy week count if applicable.", articleTitle: "Fit to Fly Certificate Requirements – All Hubs" },
  { category: "Baggage", code: "Special item inquiry", description: "Passenger asks about carrying olive oil, Zamzam water, or a baby stroller in checked baggage — confirm hub and item-specific packaging rules.", articleTitle: "Special Checked-in Baggage Items – Olive Oil, Zamzam Water & Baby Stroller" },
];

// Existing wrap-up-guide dispositions that genuinely also apply to these hub-specific articles
// (same pattern as scripts/add-near-dispositions.ts — reuse the code+content, don't duplicate the concept).
const NEAR_EXISTING: { sourceCode: string; articleTitle: string }[] = [
  { sourceCode: "Name Spelling amendment", articleTitle: "Name Change – 3O" },
  { sourceCode: "Name Spelling amendment", articleTitle: "Name Change – 9P" },
  { sourceCode: "Ok to board", articleTitle: "Ok to Board (OTB) – 9P" },
];

async function addNewRows() {
  const alreadySeeded = await prisma.dispositionCode.findFirst({ where: { category: "Bundle Fares" } });
  if (!alreadySeeded) {
    await prisma.dispositionCode.createMany({
      data: NEW_ROWS.map((r) => ({
        category: r.category,
        code: r.code,
        label: r.code,
        description: r.description,
        active: true,
      })),
    });
    console.log(`Seeded ${NEW_ROWS.length} new global disposition codes.`);
  } else {
    console.log("New global disposition codes already seeded — skipping.");
  }

  const articleTitles = Array.from(new Set(NEW_ROWS.map((r) => r.articleTitle)));
  const articles = await prisma.article.findMany({
    where: { title: { in: articleTitles } },
    select: { id: true, title: true, dispositions: { select: { code: true } } },
  });
  const articleByTitle = new Map(articles.map((a) => [a.title, a]));

  for (const title of articleTitles) {
    const article = articleByTitle.get(title);
    if (!article) {
      console.warn(`Article not found: "${title}" — skipping.`);
      continue;
    }
    const existingCodes = new Set(article.dispositions.map((d) => d.code));
    const rows = NEW_ROWS.filter((r) => r.articleTitle === title);
    const toCreate = rows
      .filter((r) => !existingCodes.has(r.code))
      .map((r) => ({ code: r.code, content: r.description }));

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

async function addNearExisting() {
  for (const near of NEAR_EXISTING) {
    const source = await prisma.disposition.findFirst({ where: { code: near.sourceCode } });
    if (!source) {
      console.warn(`Source disposition code not found: "${near.sourceCode}" — skipping.`);
      continue;
    }

    const article = await prisma.article.findFirst({
      where: { title: near.articleTitle },
      select: { id: true, title: true, dispositions: { select: { code: true } } },
    });
    if (!article) {
      console.warn(`Article not found: "${near.articleTitle}" — skipping.`);
      continue;
    }

    if (article.dispositions.some((d) => d.code === near.sourceCode)) {
      console.log(`"${near.sourceCode}" already on ${article.title} — skipping.`);
      continue;
    }

    await prisma.article.update({
      where: { id: article.id },
      data: { dispositions: { create: [{ code: source.code, content: source.content }] } },
    });
    console.log(`Added near disposition "${near.sourceCode}" to: ${article.title}`);
  }
}

async function main() {
  await addNewRows();
  await addNearExisting();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
