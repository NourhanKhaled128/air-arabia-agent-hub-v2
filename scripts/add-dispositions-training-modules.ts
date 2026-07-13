import { prisma } from "../lib/prisma";

interface CopyRow {
  moduleTitle: string;
  sourceArticleId: number;
  code: string;
}

// Training modules are recaps of the reference articles below — reuse the exact
// code + content already authored there rather than inventing new wording.
const COPY_ROWS: CopyRow[] = [
  { moduleTitle: "Module 1: Getting Started — Caller Verification & Contact Center Systems", sourceArticleId: 140, code: "Modification – Verification Failed" },
  { moduleTitle: "Module 1: Getting Started — Caller Verification & Contact Center Systems", sourceArticleId: 147, code: "Flight status confirmation" },

  { moduleTitle: "Module 2: Who's Flying — Ticket Types, Travel Restrictions & Fit to Fly", sourceArticleId: 81, code: "Passenger age classification" },
  { moduleTitle: "Module 2: Who's Flying — Ticket Types, Travel Restrictions & Fit to Fly", sourceArticleId: 82, code: "Inquiry/Requests – Child/infant/pregnant women policy" },
  { moduleTitle: "Module 2: Who's Flying — Ticket Types, Travel Restrictions & Fit to Fly", sourceArticleId: 83, code: "Fit to Fly certificate inquiry" },

  { moduleTitle: "Module 3: Booking Basics — Accel Aero Walkthrough, Payment Channels & Credit Vouchers", sourceArticleId: 156, code: "New booking – NB done" },
  { moduleTitle: "Module 3: Booking Basics — Accel Aero Walkthrough, Payment Channels & Credit Vouchers", sourceArticleId: 138, code: "Payment options/charges" },
  { moduleTitle: "Module 3: Booking Basics — Accel Aero Walkthrough, Payment Channels & Credit Vouchers", sourceArticleId: 139, code: "Credit inquiry" },

  { moduleTitle: "Module 4: Passenger Eligibility & Visa Applications", sourceArticleId: 82, code: "Travel requirements – Travel guidelines" },
  { moduleTitle: "Module 4: Passenger Eligibility & Visa Applications", sourceArticleId: 141, code: "Visa/PP information" },

  { moduleTitle: "Module 5: Changing Plans — Modification & Cancellation Checklists", sourceArticleId: 142, code: "Modification – Not eligible" },
  { moduleTitle: "Module 5: Changing Plans — Modification & Cancellation Checklists", sourceArticleId: 142, code: "Cancellation – Not eligible" },

  { moduleTitle: "Module 6: Baggage Fundamentals — Allowance, Restricted & Special Items", sourceArticleId: 84, code: "Baggage inquiry" },
  { moduleTitle: "Module 6: Baggage Fundamentals — Allowance, Restricted & Special Items", sourceArticleId: 85, code: "Restricted items" },
  { moduleTitle: "Module 6: Baggage Fundamentals — Allowance, Restricted & Special Items", sourceArticleId: 86, code: "Special item inquiry" },

  { moduleTitle: "Module 7: Onboard Extras — Seating, SkyTime & Insurance", sourceArticleId: 87, code: "Seat related" },
  { moduleTitle: "Module 7: Onboard Extras — Seating, SkyTime & Insurance", sourceArticleId: 144, code: "Meal related" },
  { moduleTitle: "Module 7: Onboard Extras — Seating, SkyTime & Insurance", sourceArticleId: 88, code: "Insurance related" },

  { moduleTitle: "Module 8: Airport Day — Check-in, Cut-offs, Shuttle Buses & Wheelchair", sourceArticleId: 91, code: "Check-in counter timing inquiry" },
  { moduleTitle: "Module 8: Airport Day — Check-in, Cut-offs, Shuttle Buses & Wheelchair", sourceArticleId: 90, code: "Check-in – Online checkin" },
  { moduleTitle: "Module 8: Airport Day — Check-in, Cut-offs, Shuttle Buses & Wheelchair", sourceArticleId: 148, code: "Check-in – Bus service" },
  { moduleTitle: "Module 8: Airport Day — Check-in, Cut-offs, Shuttle Buses & Wheelchair", sourceArticleId: 89, code: "Wheel Chair" },

  { moduleTitle: "Module 9: When Flights Change — No-show Credit & Flight Change Entitlements", sourceArticleId: 93, code: "No show taxes" },
  { moduleTitle: "Module 9: When Flights Change — No-show Credit & Flight Change Entitlements", sourceArticleId: 94, code: "Modification request" },

  { moduleTitle: "Module 10: Cargo, Trade & Group Bookings", sourceArticleId: 104, code: "G9 – Cargo inquiry" },
  { moduleTitle: "Module 10: Cargo, Trade & Group Bookings", sourceArticleId: 143, code: "Travel agency – Travel agency" },

  { moduleTitle: "Module 11: AirRewards & Loyalty", sourceArticleId: 137, code: "Airrewards" },

  { moduleTitle: "Module 12: Baggage Claims & Handling Complaints", sourceArticleId: 146, code: "Baggage issues" },
  { moduleTitle: "Module 12: Baggage Claims & Handling Complaints", sourceArticleId: 145, code: "Call Center related" },

  { moduleTitle: "Module 20: Call Handling Wrap-up — Quality & Escalations", sourceArticleId: 145, code: "Other" },

  { moduleTitle: "Module 13: Fare Bundles by Hub — G9, 3O & 9P", sourceArticleId: 108, code: "3O – Bundle comparison" },
  { moduleTitle: "Module 13: Fare Bundles by Hub — G9, 3O & 9P", sourceArticleId: 113, code: "9P – Bundle comparison" },

  { moduleTitle: "Module 14: Excess Baggage Rates by Hub", sourceArticleId: 109, code: "3O – Rate inquiry" },
  { moduleTitle: "Module 14: Excess Baggage Rates by Hub", sourceArticleId: 114, code: "9P – Rate inquiry" },

  { moduleTitle: "Module 15: Name Changes & Corrections by Hub", sourceArticleId: 111, code: "Name Spelling amendment" },
  { moduleTitle: "Module 15: Name Changes & Corrections by Hub", sourceArticleId: 123, code: "3O – Spelling correction (free)" },

  { moduleTitle: "Module 16: TV Handling & Cargo Support by Hub", sourceArticleId: 110, code: "3O – TV fee inquiry" },
  { moduleTitle: "Module 16: TV Handling & Cargo Support by Hub", sourceArticleId: 112, code: "3O – Cargo inquiry" },

  { moduleTitle: "Module 17: Hub-Specific Services — Falcons, Discounts, Holidays & Check-in Variants", sourceArticleId: 103, code: "G9 – Falcon booking" },
  { moduleTitle: "Module 17: Hub-Specific Services — Falcons, Discounts, Holidays & Check-in Variants", sourceArticleId: 106, code: "G9 – Discount card booking request" },
  { moduleTitle: "Module 17: Hub-Specific Services — Falcons, Discounts, Holidays & Check-in Variants", sourceArticleId: 105, code: "New Booking" },
  { moduleTitle: "Module 17: Hub-Specific Services — Falcons, Discounts, Holidays & Check-in Variants", sourceArticleId: 100, code: "City Check-in" },

  { moduleTitle: "Module 18: Special Cases — Dead Body Transport, Military Vouchers & Office Moves", sourceArticleId: 119, code: "9P – Transport of dead body" },
  { moduleTitle: "Module 18: Special Cases — Dead Body Transport, Military Vouchers & Office Moves", sourceArticleId: 118, code: "9P – APW/TAC booking" },
  { moduleTitle: "Module 18: Special Cases — Dead Body Transport, Military Vouchers & Office Moves", sourceArticleId: 155, code: "Office details" },

  { moduleTitle: "Module 19: Cairo Special Rules & Current Promotions", sourceArticleId: 95, code: "Cairo refund" },
  { moduleTitle: "Module 19: Cairo Special Rules & Current Promotions", sourceArticleId: 153, code: "Emirates Islamic Visa Card promo inquiry" },
  { moduleTitle: "Module 19: Cairo Special Rules & Current Promotions", sourceArticleId: 154, code: "AUH promotion inquiry" },
];

async function main() {
  const moduleTitles = Array.from(new Set(COPY_ROWS.map((r) => r.moduleTitle)));
  const modules = await prisma.article.findMany({
    where: { title: { in: moduleTitles } },
    select: { id: true, title: true, dispositions: { select: { code: true } } },
  });
  const moduleByTitle = new Map(modules.map((m) => [m.title, m]));

  const sourceArticleIds = Array.from(new Set(COPY_ROWS.map((r) => r.sourceArticleId)));
  const sourceDispositions = await prisma.disposition.findMany({
    where: { articleId: { in: sourceArticleIds } },
    select: { articleId: true, code: true, content: true },
  });
  const sourceByKey = new Map(sourceDispositions.map((d) => [`${d.articleId}::${d.code}`, d]));

  for (const title of moduleTitles) {
    const module = moduleByTitle.get(title);
    if (!module) {
      console.warn(`Training module not found: "${title}" — skipping.`);
      continue;
    }

    const existingCodes = new Set(module.dispositions.map((d) => d.code));
    const rows = COPY_ROWS.filter((r) => r.moduleTitle === title);

    const toCreate: { code: string; content: string }[] = [];
    for (const row of rows) {
      const source = sourceByKey.get(`${row.sourceArticleId}::${row.code}`);
      if (!source) {
        console.warn(`Source disposition not found: article ${row.sourceArticleId}, code "${row.code}" — skipping.`);
        continue;
      }
      if (existingCodes.has(source.code ?? row.code)) continue;
      toCreate.push({ code: source.code ?? row.code, content: source.content });
    }

    if (toCreate.length === 0) {
      console.log(`No new dispositions to add for: ${title}`);
      continue;
    }

    await prisma.article.update({
      where: { id: module.id },
      data: { dispositions: { create: toCreate } },
    });
    console.log(`Added ${toCreate.length} disposition(s) to: ${title}`);
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
