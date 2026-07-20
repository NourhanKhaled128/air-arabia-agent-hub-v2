import "dotenv/config";
import { prisma } from "../lib/prisma";
import { buildArticleSectionsCreateData } from "../lib/article-service";

const AUTHOR = "Nourhan Khaled";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Fix 1: 9P Bundle Fares (International) — VALUE refund fee is AED 300 per the
// "All Hub manual.pptx" fare chart image, not AED 390.
async function fix9PBundleRefundFee() {
  const article = await prisma.article.findUnique({ where: { id: 113 } });
  if (!article) return console.warn("Article 113 not found — skip.");
  if (!article.overview.includes("AED 390")) {
    console.log("9P bundle AED 390 text not found — already fixed or changed, skipping.");
    return;
  }
  const overview = article.overview.replace(
    "Refund**, Fee: AED 390 (up to 24h)",
    "Refund**, Fee: AED 300 (up to 24h)"
  );
  await prisma.article.update({ where: { id: 113 }, data: { overview } });
  console.log("Fixed: 9P Bundle Fares International Value refund fee AED 390 -> AED 300");
}

// Fix 2: Sharjah Business Lounge does not have a stated access price in the manual —
// the "AED 145 depending on bags" figure belongs to Sharjah Home Check-in (a different
// service, already correctly priced in "Early & Home Check-in – Abu Dhabi & Sharjah
// Airports"). Remove the misattributed price from the Business Lounge context.
async function fixBusinessLoungePriceMisattribution() {
  const article = await prisma.article.findUnique({ where: { id: 99 }, include: { scenarios: true } });
  if (!article) return console.warn("Article 99 not found — skip.");

  if (article.overview.includes("Starting price AED 145 depending on number of bags.")) {
    const overview = article.overview.replace(
      " Starting price AED 145 depending on number of bags.",
      ""
    );
    await prisma.article.update({ where: { id: 99 }, data: { overview } });
    console.log("Fixed: removed misattributed AED 145 price from Business Lounge overview (article 99).");
  }

  const scenario = article.scenarios.find((s) => s.id === 337);
  if (scenario && scenario.response.includes("starting AED 145 depending on bags")) {
    await prisma.scenario.update({
      where: { id: 337 },
      data: {
        response:
          "Yes — the Sharjah Business Lounge includes a shower room with toiletries and towels for customer use, available with a lounge access booking.",
      },
    });
    console.log("Fixed: scenario 337 shower/lounge answer no longer cites the misattributed AED 145 price.");
  }

  const emailUpdates = [
    {
      id: 429,
      body: "Dear [Customer Name],\n\nThank you for asking whether you can shower before boarding your early morning flight.\n\nYes — the Sharjah Business Lounge includes a shower room with toiletries and towels for customer use, available with a lounge access booking. Let us know if you'd like this booked.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support",
    },
    {
      id: 430,
      body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن إمكانية الاستحمام قبل صعود رحلتكم الصباحية المبكرة.\n\nنعم - تشمل صالة أعمال الشارقة غرفة استحمام مزوّدة بمستلزمات ومناشف للاستخدام، وهي متاحة ضمن حجز صالة الأعمال. يرجى إخبارنا إذا رغبتم بحجزها.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران",
    },
  ];
  for (const e of emailUpdates) {
    await prisma.emailTemplate.update({ where: { id: e.id }, data: { body: e.body } });
  }
  console.log("Fixed: email templates 429/430 no longer cite the misattributed AED 145 price.");

  const node = await prisma.decisionNode.findUnique({ where: { id: 102 } });
  if (node && node.text.includes("Starting AED 145 depending on bag count.")) {
    await prisma.decisionNode.update({
      where: { id: 102 },
      data: { text: "Includes Wi-Fi, business centre, shower room, 24/7 food & beverage." },
    });
    console.log("Fixed: decision tree node 102 (Sharjah Airport Services tree) no longer cites the misattributed AED 145 price.");
  }
}

// Addition: baby bassinet age/size specs from Day 2 training deck — not in KB yet.
async function addBassinetSpecs() {
  const article = await prisma.article.findUnique({ where: { id: 87 } });
  if (!article) return console.warn("Article 87 not found — skip.");
  if (article.overview.includes("9 to 12 months")) {
    console.log("Bassinet specs already present — skipping.");
    return;
  }
  const overview = article.overview.replace(
    "Front Row Benefits: More leg space. Baby bassinets are subject to availability and only available to front-row seated passengers.",
    "Front Row Benefits: More leg space. Baby bassinets are subject to availability and only available to front-row seated passengers. Bassinets can hold a baby aged 9–12 months, with an average length of 74cm (29 inches) and weight up to 11kg (25 lbs)."
  );
  await prisma.article.update({ where: { id: 87 }, data: { overview } });
  console.log("Added: bassinet age/size specs to Seating article (87).");
}

// Addition: wheelchair charges by departure airport from Day 2 training deck — not in KB yet.
async function addWheelchairCharges() {
  const article = await prisma.article.findUnique({ where: { id: 89 } });
  if (!article) return console.warn("Article 89 not found — skip.");
  if (article.overview.includes("Special Needs Card")) {
    console.log("Wheelchair charge detail already present — skipping.");
    return;
  }
  const overview =
    article.overview +
    "\n\nCharges by departure airport: Sharjah (SHJ) — free with a Special Needs Card, otherwise AED 105 (airport fee, subject to change without notice). Abu Dhabi (AUH) — free with a Special Needs Card or if the passenger is over 70 years old, otherwise AED 50 (airport fee, subject to change without notice). Other airports — charges are set by that airport's own service provider; the passenger should contact them directly.";
  await prisma.article.update({ where: { id: 89 }, data: { overview } });

  await prisma.scenario.create({
    data: {
      articleId: 89,
      situation: "A passenger over 70 departing from Abu Dhabi asks if wheelchair assistance is free.",
      response:
        "Yes — at Abu Dhabi Airport, wheelchair assistance is free for passengers over 70 years old or holding a Special Needs Card; otherwise it's AED 50 (an airport fee, subject to change without notice).",
    },
  });
  console.log("Added: wheelchair charges by departure airport to Wheelchair Assistance article (89).");
}

// New article: Transit Flights — entirely missing from the KB (found in Day 3 training deck).
async function addTransitFlightsArticle() {
  const existing = await prisma.article.findFirst({ where: { title: "Transit Flights – All Hubs" } });
  if (existing) return console.log("Transit Flights article already exists — skipping.");

  const GENERAL_INFO_ID = 11;
  const RESERVATIONS_FOLDER_ID = 42;

  const article = await prisma.article.create({
    data: {
      title: "Transit Flights – All Hubs",
      slug: `${slugify("Transit Flights – All Hubs")}-${Date.now()}`,
      categoryId: GENERAL_INFO_ID,
      folderId: RESERVATIONS_FOLDER_ID,
      description: "How transit (connecting) itineraries work when neither the departure nor arrival airport is an Air Arabia hub.",
      overview:
        "A transit flight search result shows when both the departure and arrival airports are not an Air Arabia hub, but transit facility exists for the requested routing (searched the same way as any other flight on Accel Aero, no separate transit search screen). The transit duration is shown on the airline logo of the first segment.\n\nBaggage: transferred automatically from one sector to the other — the passenger checks in their luggage at the first (origin) airport and collects it at the final (destination) airport; they are not required to collect and recheck baggage during the transit stop.\n\nValue Fare on transit itineraries includes a seat and a meal for each sector (not just one).",
      author: AUTHOR,
      status: "Published",
      ...buildArticleSectionsCreateData({
        procedures: [
          { title: "Identify a transit itinerary", content: "A transit result appears when neither the departure nor arrival airport is an Air Arabia hub, but a transit connection exists — search flights normally on Accel Aero." },
          { title: "Reading transit duration", content: "The layover/transit duration displays on the airline logo of the first segment." },
        ],
        scenarios: [
          {
            situation: "A passenger on a transit itinerary asks if they need to collect and recheck their bags during the layover.",
            response: "No — baggage is transferred automatically between sectors. They check in at the first airport and collect their bags at the final destination airport only.",
          },
          {
            situation: "A passenger booking Value Fare on a 2-sector transit itinerary asks if they get one meal or two.",
            response: "Value Fare includes a seat and a meal for each sector on a transit itinerary — so two meals for a 2-sector routing, not just one.",
          },
        ],
        keywords: ["transit flight", "connection", "layover"],
      }),
    },
  });
  console.log(`Created article: Transit Flights – All Hubs (#${article.id})`);
}

// Addition: Call Center booking-creation cutoff by region, from Day 3 training deck —
// not currently documented anywhere in the KB.
async function addBookingCreationCutoff() {
  const article = await prisma.article.findUnique({ where: { id: 156 } });
  if (!article) return console.warn("Article 156 (Making a New Booking) not found — skip.");
  const marker = "Last time to create a booking from the Call Center";
  if (article.description.includes(marker) || article.overview.includes(marker)) {
    console.log("Booking creation cutoff already present — skipping.");
    return;
  }
  await prisma.note.create({
    data: {
      articleId: 156,
      type: "Warning",
      content:
        "Last time to create a booking from the Call Center, by departure airport: Sharjah/Ras Al Khaimah/Abu Dhabi (SHJ/RKT/AUH) — 4 hours prior to departure. Morocco — 3 hours prior to departure. All other airports — 6 hours prior to departure.",
    },
  });
  console.log("Added: Call Center booking-creation cutoff times to Making a New Booking article (156).");
}

async function main() {
  await fix9PBundleRefundFee();
  await fixBusinessLoungePriceMisattribution();
  await addBassinetSpecs();
  await addWheelchairCharges();
  await addTransitFlightsArticle();
  await addBookingCreationCutoff();
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
