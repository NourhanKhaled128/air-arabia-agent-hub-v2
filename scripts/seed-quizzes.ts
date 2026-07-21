// Seeds the 3 launch quizzes (2 recap quizzes + 1 final exam) with scenario-based,
// tricky multiple-choice questions derived from the training deck's own vetted
// content (content.js / capstone.js in the training-material build). All created
// as Draft — publish each from /admin/quizzes when its training day arrives.
//
// Run with: npx tsx scripts/seed-quizzes.ts

import { prisma } from "../lib/prisma";

interface QuestionSeed {
  text: string;
  correct: string;
  wrong: [string, string, string];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------------------------------------------------------------------------
// Quiz 1 — Days 1–2 Recap (Modules 1–8)
// ---------------------------------------------------------------------------
const QUIZ_1: QuestionSeed[] = [
  {
    text: "A caller confirms their name and flight date correctly but gives a contact detail that doesn't match what's on file, on a request to change a paid booking. What should you do?",
    correct: "Don't proceed — all three verification details must check out before touching a paid PNR.",
    wrong: [
      "Proceed since 2 of 3 match and the request is time-sensitive.",
      "Ask a supervisor to override verification for this one case.",
      "Proceed but flag the booking for a later audit.",
    ],
  },
  {
    text: "A caller only wants to know if their flight has landed and has no PNR or booking to change. What's required before answering?",
    correct: "Nothing — general flight-status questions need no verification since the caller may not even be the passenger.",
    wrong: [
      "The same 3-question verification as any other call.",
      "At least the passenger's full name.",
      "A booking reference, even though there's no change being made.",
    ],
  },
  {
    text: "Is it acceptable to skip a verification question if the caller sounds legitimate and the request is urgent?",
    correct: "No — all three questions must check out every time, regardless of urgency.",
    wrong: [
      "Yes, if the caller can confirm 2 of the 3.",
      "Yes, but only for same-day travel emergencies.",
      "Yes, as long as a supervisor is informed afterward.",
    ],
  },
  {
    text: "A child turns 12 the week after their booked flight. Which fare type applies?",
    correct: "Child fare — age is fixed as of the travel date, not the booking date.",
    wrong: [
      "Adult fare, since they'll be 12 by the time most paperwork is processed.",
      "Whichever fare was correct when the booking was made.",
      "The passenger's choice, since it's close to the cutoff.",
    ],
  },
  {
    text: "A Fit to Fly certificate is dated 20 days before travel. Is it valid?",
    correct: "No — certificates are only accepted within 14 days of travel; request an updated one.",
    wrong: [
      "Yes, certificates are valid for 30 days.",
      "Yes, as long as it's signed and stamped.",
      "Yes, since Fit to Fly certificates don't expire.",
    ],
  },
  {
    text: "A passenger who is 30 weeks pregnant with twins wants to fly. What applies?",
    correct: "Travel is allowed up to week 32 for multiple pregnancies, with a Fit to Fly certificate stating the week count.",
    wrong: [
      "Travel is allowed up to week 35, same as a single pregnancy.",
      "Not permitted past week 28 for any pregnancy.",
      "Allowed with just a disclaimer form, no certificate needed.",
    ],
  },
  {
    text: "Is a self-declaration note from the passenger enough to confirm pregnancy fitness to fly?",
    correct: "No — it must be signed and stamped by a doctor or hospital; self-declarations are never accepted.",
    wrong: [
      "Yes, as long as it includes the week count.",
      "Yes, for domestic sectors only.",
      "Yes, if witnessed by cabin crew at boarding.",
    ],
  },
  {
    text: "A passenger's credit only covers 70% of a new fare. How do you proceed?",
    correct: "Apply the credit, then send a payment link for the remaining balance — the booking stays forced (CNF forced) until paid.",
    wrong: [
      "Cancel the booking since the credit doesn't fully cover it.",
      "Apply the credit and waive the rest as a goodwill gesture.",
      "Refuse to apply partial credit — it must cover the full fare.",
    ],
  },
  {
    text: "A passenger's name is spelled slightly differently on a new booking than on their existing credit PNR. What should happen before applying the credit?",
    correct: "Fix the spelling so it matches exactly — credit only applies to the same passenger, name-matched.",
    wrong: [
      "Apply the credit anyway since it's clearly the same person.",
      "Apply the credit and note the discrepancy for later.",
      "Refuse the credit permanently due to the mismatch.",
    ],
  },
  {
    text: "If a passenger's credit doesn't cover the new fare, is the booking simply cancelled?",
    correct: "No — the credit is applied and a payment link is sent for the balance.",
    wrong: [
      "Yes, any shortfall automatically cancels the booking.",
      "Yes, unless the passenger pays in cash immediately.",
      "Yes, unless a supervisor approves an exception.",
    ],
  },
  {
    text: "A same-day return booking turns out to actually be a visa run (VFR). Can it be booked over the phone?",
    correct: "No — it must be booked as VFR at an Air Arabia office, not over the phone.",
    wrong: [
      "Yes, as long as it's marked VFR in Accel Aero afterward.",
      "Yes, but only for UAE-bound visa runs.",
      "Yes, if the passenger confirms they understand the restrictions.",
    ],
  },
  {
    text: "An existing VFR booking needs a date change. What can the Call Center do?",
    correct: "Nothing — no VFR action (booking, modifying, or cancelling) is possible from the Call Center; it needs an office visit.",
    wrong: [
      "Modify the date but not the passenger details.",
      "Modify it only if the new date is within 7 days.",
      "Cancel it and rebook as a standard ticket.",
    ],
  },
  {
    text: "Can a VFR ticket at least be cancelled over the phone, even though it can't be booked that way?",
    correct: "No — no VFR action at all is possible from the Call Center.",
    wrong: [
      "Yes, cancellations are always allowed regardless of ticket type.",
      "Yes, but only within 24 hours of booking.",
      "Yes, if the passenger requests a credit instead of a refund.",
    ],
  },
  {
    text: "During a modification call, an agent quotes charges before checking whether ancillaries carry over to the new flight. What's wrong?",
    correct: "Wrong order — ancillary carryover must be checked before charges are quoted, since it can change what's billed.",
    wrong: [
      "Nothing — charges and ancillaries can be checked in any order.",
      "Nothing, as long as both are checked before the call ends.",
      "The charges should have been quoted even earlier, before recapping the current flight.",
    ],
  },
  {
    text: "A passenger cancelling a booking says a verbal confirmation is enough and asks to skip the email. What should the agent do?",
    correct: "Send the email confirmation anyway — it's the checklist's mandatory final step.",
    wrong: [
      "Skip it since the passenger explicitly agreed to waive it.",
      "Send it only if the cancellation involves a refund.",
      "Send a text message instead, since that's faster.",
    ],
  },
  {
    text: "If a passenger says a verbal cancellation confirmation is enough, is it okay to skip the email confirmation?",
    correct: "No — always send the email confirmation regardless of what the passenger says.",
    wrong: [
      "Yes, verbal confirmation is legally sufficient.",
      "Yes, but only for cancellations without a refund.",
      "Yes, if the call was recorded.",
    ],
  },
  {
    text: "A passenger's checked bag weighs 35kg. What applies?",
    correct: "It's over the 32kg limit — split into two bags or quote the per-kilo excess charge.",
    wrong: [
      "It's fine — the limit is 35kg per bag.",
      "It's fine as long as total trip baggage stays under 64kg.",
      "Refuse to check the bag under any circumstance.",
    ],
  },
  {
    text: "A passenger wants to pack a small amount of cooking oil in checked baggage. What applies?",
    correct: "Not allowed — cooking oil is banned outright, regardless of quantity.",
    wrong: [
      "Allowed if under 100ml, same as the liquids rule.",
      "Allowed if declared at check-in.",
      "Allowed only on domestic sectors.",
    ],
  },
  {
    text: "A passenger's hand carry bag weighs only 6kg but measures 60 x 45 x 25cm. Is that a problem?",
    correct: "Yes — the bag itself must fit within 55 x 40 x 20cm regardless of weight.",
    wrong: [
      "No — only the 7kg weight limit matters for hand carry.",
      "No, since it's under the 32kg checked limit.",
      "Only a problem if the personal item is also oversized.",
    ],
  },
  {
    text: "A pregnant passenger requests an exit row seat. What applies?",
    correct: "Not permitted — offer an alternative seat instead.",
    wrong: [
      "Permitted if she's under 28 weeks.",
      "Permitted with a doctor's note.",
      "Permitted only on wide-body aircraft.",
    ],
  },
  {
    text: "A Gold-plan insurance holder asks about baggage delay compensation. What applies?",
    correct: "Not covered — baggage delay compensation is Platinum-only.",
    wrong: [
      "Covered, up to USD 200.",
      "Covered, but only for delays over 6 hours.",
      "Covered at half the Platinum rate.",
    ],
  },
  {
    text: "If a passenger changes their return date after buying travel insurance, does the policy update automatically?",
    correct: "No — the passenger must contact the insurer directly to update coverage dates.",
    wrong: [
      "Yes, insurance dates always follow the ticket automatically.",
      "Yes, as long as the change is made within 24 hours of purchase.",
      "Yes, for Platinum plan holders only.",
    ],
  },
  {
    text: "A passenger wants to add checked baggage to a G9 flight departing in 6 hours. What applies?",
    correct: "Past the 12-hour cut-off — they'll need to buy it at the airport instead.",
    wrong: [
      "Still fine — the cut-off is 4 hours for baggage.",
      "Still fine, since G9 has no baggage cut-off.",
      "Not possible at all, even at the airport.",
    ],
  },
  {
    text: "A 9P Domestic passenger arrives 50 minutes before departure to check in. What applies?",
    correct: "Still fine — the 9P Domestic cut-off is 45 minutes, not the standard 1 hour.",
    wrong: [
      "Too late — the standard 1-hour cut-off applies everywhere.",
      "Too late — 9P Domestic requires 2 hours.",
      "Fine only if they have no checked baggage.",
    ],
  },
  {
    text: "Once an ancillary cut-off has passed, is there nothing the passenger can do?",
    correct: "They can still purchase the ancillary directly at the airport — the cut-off only blocks pre-booking through the Call Center.",
    wrong: [
      "Correct, the ancillary is simply no longer available.",
      "Correct, unless they call back within 1 hour.",
      "Correct, unless a supervisor grants an exception.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Quiz 2 — Days 3–4 Recap (Modules 9–16)
// ---------------------------------------------------------------------------
const QUIZ_2: QuestionSeed[] = [
  {
    text: "A 3O passenger misses their flight and wants the no-show taxes credited automatically. What applies?",
    correct: "3O doesn't auto-credit no-show taxes — the passenger must raise a request.",
    wrong: [
      "3O auto-credits within 24 hours, same as G9.",
      "3O never refunds no-show taxes under any process.",
      "3O only credits if the passenger rebooks within 7 days.",
    ],
  },
  {
    text: "A flight is delayed 3 hours. What is the passenger entitled to?",
    correct: "Free rebooking and cancellation, but not a free refund (unless it's 9P Domestic).",
    wrong: [
      "A free refund, since any delay over 2 hours qualifies.",
      "Nothing, since only delays over 4 hours qualify for anything.",
      "Free rebooking only, no cancellation option.",
    ],
  },
  {
    text: "A passenger wants to shift their travel date by 10 days, free of charge, citing flexible fare rules. What applies?",
    correct: "Beyond the free ±7-day rebooking window — a fare difference applies.",
    wrong: [
      "Fine, the free window is ±14 days.",
      "Not possible at all, even with a fare difference.",
      "Free only if the new date is earlier, not later.",
    ],
  },
  {
    text: "Does a 3-hour delay always come with a free refund?",
    correct: "No — 2–4 hours gets free rebooking/cancellation but not a free refund; only over 4 hours (or commercial cancellations) unlocks one.",
    wrong: [
      "Yes, any delay over 2 hours guarantees a free refund.",
      "Yes, but only on international sectors.",
      "Yes, unless the passenger already checked in.",
    ],
  },
  {
    text: "A confirmed 15-passenger group booking needs just one passenger's meal changed. What applies?",
    correct: "Not possible from the Call Center, no matter how small the change — direct to the Groups team.",
    wrong: [
      "Fine, since meal changes are always allowed regardless of booking type.",
      "Fine, as long as it's requested before the ancillary cut-off.",
      "Only the group organizer can request it, but the Call Center can still process it.",
    ],
  },
  {
    text: "A passenger wants to book 12 seats on a sector that shows only 40 seats left in total. What applies?",
    correct: "Doesn't qualify as a group booking (needs 70+ available seats in that sector) — suggest other flights.",
    wrong: [
      "Qualifies as a group since 12 is well over the 10-passenger threshold.",
      "Qualifies as a group as long as the Groups team approves it.",
      "Doesn't qualify, but only because 12 is too few passengers.",
    ],
  },
  {
    text: "A caller wants an update on an export shipment at 2am. What applies?",
    correct: "SAS Export counter is staffed 24/7 — they can get an update anytime.",
    wrong: [
      "Cargo inquiries can only be handled during business hours.",
      "They should call back after 6am when the counter opens.",
      "This must go through Sprinklr, not a direct phone contact.",
    ],
  },
  {
    text: "Does any booking with 10 or more passengers count as a group?",
    correct: "No — it also needs 70+ available seats left in that sector; a full flight disqualifies an otherwise-large booking.",
    wrong: [
      "Yes, passenger count alone determines group status.",
      "Yes, as long as it's booked in one transaction.",
      "Yes, unless the Groups team objects.",
    ],
  },
  {
    text: "A 10-year-old wants their own AirRewards account. What applies?",
    correct: "Not possible — only 12+ can register directly; a 10-year-old must be linked to a family head account.",
    wrong: [
      "Fine, with a parent's written consent.",
      "Fine, any age can register directly online.",
      "Fine, but only via the Call Center, not online.",
    ],
  },
  {
    text: "A family head's own AirRewards account shows 0 points despite the family flying often. What applies?",
    correct: "Expected — the family head earns 0 points from their own flights, only the 50% share from linked members.",
    wrong: [
      "This is a system error and should be escalated immediately.",
      "Expected, but only if the family head hasn't flown this year.",
      "Expected, since family heads earn points only after 8 members are linked.",
    ],
  },
  {
    text: "A passenger wants to redeem 2,000 AirRewards points toward a seat selection fee. What applies?",
    correct: "Fine — there's no minimum for seat/meal/insurance/airport service redemptions.",
    wrong: [
      "Not allowed — the 3,000-point minimum applies to every redemption.",
      "Not allowed — seat redemptions require at least 5,000 points.",
      "Allowed, but only for Platinum-tier members.",
    ],
  },
  {
    text: "Does a family head earn their own points plus a share of the family's points?",
    correct: "No — the family head account earns 0 points from its own flights, only the 50% share from linked members.",
    wrong: [
      "Yes, family heads earn double points as an incentive.",
      "Yes, but only once the family has 8 linked members.",
      "Yes, on international flights only.",
    ],
  },
  {
    text: "A passenger calls 2 days after landing to report a damaged suitcase. What applies?",
    correct: "Too late — damage must be reported at the arrival airport's baggage desk at the time of arrival.",
    wrong: [
      "Fine, as long as it's reported within 7 days.",
      "Fine, photos emailed within 48 hours are an accepted substitute.",
      "Fine, since damage claims have no time limit.",
    ],
  },
  {
    text: "A passenger is upset that money was debited from their card but they never received a PNR. What applies?",
    correct: "Empathize, ask them to check again for a processing delay; if still unresolved after 2 hours, do an advanced search, raise a Sprinklr request, and extend the time limit 24h+.",
    wrong: [
      "Immediately process a refund without further checks.",
      "Tell them to dispute the charge with their bank directly.",
      "Ask them to try booking again immediately.",
    ],
  },
  {
    text: "Can a passenger just email photos of damaged luggage instead of visiting the counter?",
    correct: "No — damage, loss and delay must be reported at the arrival airport's baggage desk at the time of arrival, no substitute exists.",
    wrong: [
      "Yes, as long as photos are sent within 24 hours.",
      "Yes, for delayed baggage specifically, just not damage.",
      "Yes, if the passenger has photo evidence of the claim tag.",
    ],
  },
  {
    text: "A passenger asks what's included in G9 Ultimate. What applies?",
    correct: "30/40kg baggage, seat row 2+, hot meal, 2 free modifications (8h notice), and priority check-in.",
    wrong: [
      "20/30kg baggage, 1 free modification, no priority check-in.",
      "40/50kg baggage, unlimited free modifications.",
      "Same inclusions as G9 Value, just a higher price.",
    ],
  },
  {
    text: "A 3O domestic Basic-fare passenger wants to modify their booking 80 hours before departure. What applies?",
    correct: "Within the 72-hour domestic modification window — proceed and quote the MAD fee.",
    wrong: [
      "Outside the window — domestic modifications need 96 hours notice.",
      "Not possible — Basic fare on 3O domestic can't be modified at all.",
      "Fine, but only if paid in EUR.",
    ],
  },
  {
    text: "A 9P passenger quotes a PKR fee they found online for what turns out to be an international sector. What applies?",
    correct: "International 9P is priced in AED, not PKR — confirm domestic vs. international before quoting.",
    wrong: [
      "PKR pricing applies to all 9P sectors regardless of route.",
      "Both currencies are accepted interchangeably.",
      "International sectors use USD, not AED or PKR.",
    ],
  },
  {
    text: "Do all hubs use the same bundle fare chart, just in different currencies?",
    correct: "No — included baggage weights, modification windows, and fees all differ by hub.",
    wrong: [
      "Yes, the structure and numbers are identical, only currency changes.",
      "Yes, except for Ultimate fares.",
      "Yes, for G9 and 9P specifically, but not 3O.",
    ],
  },
  {
    text: "A passenger flies G9 direct (point-to-point) from the UAE to Pakistan and needs an excess baggage quote. What applies?",
    correct: "Sub-Continent point-to-point rate: AED 60/kg plus a handling fee.",
    wrong: [
      "The connecting rate of AED 70/kg applies since Pakistan is outside the UAE.",
      "A flat AED 100 regardless of weight.",
      "No excess charge applies to Sub-Continent routes.",
    ],
  },
  {
    text: "A 9P passenger arrives into Pakistan via a connecting flight and needs an excess baggage quote. What applies?",
    correct: "AED 70/kg — the connecting rate, higher than the AED 60/kg direct rate.",
    wrong: [
      "AED 60/kg — connections and direct flights are priced the same.",
      "PKR-denominated, since it's an arrival into Pakistan.",
      "No excess charge on connecting international arrivals.",
    ],
  },
  {
    text: "A 3O passenger on a no-baggage fare flies Casablanca to Turkey and needs the first 20kg quoted. What applies?",
    correct: "MAD 800 flat, with no piece-count restriction.",
    wrong: [
      "MAD 800 per piece, capped at 2 pieces.",
      "Priced in EUR since Turkey is the destination.",
      "No baggage can be added to a no-baggage fare at all.",
    ],
  },
  {
    text: "Does a connecting flight cost the same excess baggage rate as a direct one?",
    correct: "No — connecting routes are consistently priced higher than point-to-point.",
    wrong: [
      "Yes, the rate is set by destination zone only, not routing.",
      "Yes, except on 3O.",
      "Yes, as long as both legs are on the same hub.",
    ],
  },
  {
    text: "A G9 passenger requests a name change 10 hours before departure. What applies?",
    correct: "Not possible — needs at least 24 hours notice; escalate for a possible airport-level exception.",
    wrong: [
      "Fine, as long as a fee is paid immediately.",
      "Fine, since 10 hours is enough notice for name changes.",
      "Not possible under any circumstance, even at the airport.",
    ],
  },
  {
    text: "A 3O passenger requests a free AirRewards ID correction, but the ID isn't visible in Accel Aero. What applies?",
    correct: "Verify the ID in Accel Aero first — it's required before the free correction can proceed.",
    wrong: [
      "Process it anyway based on the passenger's verbal confirmation.",
      "Redirect to a paid SP case instead, since it can't be verified.",
      "Not possible at all without the ID visible — no workaround exists.",
    ],
  },
  {
    text: "A 9P passenger wants to use a sibling's travel credit for a name change. What applies?",
    correct: "Permitted — siblings count as immediate family; raise a Sprinklr case with proof.",
    wrong: [
      "Not permitted — credit transfers only apply to spouses.",
      "Permitted without any proof required, since it's a sibling.",
      "Not permitted under any circumstances — credit is strictly non-transferable.",
    ],
  },
  {
    text: "Does any name correction on 3O just need a DS Form?",
    correct: "No — only cases 1–3 are free DS Form cases; cases 4–5 need a paid SP case or aren't permitted at all.",
    wrong: [
      "Yes, all 5 case types use the same DS Form process.",
      "Yes, as long as a supervisor signs off.",
      "Yes, except for spelling corrections.",
    ],
  },
  {
    text: "A G9 passenger wants to check in three 45-inch TVs. What applies?",
    correct: "Permitted, no limit on count — AED 150 each plus handling, each counted as 1 bag.",
    wrong: [
      "Only 1 TV per passenger is allowed.",
      "Permitted, but the second and third TVs are free.",
      "Not allowed — TVs over 40in require special cargo booking, not check-in.",
    ],
  },
  {
    text: "An E5 passenger wants to check in a 65-inch TV. What applies?",
    correct: "Not accepted — the maximum size is 60 inches.",
    wrong: [
      "Accepted for an additional EGP 2,000 handling fee.",
      "Accepted only if boxed in original packaging.",
      "Accepted, since E5 has no maximum size limit.",
    ],
  },
  {
    text: "Is there a limit on how many TVs one passenger can check in?",
    correct: "No limit exists — each TV is simply priced individually by its own size band.",
    wrong: [
      "Yes, a maximum of 2 per passenger.",
      "Yes, a maximum of 1 per checked bag allowance.",
      "Yes, unless traveling on a Value or Ultimate bundle.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Quiz 3 — Final Exam (all 20 modules + cross-module capstone scenarios)
// ---------------------------------------------------------------------------
const QUIZ_3: QuestionSeed[] = [
  {
    text: "A caller wants to modify a paid booking and gets exactly 2 of the 3 verification questions right, insisting the third detail is just outdated. What should the agent do?",
    correct: "Still don't proceed — all three must check out regardless of the explanation given.",
    wrong: [
      "Proceed since the explanation is plausible.",
      "Ask for a 4th question to compensate.",
      "Proceed but require an ID photo afterward.",
    ],
  },
  {
    text: "Which of the four core systems is used to confirm whether a flight-time change was planned or unplanned?",
    correct: "Caesar",
    wrong: ["Accel Aero", "Sprinklr", "Teams"],
  },
  {
    text: "A passenger is exactly 6 days old on the day of travel. What's required?",
    correct: "A Fit to Fly certificate is required (3–6 days needs one; 7+ days needs none).",
    wrong: [
      "No certificate needed, since infants under 7 days are always exempt.",
      "Travel isn't permitted at all under 7 days old.",
      "Only a disclaimer form is needed, not a certificate.",
    ],
  },
  {
    text: "An unaccompanied 11-year-old wants to travel alone. What applies?",
    correct: "Not permitted — under-12s must travel with an adult aged 16 or older.",
    wrong: [
      "Permitted with airline staff supervision arranged in advance.",
      "Permitted if both departure and arrival countries allow it.",
      "Permitted only on domestic sectors.",
    ],
  },
  {
    text: "A passenger wants to check their PNR history before processing a new change. What should the agent do?",
    correct: "Always check the PNR history before making a new change — it's a required step.",
    wrong: [
      "Skip it if the passenger seems trustworthy.",
      "Only check it for cancellations, not modifications.",
      "Only check it if the booking is more than a year old.",
    ],
  },
  {
    text: "A passenger asks whether payment channel charges need to be disclosed. What applies?",
    correct: "Yes — every payment channel carries a charge that must always be disclosed.",
    wrong: [
      "Only for market-specific channels like Mada or KNET.",
      "Only if the passenger asks directly.",
      "Only for installment plans.",
    ],
  },
  {
    text: "A passenger needs help with a Schengen visa application. What applies?",
    correct: "Air Arabia doesn't process visa applications — direct them to the relevant consulate/embassy (UAE visas go through an Air Arabia office instead).",
    wrong: [
      "Air Arabia processes all visa types through its offices.",
      "Only UAE-based agents can assist with visas.",
      "Refer them to the Groups team.",
    ],
  },
  {
    text: "How can an agent spot a same-day-return request that might actually be a visa run?",
    correct: "Ask directly whether the same-day return is for a visa change (VFR).",
    wrong: [
      "Assume any same-day return is automatically a VFR.",
      "Only investigate if the destination is outside the GCC.",
      "There's no way to identify this in advance — treat all bookings the same.",
    ],
  },
  {
    text: "During a cancellation call, in what order should payment date/method and credit amount/expiry be addressed?",
    correct: "Check payment date/method first (it affects the refund), then confirm the credit amount and expiry.",
    wrong: [
      "Credit amount first, since it's the passenger's main concern.",
      "Order doesn't matter as long as both are covered.",
      "Confirm expiry only if the passenger asks.",
    ],
  },
  {
    text: "A modification call reaches the end of the checklist. What's the final mandatory step?",
    correct: "Send the email confirmation of the new dates.",
    wrong: [
      "Ask for a satisfaction rating.",
      "Confirm the passenger's contact details again.",
      "Offer travel insurance before ending the call.",
    ],
  },
  {
    text: "A passenger wants 2 free liters of Zamzam water from a KSA departure. What applies?",
    correct: "Only one free 5L bottle per passenger is allowed.",
    wrong: [
      "2 liters is under the 5L limit, so it's fine.",
      "Zamzam water isn't permitted in checked baggage at all.",
      "Free allowance only applies to G9, not E5/9P.",
    ],
  },
  {
    text: "An infant is traveling and the family asks about checked baggage. What applies?",
    correct: "Infants get no checked baggage allowance — only 3kg hand-carry.",
    wrong: [
      "Infants get half the adult checked allowance.",
      "Infants get the same checked allowance as a Child fare.",
      "Infants get 10kg checked allowance.",
    ],
  },
  {
    text: "A passenger wants a bassinet for their 13-month-old in the front row. What applies?",
    correct: "Not eligible — bassinets are for babies 9–12 months (up to 74cm/29in and 11kg/25lbs).",
    wrong: [
      "Eligible, since front-row seating has no age restriction.",
      "Eligible up to 18 months.",
      "Eligible if the baby is under the weight limit, regardless of age.",
    ],
  },
  {
    text: "An exit-row candidate is 15 years old and otherwise fit and willing to assist. What applies?",
    correct: "Not eligible — exit row requires being 16 or older.",
    wrong: [
      "Eligible, since fitness matters more than age.",
      "Eligible with a parent's consent.",
      "Eligible only if traveling alone.",
    ],
  },
  {
    text: "A passenger wants online check-in exactly 50 hours before departure. What applies?",
    correct: "Not yet available — online check-in opens 48 hours before departure.",
    wrong: [
      "Available, since the window opens 72 hours prior.",
      "Available only for Ultimate-fare passengers this early.",
      "Available, since there's no fixed opening window.",
    ],
  },
  {
    text: "A wheelchair passenger at Abu Dhabi asks about the fee. What applies?",
    correct: "Free with a Special Needs Card or if aged 70+; otherwise AED 50.",
    wrong: [
      "Always free regardless of age or card.",
      "AED 105 flat rate, same as Sharjah.",
      "Wheelchair requests aren't available at Abu Dhabi.",
    ],
  },
  {
    text: "A disruption call comes in. What's the very first step in the handling flow?",
    correct: "Spot the alert.",
    wrong: [
      "Escalate via Teams immediately.",
      "Search for a transfer flight.",
      "Confirm via Caesar.",
    ],
  },
  {
    text: "A flight is affected by force majeure. What applies (except for 9P Domestic)?",
    correct: "Free rebooking and cancellation, but no free refund.",
    wrong: [
      "Free refund, rebooking, and cancellation, same as a delay over 4 hours.",
      "No entitlements at all under force majeure.",
      "Only a fare-difference-based rebooking.",
    ],
  },
  {
    text: "How is a group booking often identified in Accel Aero even before checking passenger/seat counts?",
    correct: "Signs like 'TBA' names, an Accel Aero note, or being booked by a 'Groups User' account.",
    wrong: [
      "Groups are only identifiable by contacting the Groups team directly.",
      "Any booking with more than 5 passengers.",
      "Groups are flagged automatically with a red banner.",
    ],
  },
  {
    text: "Once a group booking is confirmed, what can the Call Center still do to it?",
    correct: "Nothing — no modifications, cancellations, splits, ancillary or contact detail changes; it all goes through the Groups team.",
    wrong: [
      "Contact detail updates only.",
      "Ancillary changes only.",
      "Anything except full cancellation.",
    ],
  },
  {
    text: "How long after the travel date do unclaimed AirRewards points remain valid?",
    correct: "2 years from the travel date.",
    wrong: ["1 year from the travel date.", "3 years from the date of earning.", "Points never expire."],
  },
  {
    text: "A passenger flew last week and their AirRewards points haven't posted yet. What applies?",
    correct: "Future flights auto-credit within 24 hours of use — this is normal and expected.",
    wrong: [
      "This is a system error requiring escalation.",
      "Points only post after 90 days for all bookings.",
      "Points only auto-post for Family Head accounts.",
    ],
  },
  {
    text: "What's the correct first step when handling any complaint, regardless of type?",
    correct: "Listen and empathize, before acknowledging and offering a solution or escalating.",
    wrong: [
      "Immediately offer a refund to de-escalate.",
      "Ask the passenger to submit the complaint in writing first.",
      "Transfer directly to a supervisor.",
    ],
  },
  {
    text: "A passenger reports delayed (not lost or damaged) baggage. Where and when must this be reported?",
    correct: "At the arrival airport's baggage desk, at the time of arrival — same as damage or loss.",
    wrong: [
      "Can be reported later by phone since it's only delayed, not lost.",
      "Must be reported at the departure airport instead.",
      "Has a 48-hour grace period unlike damage/loss claims.",
    ],
  },
  {
    text: "A G9 booking needs a bundle fare quoted. Does the agent need to check domestic vs. international structure first, like with 3O or 9P?",
    correct: "No — G9 doesn't split its bundle chart into domestic/international like 3O and 9P do.",
    wrong: [
      "Yes, G9 uses the same domestic/international split as 3O.",
      "Yes, G9 international uses AED while domestic uses local currency.",
      "Only for Ultimate fare, not Basic or Value.",
    ],
  },
  {
    text: "What distinguishes G9 Value from G9 Ultimate in terms of modifications?",
    correct: "Value includes 1 free modification; Ultimate includes 2 free modifications plus priority check-in.",
    wrong: [
      "Value includes 2 free modifications; Ultimate includes 1.",
      "Both include unlimited free modifications.",
      "Neither includes free modifications — both are fee-based like Basic.",
    ],
  },
  {
    text: "Which currency is used for 3O excess baggage rates on a booking departing FROM Morocco?",
    correct: "MAD (local currency).",
    wrong: ["EUR, matching the destination currency.", "USD, as the international standard.", "Whatever currency the ticket was purchased in."],
  },
  {
    text: "Where should an agent check current E5 excess baggage rates?",
    correct: "The live rate article/workbook — rates aren't fixed the way other hubs are.",
    wrong: [
      "E5 uses the same flat rate as G9 Sub-Continent zones.",
      "E5 has no excess baggage charges.",
      "E5 rates are only available through the Groups team.",
    ],
  },
  {
    text: "A G9 passenger needs a free spelling correction (same passenger, no name change). Who handles it?",
    correct: "It goes straight to a Supervisor.",
    wrong: [
      "The Call Center processes it directly, same as any modification.",
      "It requires a Sprinklr case just like a 3O correction.",
      "It's not possible without an office visit.",
    ],
  },
  {
    text: "A 3O passenger needs a total name change (a different person entirely). What applies?",
    correct: "Not permitted — the ticket is nominative; this isn't one of the allowed correction cases.",
    wrong: [
      "Permitted via an SP case with a fee.",
      "Permitted only within 24 hours of booking.",
      "Permitted with immediate family proof.",
    ],
  },
  {
    text: "Which hub's TV handling fee is priced in EGP rather than AED?",
    correct: "E5",
    wrong: ["G9", "9P", "3O"],
  },
  {
    text: "A trade contact in Morocco needs the 3O cargo/trade email. What's available for this?",
    correct: "Country-specific cargo/trade contacts and emails maintained for 3O.",
    wrong: [
      "The same Sharjah SAS counters used for G9.",
      "There are no country-specific contacts — all 3O cargo goes through one central line.",
      "Only available by escalating through Teams.",
    ],
  },
  {
    text: "A passenger asks to book a falcon as a pet on a G9 flight departing in 24 hours. What applies?",
    correct: "Not possible — falcons must be booked via Accel Aero at least 48 hours prior, with no added baggage allowance.",
    wrong: [
      "Possible, since falcons can be added at any time before departure.",
      "Possible only if booked directly at the airport.",
      "Not possible at all — falcons are never permitted on G9.",
    ],
  },
  {
    text: "A passenger holding an Esaad card wants a 10% discount on a Dubai departure. What applies?",
    correct: "Not eligible — Special Discounts only apply to Abu Dhabi/RAK/Sharjah departures.",
    wrong: [
      "Eligible, since Esaad applies to all UAE departures.",
      "Eligible, but only at 5% instead of 10%.",
      "Eligible only for one-way tickets.",
    ],
  },
  {
    text: "A deceased passenger's family needs to transport the body on a 9P flight in 90 minutes. What applies?",
    correct: "Too late — reporting must happen 1 hour before departure at cargo, not standard check-in.",
    wrong: [
      "Fine, since 90 minutes exceeds the standard check-in cut-off.",
      "Fine, as long as all documents are ready.",
      "Fine, since dead body transport has no reporting deadline.",
    ],
  },
  {
    text: "What's the very first thing an agent should do on a dead body transport call?",
    correct: "Lead with empathy — before working through the document checklist.",
    wrong: [
      "Immediately request all five required documents.",
      "Transfer the call to a supervisor.",
      "Confirm payment of the PKR 20,000 handling fee first.",
    ],
  },
  {
    text: "A passenger wants to book a Cairo route with a bassinet request for their infant. What applies?",
    correct: "Not available — Cairo doesn't offer baby bassinets on any fare.",
    wrong: [
      "Available on Cairo Business only.",
      "Available on Cairo Ultimate only.",
      "Available with 48 hours notice, same as other routes.",
    ],
  },
  {
    text: "A passenger asks about the Emirates Islamic Visa Card promotion outside its 8 Jul–6 Aug booking window. What applies?",
    correct: "Not valid — promotions only apply within their exact booking/travel window; confirm today's date falls inside it.",
    wrong: [
      "Still valid for up to 30 days after the window closes.",
      "Valid as long as travel (not booking) falls in the window.",
      "Valid with manager approval outside the window.",
    ],
  },
  {
    text: "A passenger's complaint is about a previous agent quoting the wrong cancellation charge. What sub-type should this be logged under?",
    correct: "Wrong information.",
    wrong: ["Wrong booking.", "Wrong modification.", "Incomplete cancellation."],
  },
  {
    text: "Where are quality cases raised?",
    correct: "Under Complaints > Call Center Complaints, using the correct sub-type.",
    wrong: [
      "Directly with the Groups team.",
      "Via Caesar, same as flight-time changes.",
      "Only verbally to a supervisor, no case is raised.",
    ],
  },
  // --- Cross-module capstone scenarios (highest difficulty) ---
  {
    text: "A caller says they're calling on behalf of their sister to change her flight date on a G9 Value bundle, but can only confirm 2 of the 3 verification details. What should the agent do?",
    correct: "Stop — verification must be 3-for-3 before any action, regardless of the caller's stated relationship to the passenger.",
    wrong: [
      "Proceed since family members can act on each other's behalf.",
      "Proceed, but only quote the modification fee without processing the change.",
      "Ask the sister to call herself instead, but still skip full verification.",
    ],
  },
  {
    text: "A 3O Basic-fare passenger flying domestic wants to check two 20kg bags and asks the excess charge. What applies?",
    correct: "Basic fare has no included checked baggage — both bags are charged from the first kilo at the domestic excess rate, not just anything over an allowance.",
    wrong: [
      "Only the second bag is charged, since Basic includes one free bag.",
      "Both bags are free up to 20kg each on Basic fare.",
      "Charged only for the weight over 32kg total.",
    ],
  },
  {
    text: "A G9 flight is delayed 5 hours. The passenger wants to rebook to a flight 9 days later than originally booked, free of charge, and also asks whether their ancillaries carry over. What applies?",
    correct: "The 5-hour delay grants free rebooking/cancellation/refund, but shifting 9 days out is beyond the free ±7-day window, so a fare difference still applies for that date choice — and ancillary carryover must be confirmed before charges are quoted, per the modification checklist.",
    wrong: [
      "Since the delay is over 4 hours, the entire rebooking is free with no fare difference, regardless of the new date.",
      "The rebooking is free only if it's within 5 days, not 7.",
      "Ancillary carryover doesn't need confirming since the delay already covers all costs.",
    ],
  },
  {
    text: "A caller wants to check their AirRewards points balance and redeem points for a seat, but hasn't provided a PNR. What applies?",
    correct: "Verification is needed since this involves account/booking details tied to a specific passenger — but seat redemption itself has no 3,000-point minimum (that only applies to fare/baggage redemption).",
    wrong: [
      "No verification needed since it's just a points balance check.",
      "The 3,000-point minimum applies to seat redemption too, so it must be checked first.",
      "Points balance and redemption can be handled with just a name, no further verification.",
    ],
  },
  {
    text: "A grieving family calls about transporting a deceased relative on a 9P flight departing in 3 hours, and they're missing the police NOC. What applies?",
    correct: "Lead with empathy first. All five required documents (attendant ticket, attested death certificate + CNIC, coffin box certificate, police NOC, deceased's CNIC) are needed, and reporting is 1 hour before departure at cargo — advise them to obtain the NOC urgently and consider escalating via Teams given the tight timeline.",
    wrong: [
      "Proceed without the NOC since the other four documents are present.",
      "This can wait until the next available flight since the NOC is missing.",
      "The reporting deadline is 3 hours before departure, same as normal check-in, so there's still time.",
    ],
  },
];

interface QuizDef {
  title: string;
  description: string;
  timeLimitMinutes: number;
  order: number;
  questions: QuestionSeed[];
}

const QUIZZES: QuizDef[] = [
  {
    title: "Quiz 1 — Days 1–2 Recap",
    description: "Covers Modules 1–8: verification, ticket types, booking basics, visas, modification/cancellation, baggage fundamentals, onboard extras, and airport day. Taken at the start of Day 3.",
    timeLimitMinutes: 30,
    order: 1,
    questions: QUIZ_1,
  },
  {
    title: "Quiz 2 — Days 3–4 Recap",
    description: "Covers Modules 9–16: disruptions, cargo/groups, AirRewards, baggage claims, fare bundles, excess baggage, name changes, and TV handling. Taken at the start of Day 5.",
    timeLimitMinutes: 30,
    order: 2,
    questions: QUIZ_2,
  },
  {
    title: "Final Exam — All 20 Modules",
    description: "Comprehensive final assessment across every module, plus 5 cross-module capstone scenarios. Taken at the end of Day 5.",
    timeLimitMinutes: 60,
    order: 3,
    questions: QUIZ_3,
  },
];

async function main() {
  for (const quizDef of QUIZZES) {
    const existing = await prisma.quiz.findFirst({ where: { title: quizDef.title } });
    if (existing) {
      console.log(`Skip (already exists): ${quizDef.title}`);
      continue;
    }

    await prisma.quiz.create({
      data: {
        title: quizDef.title,
        description: quizDef.description,
        timeLimitMinutes: quizDef.timeLimitMinutes,
        passingScore: 70,
        showAnswers: true,
        status: "Draft",
        order: quizDef.order,
        questions: {
          create: quizDef.questions.map((q, qi) => {
            const choices = shuffle([
              { text: q.correct, isCorrect: true },
              { text: q.wrong[0], isCorrect: false },
              { text: q.wrong[1], isCorrect: false },
              { text: q.wrong[2], isCorrect: false },
            ]);
            return {
              text: q.text,
              order: qi,
              points: 1,
              choices: {
                create: choices.map((c, ci) => ({ text: c.text, isCorrect: c.isCorrect, order: ci })),
              },
            };
          }),
        },
      },
    });

    console.log(`Created quiz: ${quizDef.title} (${quizDef.questions.length} questions)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
