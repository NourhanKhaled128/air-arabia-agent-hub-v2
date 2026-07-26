import type { DecisionTreeSpec } from "./types";

export const E5_TREES: DecisionTreeSpec[] = [
  {
    title: "E5 Excess Baggage — From Egypt or To Egypt?",
    description: "First branch point for quoting an E5 excess baggage rate.",
    topic: "E5",
    sourceArticleSlug: "e5-excess-baggage-rates-e5",
    nodes: [
      { clientKey: 1, type: "question", text: "Is the passenger flying from Egypt or to Egypt?", options: [
        { label: "From Egypt", targetClientKey: 2 },
        { label: "To Egypt", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "EGP 200–450/kg depending on destination (e.g. SHJ is EGP 450, the highest). No-baggage-fare first 20kg: EGP 500–600." },
      { clientKey: 3, type: "outcome", text: "Rate depends on origin — e.g. JOD 6/kg from Amman, AED 50/kg from Sharjah, SAR 60–70/kg from KSA. No-baggage-fare first 20kg: AED 50 (most origins) or EUR 23 (BGY/MRS)." },
    ],
  },
  {
    title: "E5 TV Handling — What Size Is the TV?",
    description: "Fee band by screen size on E5.",
    topic: "E5",
    sourceArticleSlug: "e5-tv-handling-e5",
    nodes: [
      { clientKey: 1, type: "question", text: "What's the TV's screen size?", options: [
        { label: "Under 40 inch", targetClientKey: 2 },
        { label: "40–60 inch", targetClientKey: 3 },
        { label: "Over 60 inch", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Free of charge." },
      { clientKey: 3, type: "outcome", text: "EGP 2,000 per TV + airport handling fees." },
      { clientKey: 4, type: "outcome", text: "Not allowed — maximum accepted size is 60 inch." },
    ],
  },
  {
    title: "E5 Cargo & Trade — Who Do I Contact?",
    description: "Routing for cargo and travel-agency support in Egypt.",
    topic: "E5",
    sourceArticleSlug: "e5-cargo-trade-contacts-e5",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a cargo inquiry or travel-agency support?", options: [
        { label: "Cargo", targetClientKey: 2 },
        { label: "Travel agency support", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "002-0114 708 8814." },
      { clientKey: 3, type: "outcome", text: "002-03 419 7635 or 002-011 299 152 99." },
    ],
  },
];
