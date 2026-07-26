import type { DecisionTreeSpec } from "./types";

export const NINE_P_TREES: DecisionTreeSpec[] = [
  {
    title: "9P Bundle Fares — Domestic or International?",
    description: "Compare Basic, Value and Ultimate on 9P (Fly Jinnah).",
    topic: "9P",
    sourceArticleSlug: "9p-bundle-fares-9p-domestic-international",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a domestic (PKR) or international (AED) sector, and which bundle?", options: [
        { label: "Domestic — Basic", targetClientKey: 2 },
        { label: "Domestic — Value or Ultimate", targetClientKey: 3 },
        { label: "International — Basic", targetClientKey: 4 },
        { label: "International — Value or Ultimate", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "outcome", text: "Domestic Basic: baggage/seat/meal charged separately. Modification PKR 4,500 (24h); cancellation credit PKR 5,500, refund not allowed." },
      { clientKey: 3, type: "outcome", text: "Domestic Value: 23kg baggage, free seat row 8+, 1 free modification (12h). Ultimate: 46kg, any seat row 2+, hot meal, 2 free modifications (8h), included priority check-in." },
      { clientKey: 4, type: "outcome", text: "International Basic: baggage/seat/meal charged separately. Modification AED 200 (24h); cancellation credit AED 200, refund not allowed." },
      { clientKey: 5, type: "outcome", text: "International Value: 20/30kg baggage, free seat row 8+, 1 free modification (24h). Ultimate: 40kg, any seat row 2+, hot meal, 2 free modifications (8h), included priority check-in." },
    ],
  },
  {
    title: "9P Excess Baggage — Which Sector?",
    description: "First branch point for quoting a 9P excess baggage rate.",
    topic: "9P",
    sourceArticleSlug: "9p-excess-baggage-rates-9p",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this domestic, international departing Pakistan, or international arriving Pakistan?", options: [
        { label: "Domestic", targetClientKey: 2 },
        { label: "International departing Pakistan", targetClientKey: 3 },
        { label: "International arriving Pakistan", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "PKR 200/kg excess, PKR 3,800 first piece (23kg), oversize (max 305cm) PKR 3,000, carton box PKR 3,000." },
      { clientKey: 3, type: "outcome", text: "PKR 2,000/kg excess, PKR 6,000 first piece, oversize PKR 3,800, carton box PKR 3,800." },
      { clientKey: 4, type: "question", text: "Direct flight or connecting?", options: [
        { label: "Direct", targetClientKey: 5 },
        { label: "Connecting", targetClientKey: 6 },
      ] },
      { clientKey: 5, type: "outcome", text: "AED 60/kg excess, AED 100 first piece (23kg), oversize AED 100, carton box not accepted (N/A)." },
      { clientKey: 6, type: "outcome", text: "AED 70/kg excess, AED 100 first piece, oversize AED 100, carton box not accepted (N/A)." },
    ],
  },
  {
    title: "9P TV Handling — Domestic or International, What Size?",
    description: "Fee band by screen size and sector on 9P.",
    topic: "9P",
    sourceArticleSlug: "9p-tv-handling-9p",
    nodes: [
      { clientKey: 1, type: "question", text: "What's the TV's screen size, and is the sector domestic or international?", options: [
        { label: "Under 40 inch (any sector)", targetClientKey: 2 },
        { label: "40–60 inch, domestic", targetClientKey: 3 },
        { label: "40–60 inch, international", targetClientKey: 4 },
        { label: "Over 60 inch (any sector)", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "outcome", text: "No additional charge, counted as 1 baggage piece." },
      { clientKey: 3, type: "outcome", text: "PKR 2,500 + airport handling fee." },
      { clientKey: 4, type: "outcome", text: "AED 150 + airport handling fee." },
      { clientKey: 5, type: "outcome", text: "Not allowed — cannot be checked in." },
    ],
  },
  {
    title: "9P Name Change — How Is It Being Paid?",
    description: "Route the name change request by payment method.",
    topic: "9P",
    sourceArticleSlug: "9p-name-change-9p",
    nodes: [
      { clientKey: 1, type: "question", text: "How is the passenger paying, and domestic or international?", options: [
        { label: "Credit card or cash", targetClientKey: 2 },
        { label: "Previous credit voucher (immediate family only)", targetClientKey: 3 },
        { label: "Spelling correction only", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "PKR 3,500 (domestic) or AED 350 (international) per passenger + fare difference. 24h notice before first sector's departure." },
      { clientKey: 3, type: "outcome", text: "Same fees, 24h notice. Raise a Sprinklr case, ask for proof of relationship — reply comes by email." },
      { clientKey: 4, type: "outcome", text: "Free of charge. Send directly to a supervisor with supporting documents." },
    ],
  },
  {
    title: "9P Ok to Board — Is It Required?",
    description: "When OTB is mandatory and the charge difference by office.",
    topic: "9P",
    sourceArticleSlug: "9p-ok-to-board-otb-9p",
    nodes: [
      { clientKey: 1, type: "question", text: "Is the passenger travelling to the UAE from India, Pakistan or Bangladesh on a UAE visa?", options: [
        { label: "Yes, updating at a Pakistan office", targetClientKey: 2 },
        { label: "Yes, updating at a UAE office", targetClientKey: 3 },
        { label: "No — different origin country", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Free of charge at Pakistan offices. Visit 24h+ before departure with visa copy, passport, PNR." },
      { clientKey: 3, type: "outcome", text: "AED 15–20 per passenger at UAE offices. Same 24h+ notice and documents required." },
      { clientKey: 4, type: "outcome", text: "OTB doesn't apply — advise checking with the relevant immigration authority/consulate/embassy." },
    ],
  },
  {
    title: "9P Military Voucher — APW or TAC?",
    description: "Routing and rules for military travel vouchers.",
    topic: "9P",
    sourceArticleSlug: "9p-apwtac-military-vouchers-9p",
    nodes: [
      { clientKey: 1, type: "question", text: "What does the passenger need to do?", options: [
        { label: "New booking with APW or TAC voucher", targetClientKey: 2 },
        { label: "Modify/cancel/ancillary edit on an existing APW/TAC booking", targetClientKey: 3 },
        { label: "Request a name change on an APW/TAC ticket", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Must be done at a Fly Jinnah office — can't be booked over the phone. APW requires Value Flex/Ultimate bundle; TAC can use any bundle. Voucher valid 30 days from issuance." },
      { clientKey: 3, type: "outcome", text: "Can be assisted from the Call Center following regular bundle T&C, or via website/app/office." },
      { clientKey: 4, type: "outcome", text: "Not allowed — name changes are not permitted on either APW or TAC ticketing." },
    ],
  },
  {
    title: "Transport of a Deceased Passenger — Are the Documents Ready?",
    description: "Required documents and reporting time for 9P.",
    topic: "9P",
    sourceArticleSlug: "9p-transport-of-dead-body-9p",
    nodes: [
      { clientKey: 1, type: "question", text: "Does the family have all of: attested death certificate + CNIC copy, coffin box certificate, police NOC, deceased's CNIC copy, and an attendant with a confirmed ticket?", options: [
        { label: "Yes, all documents ready", targetClientKey: 2 },
        { label: "No, still missing some documents", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "Proceed. Charge: PKR 20,000 + applicable airport handling fees. Reporting time: 1 hour before departure, at cargo (not the passenger counter)." },
      { clientKey: 3, type: "outcome", text: "List what's missing: government-hospital-attested death certificate + CNIC copy, coffin box certificate from a certified provider, police station NOC, deceased's CNIC copy, one attendant with a confirmed ticket. For urgent help: +92 300 8214381 (24/7)." },
    ],
  },
];
