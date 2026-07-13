export interface QuickReferenceFact {
  label: string;
  value: string;
}

export interface QuickReferenceHub {
  hub: string;
  color: string;
  facts: QuickReferenceFact[];
}

export const QUICK_REFERENCE_HUBS: QuickReferenceHub[] = [
  {
    hub: "General (All Hubs)",
    color: "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300",
    facts: [
      { label: "Hand carry", value: "7kg + 3kg personal item (max 100ml liquids)" },
      { label: "Checked baggage", value: "Up to 32kg/piece, 158cm W+L+H" },
      { label: "Ticket type by age", value: "Under 2 Infant · 2–11 Child · 12+ Adult (as of travel date)" },
      { label: "Verification", value: "Passenger name + flight destination/date + one contact detail — all 3 required" },
      { label: "Flight change entitlement", value: "<2h none · 2–4h free rebook/cancel, no refund · 4h+ or commercial cancellation, full refund" },
      { label: "Rebooking window", value: "Free within ±7 days of original date" },
      { label: "Cairo (CAI) bundle mod/cancel T&C", value: "Basic: 24h notice, AED 200/pax/sector mod (+ fare diff) or cancel, remainder refunded · Ultimate: 8h notice, 2 free mods, AED 200/pax/sector cancel · Business: 8h notice, free mods (fare diff only), AED 200/pax/sector cancel — overrides the flying hub's normal bundle chart" },
    ],
  },
  {
    hub: "G9 (Sharjah / RAK)",
    color: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    facts: [
      { label: "Bundle Ultimate", value: "30/40kg baggage, any seat row 2+, hot meal, 2 free mods (8h), priority check-in included" },
      { label: "Bundle Basic/Value mod/cancel T&C", value: "Basic: AED 200 mod (24h notice), AED 200 cancel — credit only, no refund · Value: 1 free mod (24h notice), cancel AED 100 credit or AED 300 refund — not applicable on Cairo routes" },
      { label: "Name change (paid)", value: "AED 350/passenger + fare difference, 24h notice" },
      { label: "Excess baggage (Sub-Continent, point-to-point)", value: "AED 60/kg" },
      { label: "TV handling", value: "<40in free · 40–60in AED 150 · >60in not allowed" },
      { label: "Cargo (Sharjah)", value: "Export 06-514-1174 · Import 06-514-1188 / 1189 (24/7)" },
      { label: "OTB", value: "Required from India/Pakistan/Bangladesh — AED 15–20/passenger at UAE offices" },
    ],
  },
  {
    hub: "3O (Morocco)",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    facts: [
      { label: "Bundle Ultimate (Intl)", value: "25kg baggage, 2 free mods (8h), free cancel credit or €40 refund" },
      { label: "Bundle Basic/Value T&C (Intl)", value: "Basic: €40 mod (72h notice), cancel credit €50 only, no refund · Value: 15/20kg baggage, 1 free mod (24h notice)" },
      { label: "Bundle Ultimate (Domestic)", value: "25kg baggage, any seat row 2+, sandwich, priority check-in, 2 free mods (8h)" },
      { label: "Bundle Basic/Value T&C (Domestic)", value: "Basic: MAD 200 mod (72h notice), cancel credit MAD 200 only, no refund · Value: 15kg baggage, 1 free mod (12h notice)" },
      { label: "Name correction", value: "5 cases: spelling/AirRewards/spouse free · wrong name paid · total change not permitted" },
      { label: "Excess baggage (to UAE)", value: "MAD 250/kg from Morocco" },
      { label: "Cargo", value: "+212 666 28 49 02 / maccargobooking@airarabia.com" },
    ],
  },
  {
    hub: "9P (Pakistan)",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    facts: [
      { label: "Bundle Ultimate (Domestic)", value: "46kg baggage, 2 free mods (8h), free cancel credit or PKR 7,000 refund" },
      { label: "Bundle Basic/Value T&C (Domestic)", value: "Basic: PKR 4,500 mod (24h notice), cancel credit PKR 5,500 only, no refund · Value: 23kg baggage, 1 free mod (12h notice)" },
      { label: "Bundle Ultimate (International)", value: "40kg baggage, any seat row 2+, hot meal, priority check-in, 2 free mods (8h), free cancel credit or AED 200 refund" },
      { label: "Bundle Basic/Value T&C (International)", value: "Basic: AED 200 mod (24h notice), cancel credit AED 200 only, no refund · Value: 20/30kg baggage, 1 free mod (24h notice)" },
      { label: "Name change (paid)", value: "AED 350 (Intl) / PKR 3,500 (Domestic) + fare difference, 24h notice" },
      { label: "Excess baggage (arriving, direct)", value: "AED 60/kg · connecting AED 70/kg" },
      { label: "Dead body transport", value: "PKR 20,000 + fees · report 1h before departure at cargo · 24/7: +92 300 8214381" },
      { label: "OTB", value: "Free at Pakistan offices · AED 15–20 at UAE offices" },
    ],
  },
  {
    hub: "E5 (Egypt)",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    facts: [
      { label: "TV handling", value: "<40in free · 40–60in EGP 2,000 · max 60in" },
      { label: "Excess baggage / cargo", value: "See the live Excess Baggage Rates – E5 / Cargo & Trade Contacts – E5 articles for current figures" },
    ],
  },
  {
    hub: "3L (Abu Dhabi)",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    facts: [
      { label: "Early check-in", value: "Cruise Terminal/YAS Mall/Mussafah, 24h prior, AED 35/25/15 (adult/child/infant)" },
      { label: "Home check-in (MORAFIQ)", value: "24h–5h window, AED 185–400 by bag count" },
    ],
  },
];
