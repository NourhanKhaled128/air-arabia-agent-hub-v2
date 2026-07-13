import { prisma } from "../lib/prisma";
import { buildArticleSectionsCreateData } from "../lib/article-service";

const AUTHOR = "Nourhan Khaled";
const TRAINING_CATEGORY_ID = 9;

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

interface ModuleSpec {
  title: string;
  description: string;
  overview: string;
  procedures?: { title?: string; content: string }[];
  scenarios?: { situation: string; response: string }[];
  notes?: { type?: string; content: string }[];
  keywords?: string[];
}

// ---------------------------------------------------------------------------
// A new agent's first days on the phones, told as one connected flow.
// Facts are drawn from the site's existing knowledge base (scripts/seed-kb-
// content.ts and scripts/kb-templates/*.ts) — condensed and reframed for
// onboarding, not invented. Each module opens with a short in-story beat and
// closes with a line that hands off to the next module's topic.
// ---------------------------------------------------------------------------

const MODULES: ModuleSpec[] = [
  {
    title: "Module 1: Getting Started — Caller Verification & Contact Center Systems",
    description:
      "Your first day on the phones: how to verify who you're talking to, and the four systems you'll use on every call.",
    overview:
      "Your headset connects, the queue light turns green, and the first call of your first shift comes in. Before you touch a booking or share a single detail, there's one thing every call starts with: knowing who you're actually talking to.\n\nYou'll lean on four systems today and every day after: Accel Aero for search, ticketing, modification and cancellation; Sprinklr to log and manage customer cases; Caesar to confirm flight-schedule changes; and Teams to escalate anything urgent to the right team the same day. Get comfortable with all four — they cover different jobs and you'll move between them constantly.\n\nOnce you can verify a caller and know where to look things up, you're ready for the next call: figuring out exactly who's flying.",
    procedures: [
      {
        title: "The 3-question verification",
        content:
          "Before sharing any booking detail or making any change to a paid PNR, collect the PNR and get all three answered correctly: (1) the passenger's full name, (2) the flight destination and date, (3) one contact detail on the booking — mobile number or email. All three must check out before you go further.",
      },
      {
        title: "When you can skip verification",
        content:
          "A general flight-status question — just departure/arrival timing, no booking change — doesn't need a PNR or verification, since the caller might not even be the passenger (someone picking them up, for example).",
      },
      { title: "Accel Aero", content: "Your booking system — flight search, ticketing, modification and cancellation all happen here." },
      {
        title: "Sprinklr",
        content:
          "Where you log in via SSO (airarabia.sprinklr.com) to receive calls and manage customer cases — name changes, special discounts, holiday requests, payment issues, complaints.",
      },
      {
        title: "Caesar",
        content:
          "Used to confirm whether a flight time change is planned or unplanned. Each hub has its own link (G9, 3L, 3O, E5, 9P); if Caesar hasn't been updated yet, check with the Duty Supervisor rather than guessing.",
      },
      { title: "Teams", content: "Internal escalation channel for anything urgent or same-day that needs another team's attention." },
    ],
    scenarios: [
      {
        situation: "A caller wants to change the flight date on a paid PNR but only gets 2 of the 3 verification questions right.",
        response: "Don't proceed. All three have to be correct before you touch a paid PNR — explain politely that you can't make changes without full verification.",
      },
      {
        situation: "Someone calls just to ask if a flight has landed, no PNR in hand.",
        response: "No verification needed — it's a general status question, and the caller may not even be the passenger.",
      },
    ],
    notes: [{ type: "Warning", content: "Never shortcut verification on a paid PNR, no matter how legitimate or urgent the caller sounds." }],
    keywords: ["verification", "caller id", "accel aero", "sprinklr", "caesar", "teams", "systems"],
  },
  {
    title: "Module 2: Who's Flying — Ticket Types, Travel Restrictions & Fit to Fly",
    description:
      "How to classify passengers correctly by age, and what documentation unaccompanied minors, infants and pregnant passengers need to fly.",
    overview:
      "Verification's second nature now — so let's get into the first thing every booking call needs: who, exactly, is travelling?\n\nAge is everything for ticket type, and it's fixed on the day of travel, not the day of booking. 12 and up is Adult, 2–11 is Child, under 2 is Infant — a child who turns 12 the week after their flight still flies on the Child fare, because what matters is their age on the travel date.\n\nSome passengers need more than a ticket type, though — a document too. That's next.",
    procedures: [
      { title: "Classifying passengers", content: "Age as of the travel date decides the fare: 12+ Adult, 2–11 Child, under 2 Infant." },
      {
        title: "Unaccompanied minors",
        content: "Children under 12 must travel with an adult aged 16 or older. From 12 onward they can fly unaccompanied, provided they meet both countries' immigration rules.",
      },
      {
        title: "Infants & Fit to Fly",
        content: "Infants must be at least 3 days old to fly. Aged 3–6 days, a Fit to Fly certificate is required; 7 days and older, no certificate is needed.",
      },
      {
        title: "Pregnant passengers",
        content:
          "A disclaimer form is needed up to week 28. From week 29 onward, a Fit to Fly certificate is required, stating the number of weeks. Travel is allowed up to week 35 for a single pregnancy, week 32 for multiples.",
      },
      {
        title: "What makes a Fit to Fly certificate valid",
        content:
          "It must confirm fitness to fly, be signed and stamped by a doctor or hospital (a self-declaration doesn't count), and be dated within 14 days of the flight. For pregnancy, it must also state the number of weeks.",
      },
    ],
    scenarios: [
      {
        situation: "A passenger's child turns 12 the week after their flight — do they book Adult or Child?",
        response: "Child. Age is fixed as of the travel date, not the booking date or any birthday in between.",
      },
      {
        situation: "A passenger presents a Fit to Fly certificate issued 20 days ago.",
        response: "Not valid — certificates are only accepted within 14 days of issuance. Ask for an updated one.",
      },
      {
        situation: "A passenger is 30 weeks pregnant with twins.",
        response: "Travel is allowed up to week 32 for a multiple pregnancy, and she'll need a Fit to Fly certificate (required from week 29 onward) stating the number of weeks.",
      },
    ],
    notes: [{ type: "Information", content: "A Fit to Fly certificate without a doctor/hospital signature and stamp isn't valid, no matter how detailed the self-declaration is." }],
    keywords: ["ticket type", "fit to fly", "unaccompanied minor", "pregnancy", "infant"],
  },
  {
    title: "Module 3: Booking Basics — Payment Channels & Credit Vouchers",
    description:
      "The payment channels available by country, the charges you must disclose, and how to apply an existing credit voucher to a new booking.",
    overview:
      "Now that you know who's flying, let's get them paid for. Payment channels differ by market — Installments, Book Now Pay Later, or a local method like Mada, KNET, UPI or iDeal depending on where the passenger's based — and every one of them carries a small, mandatory-to-disclose charge.\n\nSometimes the passenger isn't paying fresh — they're using credit from a previous booking. That's a name-matching exercise as much as a payment one.\n\nNext: what happens when the booking itself needs to change.",
    procedures: [
      {
        title: "Payment channels",
        content:
          "Installments (UAE, KSA, Egypt — select routes); Book Now Pay Later (cash at offices, travel agents, airports, partner banks, exchange houses, retail chains, post offices); market-specific options — Mada (KSA), KNET (Kuwait), RuPay/UPI (India), iDeal (Netherlands), Bancontact (Belgium), Sofort (Germany), Internet/Mobile Banking (Morocco, India).",
      },
      {
        title: "Disclosing the charge",
        content:
          "It's mandatory to tell the passenger the charge for paying a call-center booking through these channels before they proceed — e.g. AED 10/booking in the UAE, KWD 5/passenger in Kuwait, EGP 250 or 500/passenger in Egypt depending on direction (Fawry currently suspended).",
      },
      {
        title: "Applying credit to a new booking",
        content:
          "Credit shows per passenger under \"Balance\" on the original PNR and only works for the same passenger — spelling must match exactly. Create a new PNR (or load the original passenger details to guarantee the match), select Credit at payment, enter the PNR holding the credit, search, and confirm once the amount displays.",
      },
      {
        title: "Partial credit",
        content:
          "If the credit doesn't cover the full fare, send a payment link for the remaining balance — the booking shows as forced (CNF forced), and if that link isn't paid, cancellation charges apply. Make sure the passenger understands this before you hang up.",
      },
    ],
    scenarios: [
      {
        situation: "A passenger wants to apply their credit but spelled their name slightly differently on the new booking.",
        response: "Credit only matches the exact spelling from the original PNR — fix the spelling on the new booking before applying it.",
      },
      {
        situation: "A passenger's credit covers 70% of a new fare.",
        response: "Apply the credit, then send a payment link for the rest, and make clear the booking is forced until that link is paid — otherwise cancellation charges apply.",
      },
    ],
    notes: [{ type: "Warning", content: "Credit is valid for 1 year from the date of payment, for the same passenger only." }],
    keywords: ["payment", "credit", "voucher", "installments", "book now pay later"],
  },
  {
    title: "Module 4: Passenger Eligibility & Visa Applications",
    description: "Where to send visa questions, and how to recognize and handle a visa-change (VFR) booking request.",
    overview:
      "Every so often a routine booking call turns out to be something else — a same-day return that's actually a visa run. Here's how to spot it and what to do next.\n\nAir Arabia doesn't process visa applications. For a UAE visa, any Air Arabia office can help; for anywhere else, the passenger needs the relevant consulate or embassy.\n\nWith bookings sorted and eligibility covered, the next thing every agent needs is what happens when plans change.",
    procedures: [
      {
        title: "Visa questions",
        content: "Direct passengers to the relevant authority — any Air Arabia office for a UAE visa, or the consulate/embassy for any other visa. Air Arabia does not process visa applications itself.",
      },
      { title: "Spotting a visa-change (VFR) request", content: "When a passenger requests a same-day return ticket, ask whether it's for a visa change." },
      {
        title: "Handling a VFR booking",
        content: "Visa-change tickets can't be booked, modified, or cancelled from the Call Center — the passenger must visit an Air Arabia office. These are marked VFR in Accel Aero.",
      },
    ],
    scenarios: [
      {
        situation: "A passenger asks for a same-day return ticket that turns out to be a visa run.",
        response: "This has to be booked as a VFR ticket at an Air Arabia office — it can't be created over the phone.",
      },
      {
        situation: "A passenger with an existing VFR booking wants to change the return date.",
        response: "Not possible from the Call Center — VFR bookings can only be modified or cancelled at an Air Arabia office.",
      },
    ],
    keywords: ["visa", "vfr", "visa change", "consulate", "embassy"],
  },
  {
    title: "Module 5: Changing Plans — Modification & Cancellation Checklists",
    description: "The step-by-step sequence to follow on every modification and cancellation call — a checklist, not a menu.",
    overview:
      "Plans change — and when they do, there's a set order to work through so nothing gets missed. This isn't a menu you pick from; it's a sequence, every time.\n\nModification has nine steps, cancellation has five. Both start the same way every call does: verification.\n\nOnce a booking is settled — modified, cancelled, or untouched — the next question is usually about what's actually in the suitcase.",
    procedures: [
      {
        title: "Modification checklist",
        content:
          "1. Verification (all 3 questions). 2. Data collection — all passengers or one? which segment? 3. First recap — read back current flight details. 4. Ancillary — do previously selected ancillaries carry forward? 5. Charges — quote balance per passenger, then total due. 6. Terms & conditions — old date cancelled, new date confirmed, payment due before the new segment can be used. 7. Final recap — confirm new flight details. 8. Payment — send the offline payment link. 9. Confirmation — ask the passenger to double-check the new dates.",
      },
      {
        title: "Cancellation checklist",
        content:
          "1. Verification (all 3 questions). 2. Data collection — all passengers or one? which segment? 3. Terms & conditions — check original payment date and method, since these affect what's owed or returned. 4. Credit details — confirm the credit amount and expiry with the passenger. 5. Confirmation — send the cancellation confirmation by email.",
      },
    ],
    scenarios: [
      {
        situation: "An agent quotes charges before checking whether ancillaries carried forward.",
        response: "Wrong order — Ancillary comes right after the first recap and before Charges, because it can change what's actually being charged.",
      },
      {
        situation: "A passenger only wants a verbal cancellation confirmation.",
        response: "Send the email confirmation anyway — it's the passenger's documented proof of the credit amount and expiry, and it's the checklist's final step regardless of what's asked.",
      },
    ],
    notes: [{ type: "Information", content: "These checklists standardize what to cover and in what order — they don't replace the fare-bundle-specific rules for what's actually free to change." }],
    keywords: ["modification", "cancellation", "checklist"],
  },
  {
    title: "Module 6: Baggage Fundamentals — Allowance, Restricted & Special Items",
    description: "Hand carry and checked baggage limits, what's not allowed in the hold, and the special-case items with their own rules.",
    overview:
      "Booking sorted, now what's coming with them? Baggage questions are some of the most common calls you'll take, and the numbers are worth knowing cold.\n\nHand carry is 7kg plus a 3kg personal item; checked baggage tops out at 32kg per piece (158cm W+L+H). A few items never make it into the hold at all, and a few others — olive oil, Zamzam water, strollers — have rules all their own.\n\nBags sorted, let's get the passenger settled onboard next.",
    procedures: [
      {
        title: "Hand carry & checked allowance",
        content:
          "7kg hand carry + 3kg personal item (max 100ml liquids). Checked baggage: up to 32kg per piece, 158cm W+L+H dimension limit. Excess weight is charged per kilo at the airport plus a handling fee; an extra piece is also charged at the airport. Infants get no checked allowance, only a 3kg hand-carry bag.",
      },
      {
        title: "Restricted items",
        content: "Flammable/poisonous/radioactive substances, firearms and explosives, corrosive materials (e.g. wet-cell batteries), cooking oils, and matches/lighters can't go in checked baggage.",
      },
      {
        title: "Special items",
        content:
          "Olive oil (G9) needs a steel container inside a wrapped wooden box — plastic bottles aren't accepted. Zamzam water: one free 5L bottle from an authorized airport shop, KSA departures only, E5/9P/G9. A stroller stays free of the allowance if used up to the boarding gate rather than checked at the counter, and comes back with checked bags on arrival.",
      },
    ],
    scenarios: [
      { situation: "A passenger's single bag weighs 35kg.", response: "Over the 32kg per-piece limit — suggest splitting into two bags, or quote the per-kilo excess charge if they'd rather keep it as one." },
      { situation: "A passenger wants to pack cooking oil in checked baggage.", response: "Not allowed, even in small quantities — it's on the restricted items list regardless of amount." },
      { situation: "A passenger wants a second bottle of Zamzam water.", response: "Only one free 5L bottle per passenger, from an authorized airport shop — a second bottle isn't permitted even on eligible routes." },
    ],
    keywords: ["baggage", "hand carry", "checked baggage", "restricted items", "zamzam", "olive oil", "stroller"],
  },
  {
    title: "Module 7: Onboard Extras — Seating, SkyTime & Insurance",
    description: "Front-row and exit-row seating rules, free onboard entertainment via SkyTime, and the two Tune Protect insurance plans.",
    overview:
      "The passenger's booked, their bags are sorted — now it's about making the flight itself comfortable. Seating has a couple of hard rules worth knowing, entertainment is free and simple, and insurance is one of those things passengers only ask about right when they need it most.\n\nGetting all this right onboard is part of the job — but so is getting them through the airport in the first place. That's next.",
    procedures: [
      { title: "Front-row seating", content: "Extra legroom, and the only row eligible for a baby bassinet request (subject to availability)." },
      { title: "Exit row seating", content: "Passenger must be over 16, not pregnant, in good health, and able to assist in an emergency if instructed by crew." },
      {
        title: "SkyTime",
        content:
          "Free onboard entertainment on the passenger's own device. After take-off, connect to the SkyTime Wi-Fi network and log in with email + seat number — movies, TV, music and games included free. Power banks and headsets are available onboard at an extra charge.",
      },
      {
        title: "Travel insurance — Gold vs Platinum",
        content:
          "Both Tune Protect plans include Accidental Death & Disablement (USD 20,000), medical reimbursement (up to USD 50,000), hospital allowance, and 24/7 emergency assistance. Platinum adds loss of documents/money, travel delay, missed departure, cancellation, baggage delay/loss, home protection and mugging cover. Coverage runs from departure to return date, maximum 90 days — changing the return date doesn't automatically update the policy.",
      },
    ],
    scenarios: [
      { situation: "A passenger with a dead phone battery wants to use SkyTime.", response: "They can rent a power bank onboard for a small extra charge, then connect once there's enough battery." },
      { situation: "A pregnant passenger requests an exit row seat.", response: "Not permitted for safety reasons — offer an alternative seat with extra space instead." },
      { situation: "A passenger on the Gold plan asks about baggage delay compensation.", response: "Not covered — baggage delay is Platinum-only. Gold still covers medical, hospital allowance and 24/7 emergency assistance." },
    ],
    keywords: ["seating", "exit row", "skytime", "insurance", "tune protect"],
  },
  {
    title: "Module 8: Airport Day — Check-in, Cut-offs, Shuttle Buses & Wheelchair",
    description: "Check-in windows, ancillary booking cut-off times, airport shuttle options, and how wheelchair assistance is arranged.",
    overview:
      "Departure day. This is where all the timing rules live — when counters open and close, how late an extra bag or a meal can still be added, and how a passenger without a car gets to the airport in the first place.\n\nMiss a cut-off and the answer changes fast, so these numbers matter. Get them right and departure day runs itself.\n\nOf course, not every departure day goes to plan — next up is what happens when it doesn't.",
    procedures: [
      {
        title: "Check-in counter timing",
        content:
          "Standard: opens 3 hours, closes 1 hour before departure. Exception — 9P Domestic: opens 2 hours, closes 45 minutes before departure. International 9P sectors use the standard 1-hour closing rule, not the domestic exception.",
      },
      {
        title: "Online check-in",
        content: "Opens 48 hours, closes 3 hours before departure. A \"check-in successful\" message with no boarding pass just means the arrival airport requires a physical one, collected at the counter.",
      },
      {
        title: "Ancillary cut-off times",
        content:
          "Vary by hub: G9/9P — seat, meal, baggage need 12 hours' notice, wheelchair any time. 3O — seat 12 hours, meal 48 hours, baggage 4 hours, wheelchair 24 hours. Airport services (Sharjah only, G9) up to 24 hours prior. Past the cut-off, suggest purchasing at the airport instead.",
      },
      {
        title: "Airport shuttle buses",
        content:
          "G9 Sharjah: free bus from City Centre Al Shindagha, or AED 30 from the Ras Al Khaimah office. G9 Ras Al Khaimah: free shuttle from Dubai/Sharjah/Ajman/Umm Al Quwain, first come first served. 3L Abu Dhabi: hourly bus from Ibn Battuta Mall, ticket purchased at the bus station, operated by Abu Dhabi Airport.",
      },
      {
        title: "Wheelchair assistance",
        content:
          "Arranged through the airport's own service provider, not Air Arabia directly — personal wheelchairs can't be used within the airport. Any charge is assessed at check-in based on the passenger's situation. Recommend requesting as early as possible.",
      },
    ],
    scenarios: [
      { situation: "A passenger wants to add baggage to a G9 flight departing in 6 hours.", response: "Past the 12-hour cut-off — recommend purchasing the excess baggage directly at the airport instead." },
      { situation: "A passenger arrives 50 minutes before a 9P Domestic flight.", response: "Still fine — the Domestic exception closes at 45 minutes — but recommend heading to the counter immediately." },
      { situation: "A passenger asks if they can guarantee a seat on the free RAK Airport shuttle.", response: "No — it's first come first served, subject to availability, no reservations." },
    ],
    keywords: ["check-in", "cut-off", "shuttle bus", "wheelchair", "airport"],
  },
  {
    title: "Module 9: When Flights Change — No-show Credit & Flight Change Entitlements",
    description: "What happens to airport taxes on a missed flight, and exactly what a passenger is entitled to when their flight is delayed, advanced, or cancelled.",
    overview:
      "Sometimes it's the passenger who misses the flight; sometimes it's the flight that changes on them. Either way, there's a clear entitlement table to work from — no guessing.\n\nA missed flight doesn't mean lost taxes: G9, E5 and 9P auto-credit them, 3O needs a request. And when Air Arabia changes the schedule, what the passenger gets depends entirely on how much notice — or lack of it — they had.\n\nSome of these disruptions ripple further than one passenger's ticket, though — cargo and group bookings have their own knock-on effects, which is where we're headed next.",
    procedures: [
      {
        title: "No-show airport tax credit",
        content: "G9, E5, 9P: credited automatically. 3O: only on request. Valid 1 year from the date of payment, kept under the passenger's name. A cash refund instead of credit is only processed if specifically requested.",
      },
      {
        title: "Flight change entitlements",
        content:
          "Delay/advance under 2 hours: no free entitlements. 2–4 hours: free rebooking and free cancellation, no refund. Over 4 hours, or a commercial/operational cancellation: free rebooking, cancellation and refund. Force majeure (weather, airspace closure): free rebooking and cancellation, no refund (except 9P Domestic).",
      },
      { title: "Passenger-initiated rebooking", content: "Free within ±7 days of the original date. Beyond that window, only the fare difference applies." },
    ],
    scenarios: [
      {
        situation: "A 3O passenger misses their flight and wants their airport taxes credited.",
        response: "3O doesn't auto-credit — since they're asking directly, raise the request. Once processed it's valid 1 year from the date of payment.",
      },
      { situation: "A flight is delayed 3 hours.", response: "Free rebooking and free cancellation apply — no free refund unless it's 9P Domestic." },
      { situation: "A passenger wants to shift their travel date by 10 days.", response: "Beyond the free ±7-day window — they'll pay the fare difference to rebook." },
    ],
    keywords: ["no-show", "airport tax", "flight change", "rebooking", "disruption"],
  },
  {
    title: "Module 10: Cargo, Trade & Group Bookings",
    description: "Where to send cargo and trade inquiries, and the rules around group bookings — both are handled outside the standard Call Center flow.",
    overview:
      "Two more things route away from the normal call flow entirely: cargo shipments and large groups. Know where to send them and what you can (and can't) touch yourself.\n\nFor Sharjah cargo, there's a dedicated 24/7 export and import counter — you're a signpost here, not the handler. Groups are similar: past a certain size, the Call Center hands off to a dedicated team and stays hands-off on the booking itself once it's confirmed.\n\nWith the operational side covered, let's talk about what keeps passengers coming back: AirRewards.",
    procedures: [
      { title: "Cargo — export (Sharjah)", content: "SAS Export Counter, 06-514-1174, staffed 24/7, for export shipment status checks at any time." },
      { title: "Cargo — import (Sharjah)", content: "SAS Import Counter, 06-514-1188 or 06-514-1189, staffed 24/7, for receiving shipments." },
      {
        title: "What counts as a group",
        content: "More than 10 passengers, and the requested flight needs more than 70 available seats in each sector. All requests go through the group booking form.",
      },
      {
        title: "Identifying a group booking",
        content: "10+ passengers; any passenger name shown as \"TBA\"; an Accel Aero note confirming it's a group; or the booking was created by \"Groups User.\"",
      },
      {
        title: "What the Call Center can't touch",
        content: "Once a group booking is confirmed, no modification, cancellation, split, ancillary change, or contact-detail change can be made from the Call Center — that all goes through the Groups team.",
      },
    ],
    scenarios: [
      {
        situation: "A caller wants an update on an export shipment from Sharjah after hours.",
        response: "The SAS Export Counter is staffed 24/7 at 06-514-1174 — they can check status any time, including outside normal hours.",
      },
      {
        situation: "A caller with a confirmed 15-passenger group booking wants one passenger's meal changed.",
        response: "Not possible from the Call Center, no matter how small the change — direct them to the Groups team.",
      },
      {
        situation: "A passenger wants to book 12 seats on a flight showing only 40 seats left in that sector.",
        response: "Doesn't qualify as a group — the sector needs more than 70 available seats. Suggest other flight options.",
      },
    ],
    keywords: ["cargo", "trade", "group booking", "sas export", "sas import"],
  },
  {
    title: "Module 11: AirRewards & Loyalty",
    description: "How AirRewards earning, redemption, family-head accounts and expiry work.",
    overview:
      "Every interaction so far has been about getting one trip right. AirRewards is about the next one — Air Arabia's loyalty programme, and one of the most common calls you'll take once passengers are frequent flyers.\n\nThe core idea is simple: 5% back as points on tickets and baggage, 10% on seat/meal/insurance/airport services, nothing on taxes. The details around family accounts and expiry are where most questions come from.\n\nEven with all this sorted, sometimes things still go wrong after the flight — that's next.",
    procedures: [
      {
        title: "Registration & eligibility",
        content: "Register online, or via the Call Center through Accel Aero (Join Air Rewards). Passengers 12+ register and earn/redeem in their own right. Ages 2–11 must be linked to an existing family head account.",
      },
      {
        title: "Family head accounts",
        content: "Up to 8 members linked to one account. The family head earns 50% of each linked passenger's points (the other 50% is forfeited); the family head account itself earns 0 points directly from its own flights.",
      },
      {
        title: "Earning points",
        content: "Future flights: add the AirRewards ID to the PNR — points credit within 24 hours after the ticket is used. Past flights: passenger claims via \"Claim points for past flight,\" within 90 days of the travel date.",
      },
      {
        title: "Redemption",
        content: "Via the passenger's account at payment. Minimum 3,000 points for fare or baggage redemption; no minimum for seat, meal, insurance or airport services. Points can't be used against airport taxes.",
      },
      { title: "Expiry", content: "Points expire 2 years from the travel date." },
    ],
    scenarios: [
      {
        situation: "A passenger asks if their 10-year-old can have their own AirRewards account.",
        response: "Not directly — ages 2–11 must be linked to an existing family head account. Only 12+ can register on their own.",
      },
      {
        situation: "A family head with linked members asks why their own account shows 0 points.",
        response: "Expected — the family head account earns 50% of each linked passenger's points, not points from its own flights directly.",
      },
      { situation: "A passenger wants to redeem 2,000 points for a seat.", response: "No minimum applies to seat/meal/insurance/airport service redemptions — only fare or baggage redemption needs the 3,000-point minimum." },
    ],
    keywords: ["airrewards", "loyalty", "points", "redemption", "family head"],
  },
  {
    title: "Module 12: Baggage Claims & Handling Complaints",
    description: "How to report damaged, lost or delayed baggage, and the core approach — plus the two most common sub-procedures — for handling a complaint.",
    overview:
      "Not every call is about what's coming up — some are about what already went wrong. These calls need a different instinct: fix the timing-sensitive stuff fast, and lead every complaint with empathy before policy.\n\nBaggage claims are location- and time-sensitive — reported at the arrival airport, at the time of arrival, full stop. Complaints are broader, but they all start the same way: listen, acknowledge, then act.\n\nOne more type of call closes the loop on everything you've learned — the ones where quality itself is the issue.",
    procedures: [
      {
        title: "Reporting baggage claims",
        content: "Damaged, lost, or delayed baggage must be reported at the arrival airport's baggage services desk, at the time of arrival — not by phone or email afterward.",
      },
      {
        title: "Complaint handling approach",
        content:
          "Listen and show empathy first, then acknowledge the inconvenience. Offer a solution, escalate to a supervisor, or raise a case, depending on the complaint type: AirRewards, Booking issues, Business Class downgrade, Call Center complaints, Flight delay & cancellation, Holiday booking complaints, Onboard services, Payment issues, Staff behavior.",
      },
      {
        title: "Payment issue sub-procedure",
        content:
          "If money was debited but the PNR isn't confirmed: ask the passenger to check again after 2 hours (payment may still be processing). Still unresolved after 2 hours: run an advanced search for a generated PNR, raise a Sprinklr payment-issues request, and extend the booking's time limit by at least 24 hours (or create one if no PNR was found).",
      },
    ],
    scenarios: [
      {
        situation: "A passenger calls two days after landing about a damaged suitcase.",
        response: "Baggage damage has to be reported at the arrival airport at the time of arrival — a report made days later, after leaving the airport, can't be handled the same way.",
      },
      {
        situation: "A passenger is upset that money was debited with no booking confirmation.",
        response: "Empathize first, ask them to check again in case payment is still processing — if still unresolved after 2 hours, run the advanced search, raise the Sprinklr request, and extend the time limit.",
      },
    ],
    notes: [{ type: "Warning", content: "Baggage claims are time- and location-sensitive — always direct the passenger to the arrival airport immediately, not after the fact." }],
    keywords: ["baggage claim", "complaints", "payment issue", "sprinklr"],
  },
  {
    title: "Module 13: Call Handling Wrap-up — Quality & Escalations",
    description: "How quality cases get raised, and the habits — verification, checklists, empathy — that separate a good call from one that ends up as a complaint.",
    overview:
      "You've made it through the full flow — from the first ring to a passenger safely on their way, or their issue properly resolved. This last module is about closing the loop on quality itself.\n\nWhen a call doesn't go right — wrong information, a wrong booking, a wrong modification, a cancellation that was requested but never completed — that's a quality case, raised under Complaints > Call Center Complaints with the correct sub-type so it reaches the right team.\n\nThe throughline across everything in this training is the same: verify first, follow the checklist in order, quote things accurately, and lead with empathy when something's gone wrong. Get those right and quality cases stay rare. Welcome to the floor — you're ready for your first real call.",
    procedures: [
      {
        title: "Raising a quality case",
        content: "Raise under Complaints > Call Center Complaints, then select the correct sub-type — wrong information given, wrong booking, wrong modification, or a cancellation that was requested but not completed.",
      },
    ],
    scenarios: [
      {
        situation: "A passenger complains that a previous agent quoted the wrong modification fee.",
        response: "This is a quality case — raise it under Complaints > Call Center Complaints with the 'wrong information' sub-type.",
      },
    ],
    notes: [{ type: "Information", content: "Quality cases map to a specific Sprinklr sub-type each — selecting the right one is what gets it to the correct team." }],
    keywords: ["quality", "escalation", "call handling", "complaints"],
  },
];

async function main() {
  const deleted = await prisma.article.deleteMany({ where: { categoryId: TRAINING_CATEGORY_ID } });
  console.log(`Deleted ${deleted.count} existing Training article(s).`);

  for (const mod of MODULES) {
    const article = await prisma.article.create({
      data: {
        title: mod.title,
        slug: `${slugify(mod.title)}-${Date.now()}`,
        categoryId: TRAINING_CATEGORY_ID,
        description: mod.description,
        overview: mod.overview,
        author: AUTHOR,
        status: "Published",
        ...buildArticleSectionsCreateData({
          procedures: mod.procedures,
          scenarios: mod.scenarios,
          notes: mod.notes,
          keywords: mod.keywords,
        }),
      },
    });
    console.log(`Created: ${mod.title} (#${article.id})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
