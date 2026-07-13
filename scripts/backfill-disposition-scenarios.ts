import { prisma } from "../lib/prisma";

// Concrete, realistic call examples for each disposition code — distinct from the
// "description" field (the original wrap-up-guide Call Scenario text), which stays as-is.
const SCENARIOS: Record<number, string> = {
  138: "A passenger who converted 10,000 points yesterday says the Etihad Guest Miles haven't appeared — reassure them transfers post within 24 hours, and confirm the amount submitted was an even number.",
  139: "A passenger with a RAKBANK card asks why last month's spend isn't showing as AirRewards points — check when their AirRewards account was activated relative to the RAKBANK transfer before troubleshooting further.",

  44: "A passenger asks a general baggage question that doesn't fit upgrade, availability, or dimensions — answer from the Baggage Allowance article directly.",
  41: "A passenger on a Basic fare wants to add checked baggage but the option isn't showing — confirm their fare bundle allows it before saying no.",
  40: "A passenger already has some checked baggage and wants to add more weight — check whether an upgrade option exists for their bundle and quote the fee.",
  42: "A passenger asks if their suitcase will be accepted — quote the checked and hand-carry size limits from the Baggage Allowance article.",
  43: "A passenger asks if they can pack a power bank or lighter in checked baggage — check the restricted items list before answering.",
  142: "A passenger travelling from KSA asks about bringing Zamzam water — confirm the 5-litre, purchased-only rule for their hub.",

  97: "A passenger booking a Morocco domestic flight asks what's included in Value vs Basic — confirm Domestic pricing applies, not International, before quoting.",
  98: "A passenger on 3O asks if they can still change their date next week — check the cut-off window for their fare bundle first.",
  99: "A passenger booking 9P International asks which bundle includes a free checked bag — quote in AED, not PKR, since this is an International sector.",
  100: "A passenger on a 9P Domestic booking asks about the 24h modification cut-off — confirm it applies to their specific bundle.",
  95: "A passenger booking G9 asks which bundle to pick — ask what matters most to them (bag weight, seat, meal, flexibility) rather than reading the whole chart.",
  96: "A passenger wants to know if they can still cancel for free — check their G9 bundle's cut-off time before answering.",

  23: "A passenger on a multi-city booking only wants to cancel the return leg — confirm this is a segment cancellation, not a full-ticket one.",
  22: "A passenger wants to cancel their entire booking and asks what they'll get back — walk them through the credit calculation before confirming.",
  25: "A passenger cancels and is quoted a lower credit than expected — recheck the original payment date/method with them; if they still disagree, log it as not suitable.",
  21: "A passenger asks what they'd get back if they cancelled, but doesn't want to commit yet — answer the question without processing anything.",
  24: "A passenger on a Basic fare wants a refund instead of credit — explain why they're not eligible under their fare rules.",
  26: "A caller can't confirm the booking contact's name or destination — stop the cancellation request until verification passes.",

  115: "A business asks how to ship a pallet from Casablanca — give them the Morocco cargo booking contact.",
  116: "A Morocco travel agency asks who handles their account — route them to the assigned Sales Team contact.",
  117: "A passenger asks how to send cargo from Cairo — give them the Egypt cargo contact number.",
  118: "An Egypt-based travel agency needs booking support — give them the E5 travel agency support contact.",
  114: "A business asks about exporting cargo from Sharjah — give them the SAS Export Counter contact, noting it's 24/7.",

  124: "A passenger flying from Abu Dhabi wants to check in at YAS Mall the day before — confirm the location is open and quote the handling fee by passenger type.",
  123: "A Sharjah resident asks if someone can check them in at home — confirm they're within the booking window and eligible area.",
  89: "A passenger asks how to get to the airport without a car — check if a shuttle bus route covers their hub.",
  125: "A 9P Domestic passenger asks when counters close — remember this hub has a shorter 45-minute cut-off, not the standard 1 hour.",
  90: "A G9 passenger wants to check in and drop bags before heading to the airport — confirm City Check-in is available for their hub and quote the fee.",
  88: "A passenger can't get their boarding pass online — check they're within the 48h–3h online check-in window.",

  65: "A passenger complains ground staff were rude at check-in — raise it under Complaints > Airport related, not a generic staff-attitude note.",
  72: "A passenger complains their AirRewards points never credited after a flight — raise it under Complaints > Airrewards.",
  63: "A passenger's complaint is really about a delayed or damaged bag — redirect to Baggage Claims first; only use this Sprinklr category for follow-ups already routed there.",
  64: "A passenger says a previous agent booked the wrong date — this is a quality case, raise it under Call Center related with the correct sub-type.",
  73: "A passenger complains they were charged twice for city check-in — raise it under Complaints > City/online Check-in.",
  61: "A passenger is upset about a schedule change but no action was actually needed from us — log the complaint without creating a modification.",
  68: "A passenger complains their holiday package hotel didn't match what was booked — raise it under Complaints > Holidays related.",
  67: "A passenger complains a sales office gave them wrong information — raise it under Complaints > Office related, not Call Center.",
  66: "A passenger says their pre-purchased seat wasn't honoured onboard — raise it under Complaints > Onboard related.",
  74: "A complaint doesn't fit any listed sub-type — still empathize and log it under Other rather than guessing at the wrong category.",
  71: "A passenger wants a service we simply don't offer at their hub — log it as Service not available rather than trying to find a workaround.",
  69: "A passenger disputes the modification fee they were charged — raise it under Complaints > T&C related if they believe the terms were misapplied.",
  70: "A passenger complains about a visa rejection they blame on our documentation — raise it under Complaints > Visa related.",
  62: "A passenger says the website charged them but didn't complete the booking, and the Call Center can't fix it — raise it under Complaints > Website related.",

  51: "A passenger's credit voucher is about to expire and they're not ready to book — request an extension on their behalf.",
  52: "A passenger wants to give their credit voucher to a friend — this needs a credit exception request, not a standard transfer.",
  50: "A passenger can't remember how much credit they have or when it expires — look it up and confirm both details.",

  92: "A passenger past the cancellation deadline insists on an exception — escalate to the Duty Supervisor rather than granting it yourself.",
  93: "A passenger wants a fare-rule exception to modify an ineligible booking — escalate for supervisor review, don't override the rule.",
  94: "A passenger requests an exception that doesn't fit refund/cancellation/modification — still route it to the Duty Supervisor rather than declining outright.",
  91: "A passenger not normally eligible for a refund has a genuine exceptional circumstance — escalate to the Duty Supervisor for review.",

  103: "A passenger with no baggage allowance on their fare asks the cost for one extra bag — use the no-baggage first-20kg table, not the standard per-kg rate.",
  102: "A passenger flying to Morocco asks the excess baggage cost — confirm direction of travel first since MAD and EUR rates differ.",
  104: "A passenger connecting through Pakistan asks about excess baggage — confirm whether it's Domestic, International departing, or International arriving, since all three differ.",
  106: "A passenger with no baggage fare flying from Egypt asks the excess cost — use the no-baggage first-20kg table.",
  105: "A passenger flying into Egypt from Sharjah asks the excess baggage rate — quote in AED for that specific route.",
  101: "A passenger connecting via UAE to a GCC country asks the excess baggage rate — confirm it's the connection rate, not point-to-point.",

  28: "A passenger's flight was cancelled due to a flight alert and they want a credit voucher instead of rebooking.",
  30: "A passenger received a flight alert and just wants to confirm the new departure time before deciding what to do.",
  27: "A passenger's flight time changed and they want to move to a different flight instead of accepting the new time.",
  31: "A passenger has a flight-alert-related request that isn't a modification, cancellation, refund, or timing check.",
  29: "A passenger's flight was affected by a flight alert and they want their money back rather than a credit voucher.",

  57: "A passenger wants to cancel a holiday package — remind them of the 72h notice requirement and that only a credit voucher is issued, no refund.",
  58: "A passenger who already raised a holiday request calls asking for a status update — don't re-raise it, point them to the assigned team.",
  56: "A passenger wants to book a flight+hotel package — raise the Sprinklr holiday request with passenger count, destination, and dates.",
  59: "A passenger has a holiday-package question that isn't a new booking, cancellation, or follow-up.",

  81: "A passenger asks which terminal their flight departs from.",
  75: "A passenger asks how many points they'd earn on an upcoming flight.",
  86: "A passenger on a Cairo route asks about getting a refund — this hub has different refund rules than other routes.",
  76: "A pregnant passenger asks if she can still fly at 30 weeks — check the Fit to Fly certificate requirement.",
  79: "A passenger wants to update the mobile number on file for their booking.",
  82: "A passenger lost their confirmation email and wants it resent.",
  87: "A passenger asks if their flight tomorrow is on time.",
  83: "A caller who isn't the passenger just wants to know if a flight has landed — no PNR or verification needed for this.",
  78: "A passenger notices their name has a typo and wants it corrected before travel.",
  84: "A passenger who missed their flight asks if they can reclaim the airport taxes.",
  77: "A passenger asks for the address or opening hours of a sales office.",
  80: "A passenger flying to the UAE on a visa copy asks if they need an Ok to Board clearance first.",
  85: "A passenger with mobility needs asks how to arrange wheelchair assistance for their flight.",

  126: "An armed forces officer calls to book using an APW voucher — confirm the required duty documents before proceeding.",
  127: "A passenger with a TAC ticket asks to correct their name — explain this isn't permitted on voucher bookings.",

  16: "A passenger's date change was completed — confirm the new date back to them before ending the call.",
  17: "A passenger's destination change was completed — recap the new route before ending the call.",
  12: "A passenger wants to move to a specific date but that flight is fully booked.",
  15: "A passenger wants to modify but none of the available times work for their schedule.",
  14: "A passenger backs out of a modification after hearing the price difference.",
  13: "A passenger asks what a date change would cost without committing to it yet.",
  20: "A passenger asks about correcting their name as part of a modification call.",
  18: "A passenger on a Basic fare wants a free modification — explain their bundle doesn't include it.",
  19: "A caller can't answer the verification questions during a modification request — stop before making any changes.",

  130: "A 3O passenger's name doesn't match their AirRewards account — verify the ID and correct it at no charge.",
  129: "A 3O passenger's name is misspelled by one letter — this is free, raise the DS Form directly.",
  131: "A 3O passenger wants to change their surname to their spouse's after marriage — request the marriage certificate.",
  133: "A 3O passenger wants to put a completely different person's name on the ticket — explain this isn't allowed.",
  132: "A 3O passenger's first and last name are swapped or wrong — this requires proof of ID and a fee applies.",
  5: "A passenger asks to have their name corrected on an existing ticket.",

  11: "A passenger asks if there are any current promotions before booking.",
  6: "A passenger wants to book a specific date but it's sold out.",
  8: "A passenger decides not to book after hearing the fare total.",
  7: "A passenger asks about fares and availability but isn't ready to book yet.",
  10: "A new booking was completed successfully — confirm the itinerary before ending the call.",
  9: "A passenger wants to book but none of the available flight times work for them.",

  47: "A passenger asks about Fast Track or lounge access for their flight.",
  48: "A passenger asks about booking a transfer from the airport to their hotel.",
  49: "A passenger asks what's covered under the travel insurance add-on.",
  46: "A passenger wants to add a special meal to their booking.",
  45: "A passenger asks about reserving an exit-row or front-row seat.",

  37: "A passenger says they were charged in the wrong currency.",
  36: "A passenger says they were charged twice for the same booking.",
  35: "A passenger's payment for an added bag or seat failed but the charge still shows on their card.",
  34: "A passenger paid for a date change but the booking still shows the old date.",
  33: "A passenger's card was charged but no confirmation email arrived.",
  38: "A passenger asks what payment methods are accepted and whether there's a surcharge.",
  32: "A passenger says their payment link expired before they could pay.",
  39: "A passenger reports the booking system errored out mid-payment.",

  119: "A passenger wants to travel with a falcon on G9 — confirm they'll book at least 48 hours ahead and note it in Accel Aero.",
  120: "A passenger on a non-G9 hub asks to bring their dog onboard — explain pets aren't accepted except G9 falcons.",

  137: "A passenger in Amman asks about the discounted AUH fare — confirm the promotion's booking window hasn't closed.",
  136: "A passenger asks if their Emirates Islamic card qualifies for the 20% Ultimate fare discount — confirm their flight originates in the UAE.",

  134: "A passenger with a RAK Bank ticket insists on changing their date — explain this isn't possible on any channel, with no exceptions.",

  128: "A family calls about flying a deceased relative's body — confirm they have the death certificate, coffin certificate, and police NOC ready.",

  121: "A Homat Al Watan cardholder wants to book — raise a Sprinklr case and request their ID and relationship proof, don't hold the booking.",
  122: "A passenger asks if their Esaad card covers airport taxes too — clarify it only covers fare and surcharge.",

  110: "A passenger wants to bring a 65-inch TV on a 3O flight — explain it exceeds the 60-inch limit and can't be accepted.",
  109: "A passenger asks the cost to bring a 50-inch TV on 3O — quote MAD 500 plus the indemnity form requirement.",
  112: "A passenger wants to bring a 70-inch TV on 9P — explain it can't be accepted.",
  111: "A passenger asks the TV fee on a 9P International flight — quote in AED, not PKR.",
  113: "A passenger asks the cost to bring a 45-inch TV from Egypt — quote EGP 2,000 plus handling fees.",
  108: "A passenger wants to bring a 65-inch TV on G9 — explain it can't be accepted.",
  107: "A passenger asks if there's a charge for bringing a 35-inch TV on G9 — confirm it's free since it's under 40 inches.",

  140: "A passenger booking for their family isn't sure how to count a 13-year-old and a 1-year-old — walk them through the age-based classification.",

  135: "A passenger booked through a third-party site asks to change their date — check if it's a Travel Fusion booking before doing anything, since those are on hold.",

  60: "A travel agency calls on behalf of a client to make a booking.",

  141: "A pregnant passenger at 32 weeks asks what documentation she needs to fly.",
  55: "A passenger asks about a travel requirement that isn't vaccinations or visas specifically.",
  53: "A passenger asks if they need a vaccination certificate for their destination.",
  54: "A passenger asks whether they need a visa for their destination.",
};

async function main() {
  const codes = await prisma.dispositionCode.findMany({ select: { id: true } });
  const missing = codes.filter((c) => !(c.id in SCENARIOS));
  if (missing.length > 0) {
    console.error(`Missing scenario text for ${missing.length} code id(s): ${missing.map((m) => m.id).join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const extra = Object.keys(SCENARIOS)
    .map(Number)
    .filter((id) => !codes.some((c) => c.id === id));
  if (extra.length > 0) {
    console.warn(`Note: ${extra.length} scenario id(s) don't match any current code (ignored): ${extra.join(", ")}`);
  }

  let updated = 0;
  for (const [id, scenario] of Object.entries(SCENARIOS)) {
    const codeId = Number(id);
    if (!codes.some((c) => c.id === codeId)) continue;
    await prisma.dispositionCode.update({ where: { id: codeId }, data: { scenario } });
    updated++;
  }

  console.log(`Updated scenario text on ${updated} disposition codes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
