import type { DecisionTreeSpec } from "./types";

export const THREE_O_TREES: DecisionTreeSpec[] = [
  {
    title: "3O Bundle Fares — Domestic or International?",
    description: "Compare Basic, Value and Ultimate on 3O.",
    topic: "3O",
    sourceArticleSlug: "3o-bundle-fares-3o-domestic-international",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a domestic or international sector, and which bundle?", options: [
        { label: "International — Basic", targetClientKey: 2 },
        { label: "International — Value or Ultimate", targetClientKey: 3 },
        { label: "Domestic — Basic", targetClientKey: 4 },
        { label: "Domestic — Value or Ultimate", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "outcome", text: "International Basic: baggage/seat/meal charged separately. Modification fee €40 (72h); cancellation credit €50, refund not allowed." },
      { clientKey: 3, type: "outcome", text: "International Value: 15/20kg baggage, free seat row 8+, sandwich, 1 free modification (24h). Ultimate: 25kg, any seat row 2+, hot meal, 2 free modifications (8h), included priority check-in." },
      { clientKey: 4, type: "outcome", text: "Domestic Basic: baggage/seat/meal charged separately. Modification fee MAD 200 (72h); cancellation credit MAD 200, refund not allowed." },
      { clientKey: 5, type: "outcome", text: "Domestic Value: 15kg baggage, free seat row 8+, 1 free modification (12h). Ultimate: 25kg, any seat row 2+, sandwich, 2 free modifications (8h), included priority check-in." },
    ],
  },
  {
    title: "3O Excess Baggage — From Morocco or To Morocco?",
    description: "First branch point for quoting a 3O excess baggage rate.",
    topic: "3O",
    sourceArticleSlug: "3o-excess-baggage-rates-3o",
    nodes: [
      { clientKey: 1, type: "question", text: "Is the passenger flying from Morocco, to Morocco, or domestic within Morocco?", options: [
        { label: "From Morocco", targetClientKey: 2 },
        { label: "To Morocco", targetClientKey: 3 },
        { label: "Domestic within Morocco", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "MAD 120/kg to most of Europe & Turkey, MAD 250/kg to UAE. No-baggage-fare first 20kg: MAD 750–1,200 depending on destination." },
      { clientKey: 3, type: "outcome", text: "Around 12 EUR/GBP/CHF per kg depending on origin. No restriction on number of pieces." },
      { clientKey: 4, type: "outcome", text: "MAD 50/kg. No-baggage-fare first 20kg: MAD 300 in either direction." },
    ],
  },
  {
    title: "3O TV Handling — What Size Is the TV?",
    description: "Fee band by screen size on 3O.",
    topic: "3O",
    sourceArticleSlug: "3o-tv-handling-3o",
    nodes: [
      { clientKey: 1, type: "question", text: "What's the TV's screen size?", options: [
        { label: "Under 40 inch", targetClientKey: 2 },
        { label: "40–60 inch", targetClientKey: 3 },
        { label: "Over 60 inch", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "No additional charge, no paperwork needed." },
      { clientKey: 3, type: "outcome", text: "MAD 500 + a signed indemnity form required at the airport." },
      { clientKey: 4, type: "outcome", text: "Not allowed — cannot be checked in." },
    ],
  },
  {
    title: "3O Name Change — Which Category?",
    description: "Free, fee-based, or rejected — the top-level categorization for 3O name changes.",
    topic: "3O",
    sourceArticleSlug: "3o-name-change-3o",
    nodes: [
      { clientKey: 1, type: "question", text: "What kind of name change is this?", options: [
        { label: "Spelling correction, spouse's last name, or wrong AirRewards name", targetClientKey: 2 },
        { label: "Wrong first/last name, DOB & passport already correct", targetClientKey: 3 },
        { label: "Complete change to a different traveler", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Free of charge — proof required (e.g. marriage certificate for spouse's name)." },
      { clientKey: 3, type: "outcome", text: "Fee applies: MAD 400 international / MAD 200 domestic." },
      { clientKey: 4, type: "outcome", text: "Not permitted under 3O policy — the ticket is nominative." },
    ],
  },
  {
    title: "3O Cargo & Trade — Who Do I Contact?",
    description: "Routing for cargo bookings and country-specific trade support.",
    topic: "3O",
    sourceArticleSlug: "3o-cargo-trade-support-3o",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a cargo booking or trade/travel-agency support?", options: [
        { label: "Cargo booking to/from Morocco", targetClientKey: 2 },
        { label: "Trade support — UAE general line", targetClientKey: 3 },
        { label: "Trade support — specific European country", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "+212 666 28 49 02, or maccargobooking@airarabia.com / arihani@airarabia.com." },
      { clientKey: 3, type: "outcome", text: "trade@airarabia.com or 600 50 8002, 9am–10pm." },
      { clientKey: 4, type: "outcome", text: "Use the country-specific email, e.g. macsalessupport-Spain@airarabia.com, macsalessupport-France@airarabia.com, macsalessupport-Germany@airarabia.com, macsalessupport-UK@airarabia.com, info@airarabiaturkey.com — see the full list in Cargo & Trade Support – 3O." },
    ],
  },
];
