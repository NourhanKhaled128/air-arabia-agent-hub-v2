import type { DecisionTreeSpec } from "./types";

export const GENERAL_TREES: DecisionTreeSpec[] = [
  {
    title: "Ticket Type — Adult, Child or Infant?",
    description: "Classify a passenger's ticket type based on their age as of the travel date.",
    topic: "General",
    sourceArticleSlug: "general-ticket-types-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "How old is the passenger as of the travel date?", options: [
        { label: "12 years or older", targetClientKey: 2 },
        { label: "2–11 years", targetClientKey: 3 },
        { label: "Under 2 years", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Book as an Adult ticket." },
      { clientKey: 3, type: "outcome", text: "Book as a Child ticket." },
      { clientKey: 4, type: "outcome", text: "Book as an Infant ticket. Note: infants get no checked baggage allowance and are not entitled to any checked-in baggage." },
    ],
  },
  {
    title: "Travel Restrictions — Children, Infants & Pregnant Women",
    description: "Which travel restriction applies, and what's required.",
    topic: "General",
    sourceArticleSlug: "general-travel-restrictions-children-infants-pregnant-women-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "Which passenger type is this about?", options: [
        { label: "Child under 12 travelling", targetClientKey: 2 },
        { label: "Infant", targetClientKey: 3 },
        { label: "Pregnant passenger", targetClientKey: 6 },
      ] },
      { clientKey: 2, type: "outcome", text: "Must be accompanied by an adult aged 16+. At 12+ the child can travel alone if both countries' immigration rules are met." },
      { clientKey: 3, type: "question", text: "How old is the infant?", options: [
        { label: "1–2 days", targetClientKey: 4 },
        { label: "3–6 days", targetClientKey: 5 },
        { label: "7+ days", targetClientKey: 5 },
      ] },
      { clientKey: 4, type: "outcome", text: "Not allowed to travel." },
      { clientKey: 5, type: "outcome", text: "3–6 days: allowed only with a Fit to Fly certificate. 7+ days: allowed to travel, no certificate required." },
      { clientKey: 6, type: "question", text: "How many weeks pregnant, and single or multiple pregnancy?", options: [
        { label: "Up to 28 weeks", targetClientKey: 7 },
        { label: "29+ weeks", targetClientKey: 8 },
      ] },
      { clientKey: 7, type: "outcome", text: "A disclaimer form must be filled at check-in." },
      { clientKey: 8, type: "outcome", text: "Must provide a Fit to Fly certificate. Single pregnancy: travel allowed until end of week 35. Multiple pregnancy: allowed until end of week 32." },
    ],
  },
  {
    title: "Is this Fit to Fly Certificate Valid?",
    description: "Checklist for accepting a Fit to Fly medical certificate.",
    topic: "General",
    sourceArticleSlug: "general-fit-to-fly-certificate-requirements-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "Is it signed and stamped by a doctor or hospital?", options: [
        { label: "Yes", targetClientKey: 2 },
        { label: "No", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "question", text: "Is it dated within 14 days of the flight?", options: [
        { label: "Yes", targetClientKey: 3 },
        { label: "No", targetClientKey: 5 },
      ] },
      { clientKey: 3, type: "question", text: "Is this for a pregnant passenger?", options: [
        { label: "Yes — does it state the number of weeks?", targetClientKey: 4 },
        { label: "No, this is for an infant", targetClientKey: 6 },
      ] },
      { clientKey: 4, type: "outcome", text: "If it states the number of weeks: valid, accept it. If not: not valid — ask for it to be reissued with that detail." },
      { clientKey: 5, type: "outcome", text: "Not valid. A self-declaration, non-medical form, or a certificate older than 14 days cannot be accepted — ask for an updated certificate." },
      { clientKey: 6, type: "outcome", text: "Valid — accept the certificate." },
    ],
  },
  {
    title: "Hand Carry or Checked Baggage — What's the Allowance?",
    description: "Standard allowance and what happens over the limit.",
    topic: "General",
    sourceArticleSlug: "general-hand-carry-checked-in-baggage-allowance-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "Is the question about hand carry or checked baggage?", options: [
        { label: "Hand carry", targetClientKey: 2 },
        { label: "Checked baggage", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "7kg + a 3kg personal item (100ml max liquids). Infants: one small bag up to 3kg. Over the limit: redistribute into checked baggage or pay excess at the airport." },
      { clientKey: 3, type: "question", text: "Is any single piece over 32kg, or is this an additional piece?", options: [
        { label: "Over 32kg in one piece", targetClientKey: 4 },
        { label: "Additional piece beyond the allowance", targetClientKey: 5 },
      ] },
      { clientKey: 4, type: "outcome", text: "Excess weight is charged per kilo at the airport, plus an airport handling fee. Suggest redistributing into a second piece instead." },
      { clientKey: 5, type: "outcome", text: "Any additional piece beyond the allowance is charged at the airport. Infants get no checked baggage allowance at all." },
    ],
  },
  {
    title: "Is This Item Restricted in Checked Baggage?",
    description: "Quick check against the banned/restricted items list.",
    topic: "General",
    sourceArticleSlug: "general-restricted-items-in-checked-in-baggage-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "What category does the item fall into?", options: [
        { label: "Gas, flammable liquid/solid, or poisonous substance", targetClientKey: 2 },
        { label: "Firearms, explosives, or radioactive/oxidizing material", targetClientKey: 2 },
        { label: "Corrosive (e.g. wet-cell battery), cooking oil, matches or lighters", targetClientKey: 2 },
        { label: "None of the above", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "Restricted — cannot be accepted in checked baggage. Passenger must leave it behind or arrange alternative transport." },
      { clientKey: 3, type: "outcome", text: "Not on the restricted list — proceed as normal. If still unsure, check the full FAQ on airarabia.com." },
    ],
  },
  {
    title: "Special Baggage Items — Olive Oil, Zamzam Water, Stroller",
    description: "Rules for the three most commonly asked special checked-baggage items.",
    topic: "General",
    sourceArticleSlug: "general-special-checked-in-baggage-items-olive-oil-zamzam-water-baby-stroller",
    nodes: [
      { clientKey: 1, type: "question", text: "Which item is this about?", options: [
        { label: "Olive oil (G9)", targetClientKey: 2 },
        { label: "Zamzam water (E5, 9P, G9)", targetClientKey: 3 },
        { label: "Baby stroller", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Allowed only in a steel container placed inside a wrapped wooden box." },
      { clientKey: 3, type: "outcome", text: "One 5-litre bottle free per passenger, purchased from an authorized airport shop. No additional bottles permitted, and only for passengers travelling from KSA." },
      { clientKey: 4, type: "outcome", text: "If checked at the counter, it counts toward the baggage allowance. If used up to the boarding gate instead, it's free of the allowance and returned with checked baggage on arrival." },
    ],
  },
  {
    title: "Seating — Front Row or Exit Row Request",
    description: "Front-row benefits and exit-row eligibility.",
    topic: "General",
    sourceArticleSlug: "general-seating-front-row-benefits-exit-seat-rules-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "What kind of seat is the passenger requesting?", options: [
        { label: "Front row (e.g. for a bassinet)", targetClientKey: 2 },
        { label: "Exit row", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "More legroom; front row is the only row eligible for a baby bassinet, subject to availability." },
      { clientKey: 3, type: "question", text: "Does the passenger meet all of: over 16, not pregnant, full visual/auditory capability, good physical & mental health, able to move quickly, not in custody/deportee, willing to assist in an emergency?", options: [
        { label: "Yes, meets all conditions", targetClientKey: 4 },
        { label: "No, fails at least one condition", targetClientKey: 5 },
      ] },
      { clientKey: 4, type: "outcome", text: "Eligible — proceed with the exit row seat assignment." },
      { clientKey: 5, type: "outcome", text: "Not eligible for an exit row seat. Offer an alternative seat with extra space instead." },
    ],
  },
  {
    title: "Travel Insurance — Gold or Platinum?",
    description: "Coverage comparison and policy rules for Tune Protect insurance.",
    topic: "General",
    sourceArticleSlug: "general-travel-insurance-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "What's the passenger asking about?", options: [
        { label: "What's covered under Gold vs Platinum", targetClientKey: 2 },
        { label: "Coverage dates / changing the return date", targetClientKey: 3 },
        { label: "Trip length over 90 days", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Both plans: Accidental Death & Disablement (USD 20,000), medical reimbursement (up to USD 50,000), hospital allowance, 24/7 emergency assistance. Platinum only: lost documents/money, travel delay, missed departure, cancellation, baggage delay/loss, home protection, mugging." },
      { clientKey: 3, type: "outcome", text: "Coverage runs from departure to return date, max 90 days. Changing the return date does NOT automatically update the insurance — the passenger must contact Tune Protect directly." },
      { clientKey: 4, type: "outcome", text: "Coverage is capped at 90 days from the first departure date — for a longer trip, coverage ends on day 91, leaving the remainder uninsured." },
    ],
  },
  {
    title: "Wheelchair Assistance Request",
    description: "How wheelchair assistance is arranged and charged.",
    topic: "General",
    sourceArticleSlug: "general-wheelchair-assistance-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "What's the passenger asking?", options: [
        { label: "Can they bring their own wheelchair?", targetClientKey: 2 },
        { label: "Is it free / how do they arrange it?", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "No — personal wheelchairs cannot be used within the airport. Assistance is provided by the airport's own service provider." },
      { clientKey: 3, type: "outcome", text: "Charges depend on the passenger's situation, assessed at check-in by the airport service provider. Recommend requesting it as early as possible via the airport, not Air Arabia directly." },
    ],
  },
  {
    title: "Ancillary Cut-off Time Check",
    description: "Can this ancillary still be added given time to departure?",
    topic: "General",
    sourceArticleSlug: "general-ancillary-cut-off-times-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "Which hub is this booking on?", options: [
        { label: "G9 or 9P", targetClientKey: 2 },
        { label: "3O", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "G9 / 9P cut-offs: Seat 12h, Meal 12h, Baggage 12h, Wheelchair any time, Airport Services 24h (SHJ only, G9). Insurance depends on availability." },
      { clientKey: 3, type: "outcome", text: "3O cut-offs: Seat 12h, Meal 48h, Baggage 4h, Wheelchair 24h prior. Insurance depends on availability." },
    ],
  },
  {
    title: "Check-in Counter Timing Check",
    description: "When do check-in counters open and close for this sector?",
    topic: "General",
    sourceArticleSlug: "general-check-in-timings-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a 9P Domestic sector?", options: [
        { label: "Yes, 9P Domestic", targetClientKey: 2 },
        { label: "No, any other sector", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "Counters open 2 hours and close 45 minutes prior to departure." },
      { clientKey: 3, type: "outcome", text: "Standard counters open 3 hours and close 1 hour prior to departure." },
    ],
  },
  {
    title: "Online Check-in Issue",
    description: "Why online check-in isn't working as expected.",
    topic: "General",
    sourceArticleSlug: "general-online-check-in-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "What's happening?", options: [
        { label: "Checked in but no boarding pass received", targetClientKey: 2 },
        { label: "Can't check in — too early", targetClientKey: 3 },
        { label: "Can't check in — too late / already closed", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "The destination airport doesn't accept online boarding passes — direct the passenger to the check-in counter to collect a physical one using the booking reference." },
      { clientKey: 3, type: "outcome", text: "Online check-in opens 48 hours prior to departure — advise trying again once within that window." },
      { clientKey: 4, type: "outcome", text: "Online check-in closes 3 hours prior to departure — direct the passenger to the airport check-in counter instead." },
    ],
  },
  {
    title: "No-Show Airport Tax — Credit or Refund?",
    description: "How missed-flight airport tax credit works per hub.",
    topic: "General",
    sourceArticleSlug: "general-no-show-airport-taxes-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "Which hub, and what does the passenger want?", options: [
        { label: "G9, E5 or 9P", targetClientKey: 2 },
        { label: "3O", targetClientKey: 3 },
        { label: "Passenger insists on a cash refund instead of credit", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Airport taxes are automatically credited, kept under the passenger's name, valid up to 1 year from the date of payment. Check status via Accel Aero." },
      { clientKey: 3, type: "outcome", text: "3O does not auto-initiate the credit — only process it if the passenger explicitly requests it." },
      { clientKey: 4, type: "outcome", text: "A refund instead of credit can only be processed if the passenger insists — proceed with the refund request." },
    ],
  },
  {
    title: "Flight Delay/Cancellation — What's the Passenger Entitled To?",
    description: "Rebooking, free cancellation and refund eligibility by disruption type.",
    topic: "General",
    sourceArticleSlug: "general-flight-rescheduling-flexibility-rules-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "What kind of disruption is this?", options: [
        { label: "Delay/advance under 2 hours", targetClientKey: 2 },
        { label: "Delay/advance 2–4 hours", targetClientKey: 3 },
        { label: "Delay/advance over 4 hours", targetClientKey: 4 },
        { label: "Cancellation — commercial/operational", targetClientKey: 4 },
        { label: "Cancellation — force majeure (weather, airspace closure)", targetClientKey: 5 },
        { label: "Passenger wants to rebook — how far can they shift the date?", targetClientKey: 6 },
      ] },
      { clientKey: 2, type: "outcome", text: "No free rebooking, cancellation, or refund." },
      { clientKey: 3, type: "outcome", text: "Free rebooking and free cancellation. No free refund (except 9P Domestic)." },
      { clientKey: 4, type: "outcome", text: "Free rebooking, free cancellation, and free refund." },
      { clientKey: 5, type: "outcome", text: "Free rebooking and free cancellation. No free refund (except 9P Domestic)." },
      { clientKey: 6, type: "outcome", text: "Rebooking is free within ±7 days of the original date. Beyond 7 days, the passenger pays only the fare difference." },
    ],
  },
  {
    title: "CAI (Cairo) Flight — Which Fare's Rules Apply?",
    description: "Cairo-specific bundle rules — the only route with Business Class.",
    topic: "General",
    sourceArticleSlug: "general-cai-cairo-flights-business-class-basic-ultimate-economy-all-hubs",
    nodes: [
      { clientKey: 1, type: "question", text: "Which fare is the passenger on?", options: [
        { label: "Economy Basic", targetClientKey: 2 },
        { label: "Economy Ultimate", targetClientKey: 3 },
        { label: "Business Class", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Modification/cancellation needs 24h notice. Modification: AED 200/passenger/sector + fare difference. Cancellation: AED 200/passenger/sector, remainder refunded to original payment method." },
      { clientKey: 3, type: "outcome", text: "Modification/cancellation needs 8h notice. 2 free modifications (fare difference only). Cancellation: AED 200/passenger/sector, remainder refunded." },
      { clientKey: 4, type: "outcome", text: "Modification/cancellation needs 8h notice. Free modifications (fare difference only). Cancellation: AED 200/passenger/sector, remainder refunded. Front-row seats reserved for Business; middle seat always blocked." },
    ],
  },
];
