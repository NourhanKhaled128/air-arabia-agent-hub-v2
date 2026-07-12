import { prisma } from "../lib/prisma";
import { buildArticleSectionsCreateData } from "../lib/article-service";

const AUTHOR = "Nourhan Khaled";
const TRAINING_CATEGORY_ID = 9;

async function nextStepNo(articleId: number) {
  const max = await prisma.procedureStep.aggregate({
    where: { articleId },
    _max: { stepNo: true },
  });
  return (max._max.stepNo ?? 0) + 1;
}

// ---------------------------------------------------------------------------
// 1. Extend six existing Training modules with the new topics — additive
//    only (nested `create`, never `deleteMany`), so nothing already in the
//    module is touched.
// ---------------------------------------------------------------------------

interface ModuleExtension {
  articleId: number;
  procedures?: { title: string; content: string }[];
  scenarios?: { situation: string; response: string }[];
  notes?: { type: string; content: string }[];
  keywords?: string[];
}

const MODULE_EXTENSIONS: ModuleExtension[] = [
  {
    // Module 1: Passenger Eligibility & Travel Documents
    articleId: 135,
    procedures: [
      {
        title: "Visa applications & visa-change bookings",
        content:
          "For visa requirements, direct the passenger to the relevant authority: any Air Arabia office for a UAE visa, or the consulate/embassy for any other visa. If a passenger requests a same-day return ticket, ask whether it's for a visa change — visa-change (VFR) tickets cannot be booked, modified or cancelled from the Call Center; the passenger must visit an Air Arabia office.",
      },
    ],
    scenarios: [
      {
        situation: "A passenger asks the call center to book a same-day return ticket that turns out to be a visa run.",
        response: "This must be booked as a visa-change (VFR) ticket at an Air Arabia office — it can't be created, modified or cancelled over the phone.",
      },
    ],
    keywords: ["visa"],
  },
  {
    // Module 2: Baggage Fundamentals
    articleId: 134,
    procedures: [
      {
        title: "Baggage claims",
        content:
          "Damaged, lost, or delayed baggage must be reported by the passenger at the arrival airport, at the time of arrival — this can't be handled after the passenger has left the airport.",
      },
    ],
    scenarios: [
      {
        situation: "Passenger calls days after landing to report a damaged suitcase.",
        response: "Baggage claims are time- and location-sensitive — they must be reported at the arrival airport at the time of arrival, not afterward by phone or email.",
      },
    ],
    keywords: ["baggage claims"],
  },
  {
    // Module 4: Onboard Extras — TV, Seating & Insurance
    articleId: 132,
    procedures: [
      {
        title: "SkyTime onboard entertainment",
        content:
          "Free entertainment accessed on the passenger's own device: after take-off, connect to the SkyTime Wi-Fi network and log in with email + seat number. Power banks and headsets are available onboard at an additional cost.",
      },
    ],
    scenarios: [
      {
        situation: "Passenger asks if they need to download anything before the flight for SkyTime.",
        response: "No — it's accessed entirely onboard via Wi-Fi after take-off; no pre-flight download is needed.",
      },
    ],
    keywords: ["skytime"],
  },
  {
    // Module 6: Sharjah Airport Services & Wheelchair
    articleId: 130,
    procedures: [
      {
        title: "Airport shuttle buses (G9 & 3L)",
        content:
          "3L: hourly bus between Ibn Battuta Mall (Dubai) and Abu Dhabi Airport, operated by Abu Dhabi Airport, ticket purchased at the bus station. G9 Sharjah: RAK office–Sharjah Airport (AED 30) or City Centre Al Shindagha–Sharjah Airport (free), both operated by Air Arabia. G9 Ras Al Khaimah: free shuttle from Dubai/Sharjah/Ajman/Umm Al Quwain, operated by RAK Airport, first come first served.",
      },
    ],
    scenarios: [
      {
        situation: "Passenger in Dubai wants a free bus to Sharjah Airport.",
        response: "The City Centre Al Shindagha to Sharjah Airport bus is free and operated by Air Arabia; the Ras Al Khaimah office route is AED 30.",
      },
    ],
    keywords: ["bus service"],
  },
  {
    // Module 9: Disruptions & Rebooking Rules
    articleId: 127,
    procedures: [
      {
        title: "Modification checklist",
        content:
          "Verification (PNR + 3 questions) → Data collection (all passengers? which segment?) → First recap → Ancillary carry-forward check → Charges (balance per passenger, then total) → T&C (old date cancelled, new date confirmed, payment due before use) → Final recap → Send payment link → Confirm new dates with the passenger.",
      },
      {
        title: "Cancellation checklist",
        content:
          "Verification (PNR + 3 questions) → Data collection (all passengers? which segment?) → T&C (check payment date & method) → Confirm credit amount + expiry → Send the cancellation confirmation by email.",
      },
      {
        title: "Using credit on a new booking",
        content:
          "Credit only matches the same passenger — spelling must be identical to the original PNR. At payment stage click Credit, search the PNR holding the credit, confirm and apply. If credit doesn't cover the full price, send a payment link for the remainder and warn the passenger that non-payment triggers cancellation charges.",
      },
    ],
    scenarios: [
      {
        situation: "Passenger's credit only covers 70% of a new fare.",
        response: "Apply the credit, then send a payment link for the remaining balance — make sure the passenger understands non-payment can trigger cancellation charges.",
      },
    ],
    keywords: ["checklist", "credit voucher"],
  },
  {
    // Module 10: Cargo, Trade & Special Bookings
    articleId: 126,
    procedures: [
      {
        title: "Group booking requests (10+ passengers)",
        content:
          "A group is more than 10 passengers, needing more than 70 available seats per sector. All requests go through the group booking form (https://forms.office.com/r/4Eewf1TWD9) — never book from the call centre directly. Once confirmed, no modification, cancellation, split, ancillary or contact-detail change is permitted from the call centre.",
      },
    ],
    scenarios: [
      {
        situation: "Caller wants to change one passenger's meal on a confirmed 15-passenger group booking.",
        response: "Not possible — no ancillary changes are permitted on group bookings from the call centre, regardless of size.",
      },
    ],
    keywords: ["group booking"],
  },
];

async function extendExistingModules() {
  for (const ext of MODULE_EXTENSIONS) {
    const article = await prisma.article.findUnique({ where: { id: ext.articleId } });
    if (!article) {
      console.warn(`No training module found for id: ${ext.articleId}`);
      continue;
    }

    let stepNo = await nextStepNo(ext.articleId);
    const proceduresCreate = (ext.procedures ?? []).map((p) => ({
      stepNo: stepNo++,
      title: p.title,
      content: p.content,
    }));

    await prisma.article.update({
      where: { id: ext.articleId },
      data: {
        ...(proceduresCreate.length ? { procedures: { create: proceduresCreate } } : {}),
        ...(ext.scenarios?.length ? { scenarios: { create: ext.scenarios } } : {}),
        ...(ext.notes?.length ? { notes: { create: ext.notes } } : {}),
        ...(ext.keywords?.length ? { keywords: { create: ext.keywords.map((value) => ({ value })) } } : {}),
      },
    });

    console.log(`Extended: ${article.title}`);
  }
}

// ---------------------------------------------------------------------------
// 2. Two new Training modules for topics with no natural home in 0–11.
// ---------------------------------------------------------------------------

interface NewModuleSpec {
  title: string;
  description: string;
  overview: string;
  slug: string;
  procedures?: { title: string; content: string }[];
  scenarios?: { situation: string; response: string }[];
  notes?: { type: string; content: string }[];
  keywords?: string[];
}

const NEW_MODULES: NewModuleSpec[] = [
  {
    title: "Module 12: Call Handling Fundamentals — Verification, Systems & Complaints",
    slug: "training-module-12-call-handling-fundamentals-verification-systems-complaints",
    description: "The mandatory caller-verification script, the four core contact-center systems, and how to handle a complaint from first response through resolution.",
    overview:
      "Before you can help anyone on the phone, you need to know who you're talking to, which system to use for what, and how to de-escalate when something's gone wrong. This module covers the 3-question verification check required on every paid-PNR call, an orientation to Accel Aero/Sprinklr/Caesar/Teams, and the complaint-handling procedure including the two most common sub-flows.",
    procedures: [
      {
        title: "Caller verification",
        content:
          "Before sharing details or taking action on a paid PNR, collect the PNR and get all 3 verification questions answered correctly: passenger name, flight destination & date, and one contact detail (mobile or email). General flight-status questions don't require verification, since the caller may not be the passenger.",
      },
      {
        title: "System orientation",
        content:
          "Accel Aero — booking system (search, ticket, modify, cancel). Sprinklr — receive calls and manage cases (login: https://airarabia.sprinklr.com via SSO). Caesar — verify planned vs. unplanned flight-time changes via the hub-specific link; check with the Duty Supervisor if it isn't updated. Microsoft Teams — internal escalation. Email — official/documented passenger communication.",
      },
      {
        title: "Complaint handling",
        content:
          "Listen, empathize, and acknowledge the inconvenience before offering a solution, escalating, or raising a case. For payment issues where money was debited but the PNR isn't confirmed: ask the passenger to check again after 2 hours; if still unresolved, run an advanced search, raise a Sprinklr payment-issues request, and extend the booking's time limit by at least 24 hours. For quality cases (e.g. wrong info from a previous call), raise a request under Complaints > Call Center Complaints with the correct sub-type.",
      },
    ],
    scenarios: [
      { situation: "Caller can only answer 2 of the 3 verification questions correctly and wants a modification made.", response: "Do not proceed — all 3 questions must be answered correctly before any action is taken on a paid PNR." },
      { situation: "New agent isn't sure whether to use Accel Aero or Sprinklr to process a name-change case.", response: "Accel Aero is for the booking action; Sprinklr is where the case itself (with proof-of-relationship documents, etc.) is raised and tracked." },
      { situation: "Passenger is angry their money was debited but they have no booking confirmation.", response: "Empathize, then ask them to check again after 2 hours in case payment is still processing; if unresolved, run an advanced search, raise a Sprinklr payment-issues case, and extend the booking time limit at least 24 hours." },
    ],
    notes: [{ type: "Warning", content: "Never skip caller verification for a paid PNR, no matter how confident the caller sounds or how much time pressure there is." }],
    keywords: ["verification", "systems", "sprinklr", "caesar", "complaints"],
  },
  {
    title: "Module 13: AirRewards & Payments",
    slug: "training-module-13-airrewards-payments",
    description: "The AirRewards loyalty programme and the payment channels, charges and credit-voucher rules agents need for every booking call.",
    overview:
      "Two topics that touch almost every call: how passengers earn and redeem AirRewards points, and how they can actually pay for a call-center booking.",
    procedures: [
      {
        title: "AirRewards basics",
        content:
          "5% cashback as points on tickets/baggage, 10% on seat/meal/insurance/airport services, no points on airport taxes. Register online or via Accel Aero. 12+ registers directly; ages 2–11 must link to an existing-member family head (up to 8 members, family head earns 50% of a linked passenger's points). Redeem via the payment page — 3,000-point minimum for fare/baggage, no minimum for seat/meal/insurance/airport services. Points expire 2 years from travel date.",
      },
      {
        title: "Payment channels & charges",
        content:
          "Channels vary by market: Installments (UAE/KSA/Egypt), Book Now Pay Later, Mada (KSA), KNET (Kuwait), RuPay/UPI (India), iDeal (Netherlands), Bancontact (Belgium), Sofort (Germany). A per-country charge always applies for paying a call-center booking (e.g. AED 10/booking in the UAE, USD 14/passenger in Pakistan) — always disclose this to the passenger before they pay.",
      },
    ],
    scenarios: [
      { situation: "A 10-year-old passenger asks to register their own AirRewards account.", response: "Not directly — children 2–11 must be linked to an existing family-head member's account; only 12+ can register and earn/redeem independently." },
      { situation: "Passenger in Kuwait asks if there's a fee to pay for their call-center booking.", response: "Yes — KWD 5.00 per passenger at the Kuwait office. Always disclose the applicable charge before the passenger proceeds." },
    ],
    keywords: ["airrewards", "payments", "points", "charges"],
  },
];

async function createNewModules() {
  for (const spec of NEW_MODULES) {
    const existing = await prisma.article.findFirst({ where: { title: spec.title } });
    if (existing) {
      console.log(`Skip (already exists): ${spec.title}`);
      continue;
    }

    const article = await prisma.article.create({
      data: {
        title: spec.title,
        slug: spec.slug,
        categoryId: TRAINING_CATEGORY_ID,
        description: spec.description,
        overview: spec.overview,
        author: AUTHOR,
        status: "Draft",
        ...buildArticleSectionsCreateData({
          procedures: spec.procedures,
          scenarios: spec.scenarios,
          notes: spec.notes,
          keywords: spec.keywords,
        }),
      },
    });
    console.log(`Created module: ${spec.title} (#${article.id})`);
  }
}

async function main() {
  await extendExistingModules();
  await createNewModules();
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
