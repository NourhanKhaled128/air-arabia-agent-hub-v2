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

// ---------------------------------------------------------------------------
// 1. Category fixes: create AirRewards / Payments / Reservations / Ancillaries
//    (referenced by existing nav pages but missing from the DB), and fix the
//    Systems category so it's visible with an accurate description.
// ---------------------------------------------------------------------------

const NEW_CATEGORIES = [
  {
    name: "AirRewards",
    slug: "airrewards",
    description: "Air Arabia's loyalty programme — earning, redemption and registration.",
    order: 7,
  },
  {
    name: "Payments",
    slug: "payments",
    description: "Payment channels, call-center charges, vouchers and credit use.",
    order: 7,
  },
  {
    name: "Reservations",
    slug: "reservations",
    description: "Reservation procedures, booking policies and operational guides.",
    order: 7,
  },
  {
    name: "Ancillaries",
    slug: "ancillaries",
    description: "Seats, baggage, meals and additional services.",
    order: 7,
  },
];

async function ensureCategories() {
  const idByName: Record<string, number> = {};

  for (const cat of NEW_CATEGORIES) {
    const existing = await prisma.category.findUnique({ where: { name: cat.name } });
    if (existing) {
      idByName[cat.name] = existing.id;
      continue;
    }
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        color: "bg-red-100 text-red-700",
        icon: "Folder",
        visible: true,
        order: cat.order,
        group: "Knowledge Base",
      },
    });
    idByName[cat.name] = created.id;
    console.log(`Created category: ${cat.name} (#${created.id})`);
  }

  await prisma.category.update({
    where: { id: 8 },
    data: {
      visible: true,
      description: "Accel Aero, Sprinklr and Caesar — the systems agents use to search, book and manage cases.",
    },
  });
  console.log("Updated Systems category (visible + description).");

  idByName["General Information"] = 11;
  idByName["Systems"] = 8;
  idByName["Customer Support"] = 17;

  return idByName;
}

// ---------------------------------------------------------------------------
// 2. Twelve new articles closing the content gaps found in the training deck.
// ---------------------------------------------------------------------------

interface NewArticleSpec {
  title: string;
  categoryName: string;
  description: string;
  overview: string;
  procedures?: { title?: string; content: string }[];
  scenarios?: { situation: string; response: string }[];
  notes?: { type?: string; content: string }[];
  keywords?: string[];
  chatTemplates?: { title: string; content: string }[];
  emailTemplates?: { title: string; subject: string; body: string }[];
}

const NEW_ARTICLES: NewArticleSpec[] = [
  {
    title: "AirRewards Loyalty Program – All Hubs",
    categoryName: "AirRewards",
    description:
      "Overview of the AirRewards loyalty programme — earning and cashback rates, registration, family-head accounts, redemption and expiry.",
    overview:
      "AirRewards is Air Arabia's loyalty programme — the more a passenger flies, the more points they earn, redeemable against ticket discounts or free services. Passengers can only earn points for their own flights.\n\nCashback rates: 5% as points on tickets and baggage purchases; 10% as points on seat, meal, insurance and airport services; no points on airport taxes.\n\nPoints expire 2 years from the travel date.",
    procedures: [
      { title: "Registration", content: "Register online via the website, or through the Call Center via Accel Aero (Join Air Rewards option)." },
      { title: "Eligibility", content: "Any passenger 12 years or older can register, earn and redeem full points. Children aged 2–11 must be linked to a family head account, and the family head must already be an existing AirRewards member." },
      { title: "Family head accounts", content: "Up to 8 family members can be linked to one account. The family head earns 50% of a linked passenger's points (the other 50% is forfeited); the family head account itself earns 0 points directly." },
      { title: "Earning — future flights", content: "Add the AirRewards ID to the PNR. Points are credited within 24 hours after the full ticket is used." },
      { title: "Earning — past flights", content: "Passenger claims points from their account via \"Claim points for past flight,\" within a maximum of 90 days from the travel date." },
      { title: "Redemption", content: "Redeem via the passenger's account on the payment page. Minimum 3,000 points required for fare or baggage redemption; no minimum for seat, meal, insurance or airport services. Points cannot be used against airport taxes." },
    ],
    scenarios: [
      { situation: "A passenger asks if their 10-year-old child can register for their own AirRewards account.", response: "Not directly — a child aged 2–11 must be linked to a family head account, and that family head must already be an existing AirRewards member. Only passengers 12+ can register and earn/redeem in their own right." },
      { situation: "A family head with 3 linked family members asks why their own account shows 0 points after a family member's flight.", response: "That's expected — the family head account itself doesn't earn points directly; it earns 50% of each linked passenger's points from their flights." },
      { situation: "A passenger wants to redeem 2,000 points against a seat selection.", response: "No minimum applies to seat, meal, insurance or airport service redemptions — the 3,000-point minimum only applies to fare or baggage redemption. Proceed with the seat redemption." },
    ],
    notes: [
      { type: "Information", content: "Points cannot be earned for another passenger's flights — only for the account holder's own travel." },
      { type: "Warning", content: "Points expire 2 years from the travel date — check the account before assuming a balance is still valid." },
    ],
    keywords: ["airrewards", "loyalty", "points", "cashback", "redemption"],
    chatTemplates: [
      { title: "AirRewards points query", content: "Hi! AirRewards points work like this: you earn 5% back as points on tickets and baggage, or 10% on seat/meal/insurance/airport services (no points on airport taxes). Points expire 2 years after travel. Want me to check your current balance or help you register?" },
    ],
    emailTemplates: [
      { title: "AirRewards registration & earning", subject: "Your AirRewards account", body: "Dear passenger,\n\nThanks for your interest in AirRewards, our loyalty programme. You can register free online or through our Call Center. Once registered, you'll earn 5% cashback as points on tickets and baggage, and 10% on seat, meal, insurance and airport services (airport taxes don't earn points). To credit points on a future flight, make sure your AirRewards ID is added to your booking — points post within 24 hours of travel. For a past flight, you can claim points from your account within 90 days of the travel date. Points are valid for 2 years from the date of travel.\n\nLet us know if you'd like help registering or checking your balance.\n\nAir Arabia Customer Support" },
    ],
  },
  {
    title: "Payment Channels & Charges – All Hubs",
    categoryName: "Payments",
    description: "Available payment channels for call-center bookings and the per-country charge for paying that way.",
    overview:
      "Payment channels vary by market: Installments (UAE, KSA, Egypt — select routes), Book Now Pay Later (cash at sales offices, travel agents, airports, partner banks, exchange houses, retail chains, post offices), Internet/Mobile Banking (Morocco, India), Mada bank cards (Saudi Arabia), KNET (Kuwait), RuPay (India), UPI (India), iDeal (Netherlands), Bancontact (Belgium), Sofort (Germany).\n\nIt is mandatory to inform passengers of the charge for paying a call-center booking through these channels.\n\nCall-center booking payment charges by country:\n- UAE — exchange centres or Air Arabia offices: AED 10 per booking\n- Jordan — Jordan office: JOD 5 per passenger\n- Morocco — Mac office: MAD 35 per passenger\n- Kuwait — Kuwait office: KWD 5.00 per passenger\n- Doha — Doha office: QAR 10 per passenger\n- Bahrain — Bahrain office: BHD 1 per passenger\n- KSA — Air Arabia offices: SAR 10 per passenger\n- Oman — Asia Express Exchange: OMR 1.5 per booking\n- Armenia — Air Arabia office: AMD 10,000 per passenger\n- Pakistan — Air Arabia office: USD 14 per passenger\n- Egypt — Air Arabia offices: EGP 250 per passenger (flights from Egypt), EGP 500 per passenger (flights to Egypt); Fawry is currently suspended",
    scenarios: [
      { situation: "A passenger in Kuwait wants to pay for a call-center booking and asks if there's a fee.", response: "Yes — paying at the Kuwait office costs KWD 5.00 per passenger. It's mandatory to inform the passenger of this charge before they proceed." },
      { situation: "A passenger in Egypt asks about the payment fee for a flight departing from Cairo vs one arriving into Cairo.", response: "It depends on direction: EGP 250 per passenger for flights from Egypt, EGP 500 per passenger for flights to Egypt. Also let them know Fawry is currently suspended as a payment option." },
      { situation: "A passenger in the Netherlands asks if they can pay via direct bank transfer.", response: "Yes — iDeal is available for customers in the Netherlands for direct online bank transfers." },
    ],
    notes: [{ type: "Information", content: "Charges must always be disclosed to the passenger before they choose a payment channel." }],
    keywords: ["payment", "charges", "installments", "book now pay later"],
    chatTemplates: [
      { title: "Payment channel & charge quote", content: "You can pay through installments, Book Now Pay Later, or a market-specific option like Mada, KNET, UPI or iDeal depending on where you're based — I'll also need to let you know the applicable charge for paying this way, which is a flat per-passenger/per-booking fee based on your country." },
    ],
    emailTemplates: [
      { title: "Payment options for your booking", subject: "Payment options for your booking", body: "Dear passenger,\n\nYou can complete payment for your call-center booking through several channels depending on your location — Installments (UAE/KSA/Egypt on select routes), Book Now Pay Later at our offices/partner banks/exchange houses, or a local method such as Mada, KNET, UPI, iDeal, Bancontact or Sofort. A small processing charge applies depending on your country office — we're required to disclose this to you before payment. Let us know your location and we'll confirm the exact channel and charge.\n\nAir Arabia Customer Support" },
    ],
  },
  {
    title: "Using Credit Vouchers for a New Booking – All Hubs",
    categoryName: "Payments",
    description: "How to apply an existing credit voucher to a new booking, and the terms for partial payment.",
    overview:
      "Credit is displayed per passenger under \"Balance\" on the original PNR and can only be used by the same passenger — the spelling on the new booking must match exactly.\n\nTo apply credit to a new booking: create a New PNR (or load the original passenger details to guarantee matching spelling), then at the payment stage click \"Credit,\" enter the PNR that holds the credit, search, and the credit amount will display if the name matches. Select the checkbox and confirm.\n\nIf the credit does not cover the full ticket price, the remaining balance must be paid via a payment link and the booking is marked as forced (CNF forced). It is important to inform the passenger that if the payment link is sent, payment must be completed — otherwise cancellation charges will apply.",
    scenarios: [
      { situation: "A passenger wants to apply their own credit voucher to a new booking but spelled their name slightly differently at booking.", response: "Credit can only be matched to the exact same passenger spelling as the original PNR — correct the spelling on the new booking to match before applying the credit." },
      { situation: "A passenger's credit only covers 70% of a new ticket's price.", response: "Apply the credit first, then send a payment link for the remaining balance. Make clear to the passenger that the booking will show as forced and payment must be completed, or cancellation charges will apply." },
      { situation: "A passenger asks how long their credit voucher stays valid.", response: "Credit is valid for 1 year from the date of payment, for the same passenger only." },
    ],
    notes: [{ type: "Warning", content: "If the payment link for the remaining balance isn't paid, cancellation charges apply — make sure the passenger understands this before ending the call." }],
    keywords: ["credit", "voucher", "payment", "new booking"],
    chatTemplates: [
      { title: "Applying credit to a new booking", content: "I can apply your existing credit to this new booking — I just need to search using the original PNR, and the passenger name has to match exactly. If the credit doesn't fully cover the new fare, I'll send you a payment link for the remaining balance, which needs to be paid to keep the booking confirmed." },
    ],
    emailTemplates: [
      { title: "Using your credit voucher", subject: "Using your credit voucher", body: "Dear passenger,\n\nYour credit voucher can be applied to a new booking as long as the passenger name matches exactly what's on the original PNR. If the credit doesn't cover the full new fare, we'll send a payment link for the remaining balance — please complete this payment promptly, as an unpaid balance can result in cancellation charges. Credit remains valid for 1 year from the original date of payment.\n\nAir Arabia Customer Support" },
    ],
  },
  {
    title: "Caller Verification – All Hubs",
    categoryName: "Reservations",
    description: "The mandatory 3-question identity check required before sharing details or taking action on a paid PNR.",
    overview:
      "Before giving any booking details or taking any action on a paid PNR, collect the PNR and ask 3 verification questions, all of which must be answered correctly by the caller:\n1. Passenger name.\n2. Flight destination and date.\n3. One contact detail on the booking — mobile number or email address.\n\nOnly after successful verification can details be provided or the requested action taken.\n\nException: general flight-status or timing questions do not require PNR collection or verification, since the caller may not be the passenger (e.g. someone waiting for the passenger's arrival).",
    scenarios: [
      { situation: "A caller asks to change the flight date on a paid PNR but can only correctly answer 2 of the 3 verification questions.", response: "Do not proceed — all 3 verification questions must be answered correctly before any action is taken on a paid PNR. Politely explain you're unable to make changes without full verification." },
      { situation: "Someone calls just to ask what time a specific flight lands, without knowing the PNR.", response: "No verification is required for a general flight-status question — the caller may not even be the passenger. Just look up the flight using the flight number/date." },
      { situation: "A caller correctly gives the passenger name and destination/date but reads out a contact detail that doesn't match the booking.", response: "This fails verification — the third question must be answered correctly too. Do not share details or take action; offer to have the actual passenger or account holder call back." },
    ],
    notes: [{ type: "Warning", content: "Never skip or shortcut verification for a paid PNR, even if the caller sounds legitimate or is in a hurry." }],
    keywords: ["verification", "security", "caller id", "pnr"],
    chatTemplates: [
      { title: "Caller verification script", content: "Before I can pull up any details or make changes on this booking, I need to verify a few things — could you confirm the passenger's full name, the flight destination and date, and either the mobile number or email address on the booking?" },
    ],
  },
  {
    title: "Visa Applications & Visa-Change Bookings – All Hubs",
    categoryName: "Reservations",
    description: "Where passengers should direct visa questions, and the rules for booking a visa-change (VFR) ticket.",
    overview:
      "Visa Applications & Inquiries: the passenger must check any visa requirements or documentation with the relevant authority. For a UAE visa application, they can check with any Air Arabia office. For any other visa, they must check with the relevant consulate or embassy — Air Arabia does not process visa applications.\n\nVisa-Change Bookings: when a passenger requests a same-day return ticket, ask whether it's for a visa change. Visa-change tickets cannot be booked, modified, or cancelled from the Call Center — the passenger must visit an Air Arabia office. These bookings are marked as VFR (Visa Change) in Accel Aero.",
    scenarios: [
      { situation: "A passenger asks the call center to book a same-day return ticket and it turns out to be for a visa run.", response: "This must be booked as a visa-change (VFR) ticket, which cannot be created over the phone — direct the passenger to an Air Arabia office to complete the booking." },
      { situation: "A passenger with an existing VFR-marked booking calls asking to modify the return date.", response: "Not possible from the Call Center — visa-change bookings cannot be modified or cancelled here. The passenger must visit an Air Arabia office." },
      { situation: "A passenger asks Air Arabia to help them get a Schengen visa.", response: "Air Arabia doesn't process visa applications — for any visa other than UAE, direct the passenger to the relevant consulate or embassy." },
    ],
    keywords: ["visa", "vfr", "visa change", "consulate"],
    chatTemplates: [
      { title: "Visa question redirect", content: "For visa requirements we'd recommend checking directly with the consulate or embassy for your destination — for a UAE visa specifically, any Air Arabia office can help. If this same-day return is for a visa run, I'll need to flag it as a visa-change booking, which has to be completed at one of our offices rather than over the phone." },
    ],
  },
  {
    title: "Modification & Cancellation Checklists – All Hubs",
    categoryName: "Reservations",
    description: "The step-by-step checklist agents should follow when modifying or cancelling a booking.",
    overview:
      "These checklists standardize what to cover, in order, on every modification or cancellation call — they don't replace the bundle-specific fare rules found in each hub's Bundle Fares article.",
    procedures: [
      { title: "Modification — 1. Verification", content: "Collect the PNR and confirm all 3 verification questions (passenger name, flight destination & date, one contact detail)." },
      { title: "Modification — 2. Data Collection", content: "Confirm whether the modification is for all passengers on the PNR, and which segment is affected." },
      { title: "Modification — 3. First Recap", content: "Read back the current flight details to the passenger." },
      { title: "Modification — 4. Ancillary", content: "Check whether previously selected ancillaries carry forward automatically to the new flight." },
      { title: "Modification — 5. Charges", content: "Quote the balance per passenger under \"Balance,\" then the total amount due." },
      { title: "Modification — 6. Terms & Conditions", content: "Explain that the previous date is cancelled, the new date is confirmed, and payment is due before the new segment can be used." },
      { title: "Modification — 7. Final Recap", content: "Confirm the new flight details back to the passenger." },
      { title: "Modification — 8. Payment", content: "Send the offline payment link." },
      { title: "Modification — 9. Confirmation", content: "Ask the passenger to double-check the new travel dates are correct." },
      { title: "Cancellation — 1. Verification", content: "Collect the PNR and confirm all 3 verification questions." },
      { title: "Cancellation — 2. Data Collection", content: "Confirm whether the cancellation is for all passengers, and which segment." },
      { title: "Cancellation — 3. Terms & Conditions", content: "Check the original payment date and payment method — these affect what's owed/returned." },
      { title: "Cancellation — 4. Credit Details", content: "Confirm the credit amount and its expiry date with the passenger." },
      { title: "Cancellation — 5. Confirmation", content: "Send the cancellation confirmation by email." },
    ],
    scenarios: [
      { situation: "An agent modifies a booking but forgets to confirm whether ancillaries carried forward.", response: "Follow the checklist in order — Ancillary comes right after the first recap, before charges are quoted, because it can change what the passenger is being charged for." },
      { situation: "A passenger wants a cancellation confirmed verbally only, with no written record.", response: "Still send the cancellation confirmation by email per the checklist's final step — this is the passenger's documented proof of the credit amount and expiry." },
      { situation: "An agent is unsure whether to quote charges before or after recapping the new flight.", response: "Charges (Balance per passenger and total) come right after Ancillary and before the T&C step — recap the current flight first, then ancillaries, then charges." },
    ],
    notes: [{ type: "Information", content: "These checklists are a sequence, not a menu — follow them in order on every modification/cancellation call." }],
    keywords: ["checklist", "modification", "cancellation", "procedure"],
  },
  {
    title: "Group Booking Requests & Inquiries – All Hubs",
    categoryName: "Reservations",
    description: "Group booking eligibility, submission process, and what the Call Center can (and cannot) do for existing group PNRs.",
    overview:
      "A group is more than 10 passengers, and the requested flight must have more than 70 seats available in each sector. All group requests must be submitted through the group booking form: https://forms.office.com/r/4Eewf1TWD9.\n\nFor existing group bookings: no changes are permitted from the Call Center — no modification, cancellation, split, ancillary change, or contact-detail change. PNR details can only be shared if the caller correctly answers verification for all passengers' names, flight details, and one contact detail.\n\nHow to identify a group booking: 10 or more passengers; any passenger name shown as \"TBA\"; a note on Accel Aero confirming it's a group booking; or the booking was created by \"Groups User.\"",
    scenarios: [
      { situation: "A caller with a confirmed 15-passenger group PNR wants to change one passenger's meal preference.", response: "Not possible from the Call Center — no ancillary changes are permitted on group bookings, regardless of the size of the change. Direct them to the Groups team instead." },
      { situation: "A passenger asks to book 12 seats on a flight that only shows 40 seats remaining in that sector.", response: "Not eligible as a group booking — the requested flight needs more than 70 available seats in the sector. Advise the passenger to check other flight options." },
      { situation: "A caller asks for PNR details on a group booking but can only verify their own name, not all passengers'.", response: "Do not share PNR details — verification for a group booking requires all passenger names, flight details, and one contact detail to be answered correctly, not just the caller's own." },
    ],
    notes: [{ type: "Warning", content: "Never modify, cancel, split, or edit ancillaries/contact details on a group booking from the Call Center, even if requested urgently." }],
    keywords: ["group booking", "groups", "pnr"],
    chatTemplates: [
      { title: "Group booking redirect", content: "For a group of more than 10 passengers, we'll need you to submit the request through our group booking form rather than over the phone — I can send you the link now. Once it's a confirmed group booking, please note changes like modifications or ancillary edits can't be made through the Call Center either." },
    ],
    emailTemplates: [
      { title: "Group booking request", subject: "Group booking request", body: "Dear passenger,\n\nThanks for your interest in a group booking. Groups are classified as more than 10 passengers, and require more than 70 available seats on the requested flight in each sector. Please submit your request through our group booking form: https://forms.office.com/r/4Eewf1TWD9. Our Groups team will review availability and follow up with you directly. Please note that once a group booking is confirmed, modifications, cancellations, splits, ancillary changes and contact-detail changes cannot be processed through the Call Center.\n\nAir Arabia Customer Support" },
    ],
  },
  {
    title: "SkyTime – Onboard Entertainment – All Hubs",
    categoryName: "Ancillaries",
    description: "Free onboard entertainment accessed via the passenger's own device over the aircraft Wi-Fi.",
    overview:
      "SkyTime is a free onboard entertainment service — passengers access a wide selection of content on their own device rather than a seatback screen. After take-off, the passenger switches on their device's Wi-Fi and selects the SkyTime network, then logs in using their email address and seat number. The library includes the latest movies, TV shows, music, games and more. Power banks and headsets are available onboard at an additional cost.",
    scenarios: [
      { situation: "A passenger asks if they need to download an app before the flight to use SkyTime.", response: "No app or pre-download is needed — after take-off they just connect their device's Wi-Fi to the SkyTime network and log in with their email and seat number." },
      { situation: "A passenger with a dead phone battery asks how to watch something on SkyTime.", response: "They can rent a power bank onboard at an additional cost, then connect once their device has enough charge." },
      { situation: "A passenger asks if SkyTime is free.", response: "Yes, SkyTime itself is completely free — only optional extras like power banks and headsets carry an additional charge." },
    ],
    keywords: ["skytime", "entertainment", "wifi", "onboard"],
    chatTemplates: [
      { title: "SkyTime how-to", content: "You've got free onboard entertainment with SkyTime! After take-off, just connect your device's Wi-Fi to the SkyTime network and log in with your email and seat number — movies, TV, music and games are all included free. Headsets and power banks are available onboard for a small extra charge if you need them." },
    ],
  },
  {
    title: "Handling Complaints – All Hubs",
    categoryName: "Customer Support",
    description: "The core complaint-handling approach, the standard complaint types, and the two most common sub-procedures (payment issues and quality cases).",
    overview:
      "The most important skill when handling a complaint is listening and showing empathy, then acknowledging the inconvenience caused. Show the passenger you're doing your best to help, then offer a solution, escalate to a supervisor, or raise a case, depending on the complaint type.\n\nStandard complaint types: AirRewards, Booking issues, Business Class downgrade, Call Center complaints, Flight delay & cancellation, Holiday booking complaints, Onboard services, Payment issues, Staff behavior.",
    procedures: [
      { title: "Payment issues", content: "If a passenger's money was debited but the PNR isn't confirmed, first ask them to check again after 2 hours (the payment may still be processing). If still unresolved after 2 hours: run an advanced search to check whether a PNR was generated, raise a Sprinklr request for payment issues, and extend the booking's time limit by at least 24 hours (or create one if no PNR was found)." },
      { title: "Quality cases (Call Center complaints)", content: "Raise a request under Complaints > Call Center Complaints, then select the correct sub-type — e.g. wrong information given, wrong booking, wrong modification, or a cancellation that was requested but not completed." },
    ],
    scenarios: [
      { situation: "A passenger is upset that money was debited but they never received a booking confirmation.", response: "Empathize first, then ask them to check again in case the payment is still processing — if still unresolved after 2 hours, run an advanced search for a generated PNR, raise a Sprinklr payment-issues request, and extend the booking time limit by at least 24 hours." },
      { situation: "A passenger complains that a previous agent gave them the wrong modification fee over the phone.", response: "This is a quality case — raise it under Complaints > Call Center Complaints, selecting the 'wrong information' sub-type." },
      { situation: "A passenger is angry about a flight cancellation and wants to vent before discussing solutions.", response: "Let them speak, listen actively, and acknowledge the inconvenience before moving to solutions — jumping straight to policy without empathy tends to escalate the call further." },
    ],
    notes: [{ type: "Information", content: "Complaint types map to a specific Sprinklr sub-type each — always select the correct one so it routes to the right team." }],
    keywords: ["complaints", "escalation", "sprinklr", "payment issue"],
    chatTemplates: [
      { title: "Complaint acknowledgement", content: "I'm really sorry for the trouble this has caused — let me look into this properly for you right now. Can you walk me through exactly what happened so I make sure we fix the right thing?" },
    ],
    emailTemplates: [
      { title: "We've received your complaint", subject: "We've received your complaint", body: "Dear passenger,\n\nThank you for reaching out, and we're sorry for the inconvenience you've experienced. We've logged your complaint and it's being reviewed by the relevant team. We'll follow up with you directly once we have an update or resolution.\n\nWe appreciate your patience.\n\nAir Arabia Customer Support" },
    ],
  },
  {
    title: "Baggage Claims – All Hubs",
    categoryName: "Customer Support",
    description: "How passengers should report damaged, lost, or delayed baggage.",
    overview:
      "For baggage that is damaged, lost, or delayed, the passenger must report it at the arrival airport, at the time of arrival. For lost items, the passenger also needs to report at the airport — claims cannot be initiated after leaving the airport.",
    scenarios: [
      { situation: "A passenger calls two days after landing to report a damaged suitcase.", response: "Baggage damage must be reported at the arrival airport at the time of arrival — a report made days later after leaving the airport cannot be processed the same way; advise them to check with the arrival airport's baggage services desk regardless." },
      { situation: "A passenger's bag didn't arrive on the same flight and they're still at the airport.", response: "Good — since they're still at the airport, they should report the delayed baggage immediately at the arrival airport's baggage services counter." },
      { situation: "A passenger asks if they can email photos of damaged luggage instead of visiting a counter.", response: "Damage, loss, and delay all need to be reported at the arrival airport at the time of arrival — this isn't something that can be substituted with an email report after the fact." },
    ],
    notes: [{ type: "Warning", content: "Baggage claims are time- and location-sensitive — always direct the passenger to report at the arrival airport immediately, not after the fact." }],
    keywords: ["baggage claim", "damaged", "lost", "delayed"],
    chatTemplates: [
      { title: "Baggage claim redirect", content: "I'm sorry to hear about your baggage. For damaged, lost, or delayed baggage, this needs to be reported at the arrival airport's baggage services desk, ideally right at arrival — if you're still at the airport, please head there now so they can log it immediately." },
    ],
  },
  {
    title: "Contact Center Systems Overview – Accel Aero, Sprinklr, Caesar & Teams",
    categoryName: "Systems",
    description: "The four core systems agents use daily: Accel Aero for bookings, Sprinklr for cases, Caesar for flight-schedule verification, and Teams for internal escalation.",
    overview:
      "Accel Aero — the booking system used for flight search, ticketing, modification and cancellation.\n\nSprinklr — used to receive calls and handle customer cases (name changes, special discounts, holiday requests, payment issues, complaints). Login: https://airarabia.sprinklr.com, via SSO.\n\nMicrosoft Teams — internal communication, used to escalate urgent or same-day cases to the relevant team.\n\nEmail — used for official/documented communication and updates to passengers (e.g. case replies, cancellation confirmations).",
    procedures: [
      { title: "Caesar — verifying flight schedule changes", content: "Caesar is used to confirm planned vs. unplanned flight time changes. Use the hub-specific link: G9 https://cesarapi.airarabia.com/admin/#/flight-information-report · 3L https://crewad.accelaero.cloud/admin/#/flight-information-report · 3O https://crew3o.accelaero.cloud/admin/#/flight-information-report · E5 https://crewe5.accelaero.cloud/admin/#/flight-information-report · 9P https://crew9p.accelaero.com/admin/#/flight-information-report. If Caesar isn't updated yet, check with the Duty Supervisor." },
      { title: "Flight status general inquiries", content: "If the question is only about a flight's departure/arrival timing (not a booking change), PNR collection and caller verification are not required — the caller may not be the passenger. Use the hub-specific Caesar link to check." },
    ],
    scenarios: [
      { situation: "A caller just wants to know if a G9 flight has landed yet, and doesn't have the PNR handy.", response: "No PNR or verification needed for a general flight-status question — check the G9 Caesar link directly using the flight number and date." },
      { situation: "An agent needs to confirm whether a flight time change is a planned schedule adjustment or an unplanned operational change.", response: "Check Accel Aero for the system alert first, then confirm via the hub's Caesar link; if Caesar hasn't been updated yet, check with the Duty Supervisor rather than guessing." },
      { situation: "A new agent isn't sure which system to use to raise a name-change case.", response: "Sprinklr — create a case there for name-change requests requiring proof of relationship/documents; Accel Aero is for the booking action itself, not case management." },
    ],
    notes: [{ type: "Information", content: "Accel Aero, Sprinklr, Caesar and Teams cover different jobs — booking, case management, schedule verification, and internal escalation respectively. Don't conflate them." }],
    keywords: ["systems", "accel aero", "sprinklr", "caesar", "teams"],
  },
  {
    title: "Airport Shuttle Bus Services – G9 & 3L",
    categoryName: "General Information",
    description: "Airport shuttle bus options for passengers travelling to/from Abu Dhabi, Sharjah, and Ras Al Khaimah airports.",
    overview:
      "3L (Abu Dhabi): operates between Ibn Battuta Mall (Dubai) and Abu Dhabi International Airport, hourly. Ticket purchased at the bus station before departure, subject to availability. Operated by Abu Dhabi Airport (not Air Arabia).\n\nG9 (Sharjah): Ras Al Khaimah office ↔ Sharjah Airport, AED 30, operated by Air Arabia; or City Centre Al Shindagha ↔ Sharjah Airport, free of charge, operated by Air Arabia. Tickets via Air Arabia office or on the bus, subject to availability.\n\nG9 (Ras Al Khaimah): operates between Dubai, Sharjah, Ajman and Umm Al Quwain and Ras Al Khaimah International Airport. Operated by RAK Airport, free of charge, first come first served, subject to availability.",
    scenarios: [
      { situation: "A passenger in Dubai wants a free bus to Sharjah Airport.", response: "The City Centre Al Shindagha to Sharjah Airport bus is free of charge and operated by Air Arabia — that's their best free option; the Ras Al Khaimah office route is AED 30." },
      { situation: "A passenger asks if they can guarantee a seat on the RAK Airport bus in advance.", response: "No — it's first come first served, subject to availability, with no reservation option." },
      { situation: "A passenger travelling to Abu Dhabi Airport from Dubai asks about the bus schedule.", response: "The 3L bus runs hourly between Ibn Battuta Mall and Abu Dhabi International Airport, operated by Abu Dhabi Airport — tickets are purchased at the bus station before departure, subject to availability." },
    ],
    keywords: ["bus service", "shuttle", "airport transfer"],
    chatTemplates: [
      { title: "Airport shuttle bus info", content: "If you need a bus to the airport: for Sharjah, there's a free Air Arabia bus from City Centre Al Shindagha, or AED 30 from our Ras Al Khaimah office; for Abu Dhabi, there's an hourly bus from Ibn Battuta Mall; for Ras Al Khaimah Airport, there's a free shuttle from Dubai/Sharjah/Ajman/Umm Al Quwain, first come first served. Want the schedule details for a specific route?" },
    ],
  },
];

async function createNewArticles(categoryIdByName: Record<string, number>) {
  for (const spec of NEW_ARTICLES) {
    const existing = await prisma.article.findFirst({ where: { title: spec.title } });
    if (existing) {
      console.log(`Skip (already exists): ${spec.title}`);
      continue;
    }

    const categoryId = categoryIdByName[spec.categoryName];
    if (!categoryId) throw new Error(`Unknown category: ${spec.categoryName}`);

    const article = await prisma.article.create({
      data: {
        title: spec.title,
        slug: `${slugify(spec.title)}-${Date.now()}`,
        categoryId,
        description: spec.description,
        overview: spec.overview,
        author: AUTHOR,
        status: "Published",
        ...buildArticleSectionsCreateData({
          procedures: spec.procedures,
          scenarios: spec.scenarios,
          notes: spec.notes,
          keywords: spec.keywords,
          chatTemplates: spec.chatTemplates,
          emailTemplates: spec.emailTemplates,
        }),
      },
    });
    console.log(`Created article: ${spec.title} (#${article.id})`);
  }
}

// ---------------------------------------------------------------------------
// 3. Chat/email templates for the 43 existing published articles, keyed by
//    their (stable) slug. Purely additive — only touches the two new
//    relations, never replaces existing sections.
// ---------------------------------------------------------------------------

interface TemplateSpec {
  chatTemplates?: { title: string; content: string }[];
  emailTemplates?: { title: string; subject: string; body: string }[];
}

const EXISTING_TEMPLATES: Record<string, TemplateSpec> = {
  "general-ticket-types-all-hubs": {
    chatTemplates: [{ title: "Ticket type classification", content: "Ticket type depends on age as of the travel date: 12+ is Adult, 2–11 is Child, under 2 is Infant. Let me know each passenger's age and I'll classify them correctly." }],
    emailTemplates: [{ title: "Ticket type classification", subject: "Ticket type classification", body: "Dear passenger,\n\nJust to confirm how ticket types work: age is considered as of the travel date. Passengers 12 years or older are booked as Adult, 2–11 years as Child, and under 2 years as Infant. Let us know each traveller's date of birth and we'll make sure everyone is booked correctly.\n\nAir Arabia Customer Support" }],
  },
  "general-travel-restrictions-children-infants-pregnant-women-all-hubs": {
    chatTemplates: [{ title: "Travel restriction summary", content: "A quick note on travel restrictions: children under 12 must travel with an adult 16+; infants need to be at least 3 days old (with a Fit to Fly certificate for 3–6 days); and pregnant passengers need a Fit to Fly certificate from the 29th week onward. Let me know the specifics and I'll confirm what's needed." }],
    emailTemplates: [{ title: "Travel restriction requirements", subject: "Travel restriction requirements", body: "Dear passenger,\n\nHere's a summary of our travel restrictions: children under 12 must be accompanied by an adult aged 16+; infants aged 3–6 days may travel only with a Fit to Fly certificate, and those 7+ days can travel freely; pregnant passengers need a disclaimer form up to the 28th week, and a Fit to Fly certificate from the 29th week onward (travel allowed until week 35 for a single pregnancy, week 32 for multiples).\n\nAir Arabia Customer Support" }],
  },
  "general-fit-to-fly-certificate-requirements-all-hubs": {
    chatTemplates: [{ title: "Fit to Fly certificate requirements", content: "Your Fit to Fly certificate needs to confirm you're fit to fly, be signed and stamped by a doctor or hospital, and be dated within 14 days of your flight. If it's for pregnancy, it also needs to state how many weeks along you are." }],
    emailTemplates: [{ title: "Fit to Fly certificate requirements", subject: "Fit to Fly certificate requirements", body: "Dear passenger,\n\nYour Fit to Fly certificate must: confirm fitness to fly, be signed and stamped by a doctor/hospital, and be valid for 14 days from the date of issuance. If applicable, it must also state the number of weeks of pregnancy. Please have this ready before travel.\n\nAir Arabia Customer Support" }],
  },
  "general-hand-carry-checked-in-baggage-allowance-all-hubs": {
    chatTemplates: [{ title: "Baggage allowance quote", content: "Your hand carry allowance is 7kg plus a 3kg personal item (max 100ml liquids), and checked baggage can't exceed 32kg per piece — anything over that is charged per kilo at the airport plus a handling fee. Want me to check your exact checked baggage allowance for your fare?" }],
    emailTemplates: [{ title: "Baggage allowance details", subject: "Baggage allowance details", body: "Dear passenger,\n\nYour standard allowance: 7kg hand carry + 3kg personal item (100ml max liquids), and checked baggage up to 32kg per piece (dimension limit 158cm W+L+H). Any excess weight is charged per kilo at the airport plus a handling fee, and any additional piece is also charged at the airport. Infants do not receive a checked baggage allowance.\n\nAir Arabia Customer Support" }],
  },
  "general-restricted-items-in-checked-in-baggage-all-hubs": {
    chatTemplates: [{ title: "Restricted items check", content: "A few things can't go in checked baggage — flammable/poisonous items, firearms and explosives, corrosives like wet-cell batteries, cooking oils, and matches/lighters, among others. Let me know what you're planning to pack and I can confirm if it's fine." }],
    emailTemplates: [{ title: "Restricted baggage items", subject: "Restricted baggage items", body: "Dear passenger,\n\nFor safety, certain items can't be carried in checked baggage, including flammable/poisonous/radioactive substances, firearms and explosives, corrosive materials (e.g. wet-cell batteries), cooking oils, and matches or lighters. Please review your packing list and let us know if you have questions about a specific item.\n\nAir Arabia Customer Support" }],
  },
  "general-special-checked-in-baggage-items-olive-oil-zamzam-water-baby-stroller": {
    chatTemplates: [{ title: "Special baggage items", content: "A few special items have their own rules: olive oil on G9 needs a steel container in a wrapped wooden box; Zamzam water is one free 5L bottle from KSA (E5/9P/G9 only); and a stroller stays free if used up to the gate rather than checked at the counter." }],
    emailTemplates: [{ title: "Special baggage items — olive oil, Zamzam water, stroller", subject: "Special baggage items — olive oil, Zamzam water, stroller", body: "Dear passenger,\n\nA few special-item notes: olive oil (G9) must be in a steel container inside a wrapped wooden box; Zamzam water (E5, 9P, G9) is limited to one free 5-litre bottle purchased from an authorized airport shop; and baby strollers are free of the baggage allowance if used up to the boarding gate rather than checked in at the counter.\n\nAir Arabia Customer Support" }],
  },
  "general-seating-front-row-benefits-exit-seat-rules-all-hubs": {
    chatTemplates: [{ title: "Seating options", content: "Front-row seats give extra legroom and are the only ones eligible for a baby bassinet (subject to availability). Exit row seats need the passenger to be 16+, not pregnant, in good health, and able to assist in an emergency if asked." }],
    emailTemplates: [{ title: "Seating options", subject: "Seating options", body: "Dear passenger,\n\nFront-row seats offer extra legroom and are the only seats where a baby bassinet can be requested (subject to availability). Exit row seats require the passenger to be over 16, not pregnant, in good health, and physically able to assist in an emergency if instructed by the crew.\n\nAir Arabia Customer Support" }],
  },
  "general-travel-insurance-all-hubs": {
    chatTemplates: [{ title: "Insurance plan comparison", content: "We offer two Tune Protect plans — Gold covers medical/evacuation essentials, while Platinum adds baggage, travel delay, cancellation and personal-item cover on top. Coverage runs from departure to return date, max 90 days. Want the full benefit breakdown?" }],
    emailTemplates: [{ title: "Travel insurance – Platinum & Gold plans", subject: "Travel insurance – Platinum & Gold plans", body: "Dear passenger,\n\nOur Tune Protect insurance comes in two plans. Both include Accidental Death & Disablement (USD 20,000), medical reimbursement (up to USD 50,000), hospital allowance, and 24/7 emergency assistance. Platinum additionally covers loss of documents/money, travel delay, missed departure, cancellation, baggage delay/loss, home protection and mugging. Coverage runs from your departure date to your return date, for a maximum of 90 days. Note that changing your return date does not automatically update your insurance.\n\nAir Arabia Customer Support" }],
  },
  "general-wheelchair-assistance-all-hubs": {
    chatTemplates: [{ title: "Wheelchair assistance", content: "Wheelchair assistance is arranged through the airport's own service provider rather than Air Arabia directly, and there may be a charge assessed at check-in depending on your situation. I'd recommend requesting it as early as possible." }],
    emailTemplates: [{ title: "Wheelchair assistance", subject: "Wheelchair assistance", body: "Dear passenger,\n\nWheelchair assistance at the airport is provided by the airport's own service provider, not directly by Air Arabia. Charges may apply depending on your situation and are assessed at check-in. Please note personal wheelchairs cannot be used within the airport. We recommend requesting assistance as early as possible.\n\nAir Arabia Customer Support" }],
  },
  "general-ancillary-cut-off-times-all-hubs": {
    chatTemplates: [{ title: "Ancillary cut-off check", content: "Cut-off times vary by hub and ancillary — for example G9/9P baggage and meal need 12 hours' notice, while 3O meal needs 48 hours and baggage just 4. Tell me your hub and what you'd like to add and I'll confirm if it's still possible." }],
    emailTemplates: [{ title: "Ancillary booking cut-off times", subject: "Ancillary booking cut-off times", body: "Dear passenger,\n\nCut-off times for adding ancillaries differ by hub: G9 and 9P — seat/meal/baggage 12 hours prior, wheelchair any time; 3O — seat 12 hours, meal 48 hours, baggage 4 hours, wheelchair 24 hours prior. Airport services (Sharjah only, G9) can be added up to 24 hours prior.\n\nAir Arabia Customer Support" }],
  },
  "general-check-in-timings-all-hubs": {
    chatTemplates: [{ title: "Check-in counter timing", content: "Check-in counters open 3 hours and close 1 hour before departure — except 9P Domestic, which opens 2 hours and closes 45 minutes prior. Make sure to arrive with buffer time." }],
  },
  "general-online-check-in-all-hubs": {
    chatTemplates: [{ title: "Online check-in window", content: "Online check-in opens 48 hours and closes 3 hours before departure — once done you can download or email your boarding pass. If you get a 'check-in successful' message but no pass, that just means your arrival airport needs you to collect a physical one at the counter." }],
    emailTemplates: [{ title: "Online check-in", subject: "Online check-in", body: "Dear passenger,\n\nOnline check-in is open from 48 hours down to 3 hours before departure — once complete you can download or email your boarding pass. If you receive a confirmation message but no boarding pass, this simply means the airport requires a physical boarding pass, which you can collect at the check-in counter using your booking reference.\n\nAir Arabia Customer Support" }],
  },
  "general-no-show-airport-taxes-all-hubs": {
    chatTemplates: [{ title: "No-show tax credit check", content: "If you missed your flight, airport taxes are automatically credited for G9, E5 and 9P (3O only on request) — valid 1 year from date of payment. Want me to check the credit status on your PNR?" }],
    emailTemplates: [{ title: "No-show airport tax credit", subject: "No-show airport tax credit", body: "Dear passenger,\n\nSince you missed your flight, your airport taxes are eligible for credit (automatic for G9, E5 and 9P; for 3O, only upon request). The credit is kept under your name and is valid for up to 1 year from the date of payment. A cash refund instead of credit can only be processed if specifically requested.\n\nAir Arabia Customer Support" }],
  },
  "general-flight-rescheduling-flexibility-rules-all-hubs": {
    chatTemplates: [{ title: "Flight change entitlement check", content: "Your entitlement depends on the delay: under 2 hours gets nothing, 2–4 hours gets free rebooking and cancellation (no refund), and over 4 hours or an operational cancellation gets free rebooking, cancellation and refund. Rebooking itself is free within ±7 days of your original date." }],
    emailTemplates: [{ title: "Your flight change entitlements", subject: "Your flight change entitlements", body: "Dear passenger,\n\nRegarding your flight change: a delay/advance of less than 2 hours carries no free entitlements; 2–4 hours entitles you to free rebooking and free cancellation (no refund); more than 4 hours, or a commercial/operational cancellation, entitles you to free rebooking, cancellation and refund. Force majeure cancellations allow free rebooking and cancellation but not a refund (except 9P Domestic). Rebooking is free within ±7 days of your original date; beyond that, only the fare difference applies.\n\nAir Arabia Customer Support" }],
  },
  "general-cai-cairo-flights-business-class-basic-ultimate-economy-all-hubs": {
    chatTemplates: [{ title: "Cairo flight fare rules", content: "Cairo flights are special — Economy only offers Basic and Ultimate (no Value), and it's the only route with Business Class. Basic needs 24h notice for changes (AED 200 fee + fare diff); Ultimate/Business need only 8h with more free modifications." }],
    emailTemplates: [{ title: "Cairo (CAI) flight fare rules", subject: "Cairo (CAI) flight fare rules", body: "Dear passenger,\n\nCairo flights have their own rules: Economy is Basic or Ultimate only (no Value bundle), and Cairo is the only route offering Business Class. Basic fare changes need 24 hours' notice (AED 200 per passenger per sector + fare difference). Ultimate and Business Class need only 8 hours' notice, with free/discounted modifications. Front-row seats are reserved for Business Class, and Economy passengers don't have bassinet access on Cairo routes.\n\nAir Arabia Customer Support" }],
  },
  "g9-bundle-fares-g9": {
    chatTemplates: [{ title: "G9 bundle comparison", content: "On G9, Basic charges for baggage/seat/meal separately; Value includes baggage + free seating from row 8 + a sandwich; Ultimate includes bigger baggage, any seat from row 2, a hot meal and priority check-in. Which matters most to you — price, flexibility, or comfort?" }],
    emailTemplates: [{ title: "G9 bundle fare comparison", subject: "G9 bundle fare comparison", body: "Dear passenger,\n\nHere's a quick comparison of our G9 bundles: Basic keeps the base fare low but charges separately for baggage, seat and meal. Value includes checked baggage, free seating from row 8, a sandwich + water, and 1 free modification. Ultimate includes bigger baggage, any seat from row 2, a hot meal, 2 free modifications, and included priority check-in.\n\nAir Arabia Customer Support" }],
  },
  "g9-excess-baggage-rates-g9": {
    chatTemplates: [{ title: "Excess baggage charge quote", content: "Excess baggage on G9 is billed per kilo based on your destination and whether it's a direct or connecting route — let me check the exact rate for your sector. Would you like to add the extra weight to your booking now, or pay at the airport?" }],
    emailTemplates: [{ title: "Your Air Arabia excess baggage query", subject: "Your Air Arabia excess baggage query", body: "Dear passenger,\n\nExcess baggage on G9 is charged per kilogram based on your destination and whether you're travelling point-to-point or connecting (rates range roughly from AED 45 to AED 105+ per kg depending on region). Airport handling fees apply on top. You're welcome to add the extra weight to your booking in advance, or pay the excess at the airport. Note that carton boxes are not accepted on flights to Bangladesh.\n\nAir Arabia Customer Support" }],
  },
  "g9-tv-handling-g9": {
    chatTemplates: [{ title: "TV handling quote", content: "TVs under 40 inch fly free as part of your baggage allowance; 40–60 inch is AED 150 + airport handling fee; over 60 inch can't be accepted. No limit on how many TVs you bring." }],
    emailTemplates: [{ title: "Bringing a TV on your G9 flight", subject: "Bringing a TV on your G9 flight", body: "Dear passenger,\n\nTVs under 40 inches travel free within your baggage allowance (counted as 1 piece). TVs between 40–60 inches are AED 150 plus an airport handling fee. TVs over 60 inches cannot be accepted. There's no limit on the number of TVs you can bring, each charged individually.\n\nAir Arabia Customer Support" }],
  },
  "g9-airport-services-sharjah-shj-airport-only": {
    chatTemplates: [{ title: "Sharjah airport services", content: "For Sharjah Airport specifically we offer Meet & Assist, Fast Track, Porter service, a Business Lounge (from AED 145) and airport transfers — bookable up to 24 hours before departure. Want me to check availability for your flight?" }],
    emailTemplates: [{ title: "Sharjah Airport premium services", subject: "Sharjah Airport premium services", body: "Dear passenger,\n\nFor Sharjah Airport travel we offer several premium services, bookable up to 24 hours prior to departure: Meet & Assist / Fast Track (departure, arrival and transit), a Business Lounge with Wi-Fi, showers, and 24/7 food & beverage (starting AED 145 depending on bags), and airport transfers via sedan (up to 4 passengers, book at +971 54 3082573 or booking@sayararental.com).\n\nAir Arabia Customer Support" }],
  },
  "g9-city-check-in-g9-3l-only": {
    chatTemplates: [{ title: "City Check-in info", content: "You can drop your bags and get your boarding pass at a City Check-in center from 48 hours down to 8 hours before departure (AED 20/passenger) — just bring everyone's passports and have at least 1 traveller attend in person." }],
    emailTemplates: [{ title: "City Check-in service", subject: "City Check-in service", body: "Dear passenger,\n\nCity Check-in lets you check in luggage and collect your boarding pass before heading to the airport — available from 48 hours down to 8 hours before departure, for AED 20 per passenger. At least one passenger from the booking must attend in person with the original passports of everyone traveling. Same-day flights must check in before 4pm. Locations: Sharjah, Ajman, Dubai, and Ras Al Khaimah (G9), or Abu Dhabi, Al Ain, and Dubai Al Shindagha (3L). Please still arrive at the airport 1.5 hours before departure.\n\nAir Arabia Customer Support" }],
  },
  "g9-name-change-g9": {
    chatTemplates: [{ title: "Name change quote", content: "Name changes need 24 hours' notice — AED 350 + fare difference if paying by card/cash, or the same if using a family member's credit (with proof of relationship via a Sprinklr case). Pure spelling corrections are free — just need supporting documents." }],
    emailTemplates: [{ title: "Name change request received", subject: "Name change request received", body: "Dear passenger,\n\nWe've logged your name change request. If this is a spelling correction only, it's free of charge once we receive your supporting documents. If you're using a family member's credit voucher, please reply with proof of relationship — we'll process this as a Sprinklr case and follow up by email once reviewed. Standard paid name changes are AED 350 per passenger plus any fare difference, and must be completed at least 24 hours before the first sector's departure.\n\nAir Arabia Customer Support" }],
  },
  "g9-ok-to-board-otb-g9": {
    chatTemplates: [{ title: "Ok to Board requirement", content: "If you're flying to the UAE from India, Pakistan or Bangladesh on a UAE visa, you'll need an Ok to Board message updated at an Air Arabia office at least 24 hours before departure — bring your visa copy, passport and PNR (AED 15–20 fee)." }],
    emailTemplates: [{ title: "Ok to Board (OTB) requirement", subject: "Ok to Board (OTB) requirement", body: "Dear passenger,\n\nAs you're travelling to the UAE from India, Pakistan or Bangladesh with a UAE visa, an Ok to Board message must be updated before travel. Please visit any Air Arabia office at least 24 hours before departure with your visa copy, passport, and PNR number (a charge of AED 15–20 per passenger applies). If your departure is under 24 hours away, please visit the office as soon as possible.\n\nAir Arabia Customer Support" }],
  },
  "g9-pets-animals-falcons-g9": {
    chatTemplates: [{ title: "Falcon travel inquiry", content: "We don't carry pets on board — the one exception on G9 is falcons, which need a Basic-fare seat booking with no added services, at least 48 hours before departure, and a note added to the booking. Let me pass this to a supervisor to confirm details." }],
    emailTemplates: [{ title: "Traveling with a falcon (G9)", subject: "Traveling with a falcon (G9)", body: "Dear passenger,\n\nPets and animals aren't permitted on Air Arabia flights, with one exception: falcons on G9. If a seat is needed for the falcon, it must be booked on a Basic fare with no additional services, at least 48 hours before departure, with no additional baggage allowance for that seat. Please share the number of passengers, number of falcons, and destination, and we'll confirm the booking details with our team.\n\nAir Arabia Customer Support" }],
  },
  "g9-cargo-trade-support-g9": {
    chatTemplates: [{ title: "G9 cargo & trade contacts", content: "For Sharjah cargo: Export 06-514-1174 (24/7), Import 06-514-1188/1189 (24/7). For trade/travel-agency support: trade@airarabia.com or 600 50 8002 (9am–10pm)." }],
    emailTemplates: [{ title: "G9 cargo & trade contacts", subject: "G9 cargo & trade contacts", body: "Dear customer,\n\nFor cargo inquiries: Export (sending from Sharjah) — SAS Export Counter 06-514-1174 (24/7); Import (receiving to Sharjah) — SAS Import Counter 06-514-1188/1189 (24/7). For shipments from outstations to Sharjah, email pkurian@airarabia.com. For travel agency/trade inquiries, contact trade@airarabia.com or 600 50 8002, 9am–10pm.\n\nAir Arabia Customer Support" }],
  },
  "g9-air-arabia-holidays-g9": {
    chatTemplates: [{ title: "Holidays request", content: "We can't book Holiday packages directly over the phone — I'll raise a Sprinklr request with your passenger count, destination, dates and contact info, and our Holidays team will reach out to complete the booking." }],
    emailTemplates: [{ title: "Your Air Arabia Holidays request", subject: "Your Air Arabia Holidays request", body: "Dear passenger,\n\nThanks for your interest in an Air Arabia Holidays package (flight + hotel + transfers + tours). We've raised your request with our Holidays team, who will contact you directly to complete the booking. Please note: modifications aren't permitted on Holiday packages, and cancellations must be requested at least 72 hours before departure — cancellations result in a credit voucher (valid 1 year), not a cash refund.\n\nAir Arabia Customer Support" }],
  },
  "g9-special-discounts-homat-al-watan-fazaa-waffer-esaad-g9": {
    chatTemplates: [{ title: "Special discount card request", content: "For Homat Al Watan/Fazaa/Waffer/Esaad, it's a 10% discount on Ultimate/Business bookings from Abu Dhabi, RAK or Sharjah. I'll raise a case on Sprinklr — just reply with your original ID and proof of relationship and our team will contact you." }],
    emailTemplates: [{ title: "Special discount card request", subject: "Special discount card request", body: "Dear passenger,\n\nThank you for your special discount card request. We've raised a case for our outbound team to contact you — please reply with a copy of your original ID and proof of relationship (for family members). The discount is 10% on Ultimate Bundle or Business Class Cairo fares, valid on bookings departing Abu Dhabi, RAK or Sharjah. We won't create an on-hold booking — our team will build the booking directly once your documents are confirmed.\n\nAir Arabia Customer Support" }],
  },
  "3l-early-home-check-in-abu-dhabi-sharjah-airports": {
    chatTemplates: [{ title: "Early & home check-in options", content: "In Abu Dhabi you can check in early at Cruise Terminal, YAS Mall or Mussafah (from AED 15–35), or have MORAFIQ come to you for home check-in. In Sharjah, home check-in starts at AED 145, and early check-in at the airport itself is free." }],
    emailTemplates: [{ title: "Early & home check-in options", subject: "Early & home check-in options", body: "Dear passenger,\n\nIn Abu Dhabi: Early Check-in is available at Cruise Terminal, YAS Mall and Mussafah from 24 hours before departure (AED 35 adult / AED 25 child / AED 15 infant), or Home Check-in via MORAFIQ registration, with pricing from AED 185 depending on bag count. In Sharjah: Home Check-in starts at AED 145 (book up to 6 hours before departure), or free Early Check-in at the airport itself from 24 hours prior.\n\nAir Arabia Customer Support" }],
  },
  "3o-bundle-fares-3o-domestic-international": {
    chatTemplates: [{ title: "3O bundle comparison", content: "3O bundles differ by domestic vs international — Basic charges extras separately, Value includes baggage + free seating from row 8, Ultimate includes bigger baggage, any seat from row 2, and a hot meal. Which sector are you flying, and what matters most to you?" }],
    emailTemplates: [{ title: "3O bundle fare comparison", subject: "3O bundle fare comparison", body: "Dear passenger,\n\n3O offers Basic, Value and Ultimate bundles, with different figures for domestic vs international flights. Basic keeps the fare low but charges for baggage/seat/meal separately. Value includes checked baggage, free seating from row 8, and a meal, with 1 free modification. Ultimate includes bigger baggage, any seat from row 2, a hot meal, 2 free modifications, and included priority check-in.\n\nAir Arabia Customer Support" }],
  },
  "3o-excess-baggage-rates-3o": {
    chatTemplates: [{ title: "3O excess baggage quote", content: "Excess baggage on 3O depends on direction — from Morocco it's priced in MAD (e.g. MAD 120/kg to most of Europe, MAD 250/kg to UAE), to Morocco it's priced in EUR/GBP/CHF (around 12/kg). Want me to check your specific route?" }],
    emailTemplates: [{ title: "3O excess baggage rates", subject: "3O excess baggage rates", body: "Dear passenger,\n\nExcess baggage rates on 3O depend on direction of travel. From Morocco: most European destinations, Turkey are MAD 120/kg, UAE is MAD 250/kg, Domestic is MAD 50/kg. To Morocco: most destinations are around 12 EUR/GBP/CHF per kg. There's no restriction on the number of pieces.\n\nAir Arabia Customer Support" }],
  },
  "3o-tv-handling-3o": {
    chatTemplates: [{ title: "TV handling quote", content: "TVs under 40 inch fly free; 40–60 inch is MAD 500 plus a signed indemnity form at the airport; over 60 inch can't be accepted. No limit on the number of TVs." }],
    emailTemplates: [{ title: "Bringing a TV on your 3O flight", subject: "Bringing a TV on your 3O flight", body: "Dear passenger,\n\nTVs under 40 inches travel free within your baggage allowance. TVs 40–60 inches are MAD 500 and require a signed indemnity form at the airport. TVs over 60 inches cannot be accepted.\n\nAir Arabia Customer Support" }],
  },
  "3o-name-change-3o": {
    chatTemplates: [{ title: "Name correction quote", content: "Free corrections cover spelling fixes, switching to a spouse's last name (with marriage proof), or an AirRewards account booked with a totally wrong name. A wrong first/last name with correct DOB/passport costs MAD 400 international / MAD 200 domestic. Full name changes to a different person aren't permitted." }],
    emailTemplates: [{ title: "3O name correction request", subject: "3O name correction request", body: "Dear passenger,\n\nWe've reviewed your name correction request. Spelling corrections, updating to a spouse's last name (with marriage proof), or fixing a wrong name from an AirRewards booking are free of charge. A wrong first or last name — where date of birth and passport number are already correct — carries a fee of MAD 400 (international) or MAD 200 (domestic). A complete change to a different traveler's name isn't permitted under 3O policy.\n\nAir Arabia Customer Support" }],
  },
  "3o-cargo-trade-support-3o": {
    chatTemplates: [{ title: "3O cargo & trade contacts", content: "For Morocco cargo: +212 666 28 49 02 or maccargobooking@airarabia.com. For trade support, use your country-specific email — I can look that up for you now." }],
    emailTemplates: [{ title: "3O cargo & trade contacts", subject: "3O cargo & trade contacts", body: "Dear customer,\n\nFor cargo bookings to/from Morocco: +212 666 28 49 02, maccargobooking@airarabia.com. For trade support, please use your country's dedicated contact (e.g. Spain — macsalessupport-Spain@airarabia.com, France — macsalessupport-France@airarabia.com, Germany — macsalessupport-Germany@airarabia.com, UK & Ireland — macsalessupport-UK@airarabia.com, Turkey — info@airarabiaturkey.com).\n\nAir Arabia Customer Support" }],
  },
  "9p-bundle-fares-9p-domestic-international": {
    chatTemplates: [{ title: "9P bundle comparison", content: "9P bundles are priced in PKR for domestic and AED for international — Basic charges extras separately, Value includes baggage from row 8, Ultimate includes bigger baggage, any seat and a hot meal. Which sector are you flying?" }],
    emailTemplates: [{ title: "9P (Fly Jinnah) bundle fares", subject: "9P (Fly Jinnah) bundle fares", body: "Dear passenger,\n\n9P bundles are priced separately for Domestic (PKR) and International (AED) sectors, each with Basic, Value and Ultimate tiers. Basic charges baggage/seat/meal separately; Value includes baggage and free seating from row 8; Ultimate includes bigger baggage, any seat from row 2, a hot meal and included priority check-in.\n\nAir Arabia Customer Support" }],
  },
  "9p-excess-baggage-rates-9p": {
    chatTemplates: [{ title: "9P excess baggage quote", content: "Excess baggage rates on 9P depend on whether you're flying domestic, or international departing/arriving Pakistan — each has its own table, and international arrivals also depend on direct vs connecting. Let me check your exact sector." }],
    emailTemplates: [{ title: "9P excess baggage rates", subject: "9P excess baggage rates", body: "Dear passenger,\n\nExcess baggage on 9P depends on your sector: Domestic (PKR 200/kg excess, PKR 3,800 first piece), International departing Pakistan (PKR 2,000/kg excess, PKR 6,000 first piece), or International arriving Pakistan (AED 60/kg direct or AED 70/kg connecting, AED 100 first piece). Oversize items are capped at 305cm.\n\nAir Arabia Customer Support" }],
  },
  "9p-tv-handling-9p": {
    chatTemplates: [{ title: "TV handling quote", content: "TVs under 40 inch fly free; 40–60 inch is PKR 2,500 domestic or AED 150 international, plus a handling fee; over 60 inch can't be accepted." }],
    emailTemplates: [{ title: "Bringing a TV on your 9P flight", subject: "Bringing a TV on your 9P flight", body: "Dear passenger,\n\nTVs under 40 inches travel free within your baggage allowance. TVs 40–60 inches are PKR 2,500 (domestic) or AED 150 (international), plus an airport handling fee. TVs over 60 inches cannot be accepted.\n\nAir Arabia Customer Support" }],
  },
  "9p-name-change-9p": {
    chatTemplates: [{ title: "Name change quote", content: "Name changes need 24 hours' notice — PKR 3,500 (domestic) / AED 350 (international) + fare difference, or the same using family credit with proof of relationship. Spelling corrections are free with supporting documents." }],
    emailTemplates: [{ title: "Name change request received", subject: "Name change request received", body: "Dear passenger,\n\nWe've logged your name change request. Spelling corrections are free once we receive supporting documents. If you're using a family member's credit voucher, please reply with proof of relationship — we'll raise this as a Sprinklr case and follow up by email. Standard paid name changes are PKR 3,500 (domestic) or AED 350 (international) per passenger plus any fare difference.\n\nAir Arabia Customer Support" }],
  },
  "9p-ok-to-board-otb-9p": {
    chatTemplates: [{ title: "Ok to Board requirement", content: "If you're flying to the UAE from India, Pakistan or Bangladesh on a UAE visa, you'll need an Ok to Board message updated at an Air Arabia office at least 24 hours before departure — free in Pakistan offices, AED 15–20 in UAE offices." }],
    emailTemplates: [{ title: "Ok to Board (OTB) requirement", subject: "Ok to Board (OTB) requirement", body: "Dear passenger,\n\nAs you're travelling to the UAE from India, Pakistan or Bangladesh with a UAE visa, an Ok to Board message must be updated before travel. Please visit any Air Arabia office at least 24 hours before departure with your visa copy, passport and PNR number — this is free of charge at Pakistan offices, or AED 15–20 per passenger at UAE offices.\n\nAir Arabia Customer Support" }],
  },
  "9p-apwtac-military-vouchers-9p": {
    chatTemplates: [{ title: "APW/TAC voucher booking", content: "APW/TAC vouchers can only be used for a new booking at a Fly Jinnah office — vouchers are valid 30 days, and name changes aren't allowed on either type. I can still help with modification, cancellation or ancillary edits on an existing APW/TAC booking." }],
    emailTemplates: [{ title: "APW/TAC military voucher booking", subject: "APW/TAC military voucher booking", body: "Dear passenger,\n\nFor a new booking using an APW or TAC military voucher, please visit a Fly Jinnah office directly — this can't be completed over the phone. Vouchers are valid for 30 days from issuance, and name changes aren't permitted on either voucher type. If you need to modify, cancel, or adjust ancillaries on an existing APW/TAC booking, we're happy to assist with that here.\n\nAir Arabia Customer Support" }],
  },
  "9p-transport-of-dead-body-9p": {
    chatTemplates: [{ title: "Transport of deceased passenger", content: "I'm very sorry for your loss. For transporting a deceased passenger we'll need a death certificate, coffin box certificate, police NOC, CNIC copies, and at least one attendant with a confirmed ticket — reporting is 1 hour before departure at cargo. Charge is PKR 20,000 plus airport handling fees." }],
    emailTemplates: [{ title: "Transport of deceased passenger — requirements", subject: "Transport of deceased passenger — requirements", body: "Dear family member,\n\nWe're very sorry for your loss, and we're here to help arrange this as smoothly as possible. Please prepare: a death certificate attested by a government hospital (with CNIC copy), a coffin box certificate from a certified provider, a police station NOC, the deceased's CNIC copy, and at least one attendant travelling with a confirmed ticket. Reporting time is 1 hour before departure at cargo. The charge is PKR 20,000 plus applicable airport handling fees. For urgent help, call our 24/7 line: +92 300 8214381.\n\nAir Arabia Customer Support" }],
  },
  "e5-excess-baggage-rates-e5": {
    chatTemplates: [{ title: "E5 excess baggage quote", content: "Excess baggage on E5 depends on direction and destination — e.g. Cairo to Sharjah is EGP 450/kg, Amman to Cairo is JOD 6/kg. Let me check your exact route." }],
    emailTemplates: [{ title: "E5 excess baggage rates", subject: "E5 excess baggage rates", body: "Dear passenger,\n\nExcess baggage rates on E5 vary by direction and destination — for example, from Egypt to Sharjah is EGP 450/kg, and to Egypt from Amman is JOD 6/kg. No-baggage-fare customers have a separate first-20kg rate.\n\nAir Arabia Customer Support" }],
  },
  "e5-tv-handling-e5": {
    chatTemplates: [{ title: "TV handling quote", content: "TVs under 40 inch fly free on E5; 40–60 inch is EGP 2,000 plus airport handling fees; over 60 inch isn't accepted." }],
    emailTemplates: [{ title: "Bringing a TV on your E5 flight", subject: "Bringing a TV on your E5 flight", body: "Dear passenger,\n\nTVs under 40 inches travel free of charge on E5. TVs between 40–60 inches are EGP 2,000 per TV plus airport handling fees. The maximum accepted size is 60 inches.\n\nAir Arabia Customer Support" }],
  },
  "e5-cargo-trade-contacts-e5": {
    chatTemplates: [{ title: "E5 cargo & trade contacts", content: "For E5 cargo: 002-0114 708 8814. For travel agency support: 002-03 419 7635 or 002-011 299 152 99." }],
    emailTemplates: [{ title: "E5 cargo & trade contacts", subject: "E5 cargo & trade contacts", body: "Dear customer,\n\nFor cargo inquiries in Egypt: 002-0114 708 8814. For travel agency support: 002-03 419 7635 or 002-011 299 152 99.\n\nAir Arabia Customer Support" }],
  },
  "3o-name-correction-request-decision-flow-3o": {
    chatTemplates: [{ title: "Name correction — spelling fix", content: "This is a straightforward free spelling correction — I'll submit the fix now and you'll receive the updated itinerary by email within 1–2 hours." }],
    emailTemplates: [{ title: "Name correction submitted", subject: "Name correction submitted", body: "Dear passenger,\n\nWe've submitted your name correction request. You'll receive your updated itinerary by email within 1–2 hours. If your case requires supporting documents (e.g. marriage certificate or ID proof), please reply to this email with those attached so we can complete the review.\n\nAir Arabia Customer Support" }],
  },
};

async function attachTemplatesToExisting() {
  for (const [slug, spec] of Object.entries(EXISTING_TEMPLATES)) {
    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) {
      console.warn(`No article found for slug: ${slug}`);
      continue;
    }

    const [chatCount, emailCount] = await Promise.all([
      prisma.chatTemplate.count({ where: { articleId: article.id } }),
      prisma.emailTemplate.count({ where: { articleId: article.id } }),
    ]);

    if (chatCount === 0 && spec.chatTemplates?.length) {
      await prisma.article.update({
        where: { id: article.id },
        data: { chatTemplates: { create: spec.chatTemplates } },
      });
    }

    if (emailCount === 0 && spec.emailTemplates?.length) {
      await prisma.article.update({
        where: { id: article.id },
        data: { emailTemplates: { create: spec.emailTemplates } },
      });
    }

    console.log(`Templates attached: ${article.title}`);
  }
}

async function main() {
  const categoryIdByName = await ensureCategories();
  await createNewArticles(categoryIdByName);
  await attachTemplatesToExisting();
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
