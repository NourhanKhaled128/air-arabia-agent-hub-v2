import type { DecisionTreeSpec } from "./types";

export const G9_3L_TREES: DecisionTreeSpec[] = [
  {
    title: "G9 Bundle Fares — Which One Fits?",
    description: "Compare Basic, Value and Ultimate on G9.",
    topic: "G9",
    sourceArticleSlug: "g9-bundle-fares-g9",
    nodes: [
      { clientKey: 1, type: "question", text: "What matters most to the passenger?", options: [
        { label: "Lowest base fare", targetClientKey: 2 },
        { label: "Some flexibility & included baggage", targetClientKey: 3 },
        { label: "Maximum flexibility & comfort", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Basic: baggage/seat/meal charged separately. Modification AED 200 (24h). Cancellation: credit voucher AED 200 (24h), refund not allowed." },
      { clientKey: 3, type: "outcome", text: "Value: checked baggage included, free seat from row 8, sandwich + water. 1 free modification (24h). Cancellation: credit AED 100 or refund AED 300 (24h)." },
      { clientKey: 4, type: "outcome", text: "Ultimate: bigger baggage, any seat from row 2, hot meal, included priority check-in. 2 free modifications (8h). Cancellation: free credit or refund AED 200 (8h)." },
    ],
  },
  {
    title: "G9 Excess Baggage — Point-to-Point or Connecting?",
    description: "First branch point for quoting a G9 excess baggage rate.",
    topic: "G9",
    sourceArticleSlug: "g9-excess-baggage-rates-g9",
    nodes: [
      { clientKey: 1, type: "question", text: "Is the passenger's baggage point-to-point (to/from UAE) or connecting through UAE?", options: [
        { label: "Point-to-point", targetClientKey: 2 },
        { label: "Connecting", targetClientKey: 3 },
        { label: "Flying to Bangladesh with a carton box", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "outcome", text: "Rate depends on destination region (roughly AED 45–105/kg) — check the point-to-point table in Excess Baggage Rates – G9 for the exact figure." },
      { clientKey: 3, type: "question", text: "Connecting to a GCC country, or to another region?", options: [
        { label: "Connecting to GCC", targetClientKey: 4 },
        { label: "Connecting to other regions", targetClientKey: 4 },
      ] },
      { clientKey: 4, type: "outcome", text: "Rate depends on region — check the connecting-to-GCC / connecting-to-others columns in Excess Baggage Rates – G9 (roughly AED 55–110/kg)." },
      { clientKey: 5, type: "outcome", text: "Not accepted — no carton boxes on G9 flights to Bangladesh, regardless of willingness to pay." },
    ],
  },
  {
    title: "G9 TV Handling — What Size Is the TV?",
    description: "Fee band by screen size on G9.",
    topic: "G9",
    sourceArticleSlug: "g9-tv-handling-g9",
    nodes: [
      { clientKey: 1, type: "question", text: "What's the TV's screen size?", options: [
        { label: "Under 40 inch", targetClientKey: 2 },
        { label: "40–60 inch", targetClientKey: 3 },
        { label: "Over 60 inch", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "No additional charge — counted as 1 baggage piece." },
      { clientKey: 3, type: "outcome", text: "AED 150 + airport handling fee, counted as 1 baggage piece." },
      { clientKey: 4, type: "outcome", text: "Not allowed — cannot be checked in." },
    ],
  },
  {
    title: "Sharjah Airport Services — Which One?",
    description: "Meet & Assist, Fast Track, Lounge and Transfer options at Sharjah.",
    topic: "G9",
    sourceArticleSlug: "g9-airport-services-sharjah-shj-airport-only",
    nodes: [
      { clientKey: 1, type: "question", text: "What is the passenger asking about?", options: [
        { label: "Departure service", targetClientKey: 2 },
        { label: "Arrival or transit service", targetClientKey: 3 },
        { label: "Business Lounge", targetClientKey: 4 },
        { label: "Airport transfer", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "outcome", text: "Meet & Assist (departure) includes Warm Welcome, Fast Track, Porter, Dedicated Check-in, Accompanied Assistance. Book up to 24h prior — Sharjah Airport only." },
      { clientKey: 3, type: "outcome", text: "Arrival: Warm Welcome, Fast Track, Porter, Meet & Assist. Transit: Warm Welcome, Fast Track, Meet & Assist (no porter)." },
      { clientKey: 4, type: "outcome", text: "Includes Wi-Fi, business centre, shower room, 24/7 food & beverage. Starting AED 145 depending on bag count." },
      { clientKey: 5, type: "outcome", text: "Standard Sedan, up to 4 passengers + 4 medium bags. Book via +971 54 3082573 (call/WhatsApp) or booking@sayararental.com." },
    ],
  },
  {
    title: "City Check-in — G9 or 3L?",
    description: "Locations and timing for City Check-in.",
    topic: "G9",
    sourceArticleSlug: "g9-city-check-in-g9-3l-only",
    nodes: [
      { clientKey: 1, type: "question", text: "Is the passenger flying G9 or 3L, and how close is departure?", options: [
        { label: "G9 — 48h to 8h before departure", targetClientKey: 2 },
        { label: "3L — 48h to 8h before departure", targetClientKey: 3 },
        { label: "Same-day flight", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "G9 locations: Sharjah, Ajman, Dubai, Ras Al Khaimah. AED 20/passenger. At least 1 passenger must attend in person with all passports; still arrive at the airport 1.5h before departure." },
      { clientKey: 3, type: "outcome", text: "3L locations: Abu Dhabi, Al Ain, Dubai Al Shindagha. Same AED 20/passenger and in-person requirements." },
      { clientKey: 4, type: "outcome", text: "Must check in before 4pm — the last bus to the airport leaves the office at 5pm." },
    ],
  },
  {
    title: "G9 Name Change — How Is It Being Paid?",
    description: "Route the name change request by payment method.",
    topic: "G9",
    sourceArticleSlug: "g9-name-change-g9",
    nodes: [
      { clientKey: 1, type: "question", text: "How is the passenger paying for the name change?", options: [
        { label: "Credit card or cash", targetClientKey: 2 },
        { label: "Previous credit voucher (immediate family only)", targetClientKey: 3 },
        { label: "Spelling correction only", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "AED 350 per passenger + fare difference. Must be done 24h prior to the first sector's departure." },
      { clientKey: 3, type: "outcome", text: "Same AED 350 + fare difference, 24h notice. Raise a Sprinklr case, ask for proof of relationship — passenger gets a reply by email." },
      { clientKey: 4, type: "outcome", text: "Free of charge. Send the request to a supervisor directly with supporting documents (e.g. marriage certificate, ID mismatch proof)." },
    ],
  },
  {
    title: "G9 Ok to Board — Is It Required?",
    description: "When OTB is mandatory and how to update it.",
    topic: "G9",
    sourceArticleSlug: "g9-ok-to-board-otb-g9",
    nodes: [
      { clientKey: 1, type: "question", text: "Is the passenger travelling to the UAE from India, Pakistan or Bangladesh on a UAE visa?", options: [
        { label: "Yes", targetClientKey: 2 },
        { label: "No — different origin country", targetClientKey: 3 },
        { label: "Yes, but departure is under 24 hours away", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "OTB is mandatory. Visit an Air Arabia office 24h+ before departure with visa copy, passport, PNR. Charge: AED 15–20/passenger." },
      { clientKey: 3, type: "outcome", text: "OTB doesn't apply — advise checking visa requirements with the relevant immigration authority/consulate/embassy." },
      { clientKey: 4, type: "outcome", text: "Advise visiting the office as soon as possible — staff will try to assist but it can't be guaranteed given the short notice." },
    ],
  },
  {
    title: "G9 Falcon Travel Request",
    description: "Booking procedure for the one pets exception on G9.",
    topic: "G9",
    sourceArticleSlug: "g9-pets-animals-falcons-g9",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a falcon booking, and how far out is departure?", options: [
        { label: "Falcon booking, 48h+ before departure", targetClientKey: 2 },
        { label: "Falcon booking, under 48h before departure", targetClientKey: 3 },
        { label: "Any other pet/animal", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Collect passenger count, falcon count, destination. Book on Basic fare, no added services, add an Accel Aero User Note. No extra baggage allowance for the falcon's seat." },
      { clientKey: 3, type: "outcome", text: "Not possible at this notice — refer to a supervisor." },
      { clientKey: 4, type: "outcome", text: "Not allowed on board — the only exception across all hubs is falcons on G9." },
    ],
  },
  {
    title: "G9 Cargo & Trade — Who Do I Contact?",
    description: "Routing for export, import and trade support inquiries.",
    topic: "G9",
    sourceArticleSlug: "g9-cargo-trade-support-g9",
    nodes: [
      { clientKey: 1, type: "question", text: "What kind of inquiry is this?", options: [
        { label: "Export (sending from Sharjah)", targetClientKey: 2 },
        { label: "Import (receiving to Sharjah)", targetClientKey: 3 },
        { label: "Travel agency / trade support", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "SAS Export Counter, 24/7: 06-514-1174." },
      { clientKey: 3, type: "outcome", text: "SAS Import Counter, 24/7: 06-514-1188 / 1189." },
      { clientKey: 4, type: "outcome", text: "trade@airarabia.com or 600 50 8002, 9am–10pm." },
    ],
  },
  {
    title: "Air Arabia Holidays — New Booking or Change?",
    description: "How to handle G9 Holidays package requests.",
    topic: "G9",
    sourceArticleSlug: "g9-air-arabia-holidays-g9",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a new booking or a change to an existing one?", options: [
        { label: "New booking", targetClientKey: 2 },
        { label: "Modify travel dates", targetClientKey: 3 },
        { label: "Cancel", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Raise a Sprinklr request with passenger count, destination, dates, contact info. The Holidays team will contact the customer directly." },
      { clientKey: 3, type: "outcome", text: "Not permitted — modification isn't available on Holiday packages." },
      { clientKey: 4, type: "outcome", text: "Needs 72h notice. Results in a credit voucher (valid 1 year, any passenger on the booking), never a cash refund." },
    ],
  },
  {
    title: "G9 Special Discount Card — Which One?",
    description: "Homat Al Watan / Fazaa / Waffer vs. Esaad eligibility and process.",
    topic: "G9",
    sourceArticleSlug: "g9-special-discounts-homat-al-watan-fazaa-waffer-esaad-g9",
    nodes: [
      { clientKey: 1, type: "question", text: "Which card, and is the departure from Abu Dhabi, RAK or Sharjah?", options: [
        { label: "Homat Al Watan / Fazaa / Waffer, eligible departure", targetClientKey: 2 },
        { label: "Esaad, eligible departure", targetClientKey: 3 },
        { label: "Departure is from elsewhere (e.g. Dubai)", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "10% off Ultimate/Business (Cairo). Valid for cardholder + spouse & children up to 18. Raise a Sprinklr case; request original ID + relationship proof; do not create an on-hold booking." },
      { clientKey: 3, type: "outcome", text: "Same 10% discount; Esaad's family definition includes spouse, parents & children with no age limit. Same Sprinklr process." },
      { clientKey: 4, type: "outcome", text: "Not eligible — valid only on departures from Abu Dhabi, RAK or Sharjah. Suggest an Air Arabia Sales Shop in the UAE for other options." },
    ],
  },
  {
    title: "Early or Home Check-in — Abu Dhabi or Sharjah?",
    description: "3L check-in service options outside the standard counter.",
    topic: "3L",
    sourceArticleSlug: "3l-early-home-check-in-abu-dhabi-sharjah-airports",
    nodes: [
      { clientKey: 1, type: "question", text: "Which airport, and does the passenger want Early or Home check-in?", options: [
        { label: "Abu Dhabi — Early Check-in", targetClientKey: 2 },
        { label: "Abu Dhabi — Home Check-in", targetClientKey: 3 },
        { label: "Sharjah — Home Check-in", targetClientKey: 4 },
        { label: "Sharjah — Early Check-in", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "outcome", text: "Cruise Terminal, YAS Mall or Mussafah, from 24h prior. AED 35 adult / AED 25 child / AED 15 infant." },
      { clientKey: 3, type: "outcome", text: "Register with MORAFIQ. Agents arrive within a 24h–5h window before the flight. Pricing from AED 185 depending on bag count." },
      { clientKey: 4, type: "outcome", text: "Book up to 6h prior via the Air Arabia or Sharjah Airport website. Pricing from AED 145 depending on bag count." },
      { clientKey: 5, type: "outcome", text: "Free of charge, from 24h prior, at Sharjah Airport only." },
    ],
  },
];
