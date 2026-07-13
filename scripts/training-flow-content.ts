// Shared content for the Training-flow rebuild — used by both the direct-DB
// script (scripts/rebuild-training-flow.ts) and the browser-automation script
// (scripts/publish-training-flow-via-admin.ts).

export const AUTHOR = "Nourhan Khaled";
export const TRAINING_CATEGORY_ID = 9;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export interface ModuleSpec {
  title: string;
  description: string;
  overview: string;
  procedures?: { title?: string; content: string; image?: string }[];
  scenarios?: { situation: string; response: string }[];
  notes?: { type?: string; content: string }[];
  keywords?: string[];
}

// ---------------------------------------------------------------------------
// A new Champion's first days on the phones, told as one connected flow.
// Facts are drawn from the site's existing knowledge base (scripts/seed-kb-
// content.ts and scripts/kb-templates/*.ts) — condensed and reframed for
// onboarding, not invented. Each module opens with a short in-story beat and
// closes with a line that hands off to the next module's topic.
// ---------------------------------------------------------------------------

export const MODULES: ModuleSpec[] = [
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
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MzAiIGhlaWdodD0iMTkwIiB2aWV3Qm94PSIwIDAgNzMwIDE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj48cmVjdCB3aWR0aD0iNzMwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjM2NSIgeT0iMzAiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4zLVF1ZXN0aW9uIFZlcmlmaWNhdGlvbiDigJQgYWxsIG11c3QgY2hlY2sgb3V0PC90ZXh0PjxyZWN0IHg9IjMwIiB5PSI3MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI5MCIgcng9IjE0IiBmaWxsPSIjZmVmMmYyIiBzdHJva2U9IiNiOTFjMWMiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHRleHQgeD0iMTI1IiB5PSIxMjAiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBhc3NlbmdlcidzIGZ1bGwgbmFtZTwvdGV4dD48bGluZSB4MT0iMjI4IiB5MT0iMTE1IiB4Mj0iMjYyIiB5Mj0iMTE1IiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHBvbHlnb24gcG9pbnRzPSIyNjIsMTA5IDI3NCwxMTUgMjYyLDEyMSIgZmlsbD0iIzZiNzI4MCIvPjxyZWN0IHg9IjI3MCIgeT0iNzAiIHdpZHRoPSIxOTAiIGhlaWdodD0iOTAiIHJ4PSIxNCIgZmlsbD0iI2ZlZjJmMiIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIuNSIvPjx0ZXh0IHg9IjM2NSIgeT0iMTExIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5GbGlnaHQgZGVzdGluYXRpb24gJmFtcDs8L3RleHQ+PHRleHQgeD0iMzY1IiB5PSIxMjkiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPmRhdGU8L3RleHQ+PGxpbmUgeDE9IjQ2OCIgeTE9IjExNSIgeDI9IjUwMiIgeTI9IjExNSIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjIuNSIvPjxwb2x5Z29uIHBvaW50cz0iNTAyLDEwOSA1MTQsMTE1IDUwMiwxMjEiIGZpbGw9IiM2YjcyODAiLz48cmVjdCB4PSI1MTAiIHk9IjcwIiB3aWR0aD0iMTkwIiBoZWlnaHQ9IjkwIiByeD0iMTQiIGZpbGw9IiNmZWYyZjIiIHN0cm9rZT0iI2I5MWMxYyIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48dGV4dCB4PSI2MDUiIHk9IjEyMCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzExMTgyNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TW9iaWxlIG51bWJlciBvciBlbWFpbDwvdGV4dD48L3N2Zz4=",
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
      {
        title: "Classifying passengers",
        content: "Age as of the travel date decides the fare: 12+ Adult, 2–11 Child, under 2 Infant.",
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MzAiIGhlaWdodD0iMTkwIiB2aWV3Qm94PSIwIDAgNzMwIDE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj48cmVjdCB3aWR0aD0iNzMwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjM2NSIgeT0iMzAiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UaWNrZXQgdHlwZSBieSBhZ2Ugb24gdGhlIHRyYXZlbCBkYXRlPC90ZXh0PjxyZWN0IHg9IjMwIiB5PSI3MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI5MCIgcng9IjE0IiBmaWxsPSIjZmVmMmYyIiBzdHJva2U9IiNiOTFjMWMiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHRleHQgeD0iMTI1IiB5PSIxMjAiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPlVuZGVyIDIg4oCUIEluZmFudDwvdGV4dD48bGluZSB4MT0iMjI4IiB5MT0iMTE1IiB4Mj0iMjYyIiB5Mj0iMTE1IiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHBvbHlnb24gcG9pbnRzPSIyNjIsMTA5IDI3NCwxMTUgMjYyLDEyMSIgZmlsbD0iIzZiNzI4MCIvPjxyZWN0IHg9IjI3MCIgeT0iNzAiIHdpZHRoPSIxOTAiIGhlaWdodD0iOTAiIHJ4PSIxNCIgZmlsbD0iI2ZlZjJmMiIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIuNSIvPjx0ZXh0IHg9IjM2NSIgeT0iMTIwIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4yIHRvIDExIOKAlCBDaGlsZDwvdGV4dD48bGluZSB4MT0iNDY4IiB5MT0iMTE1IiB4Mj0iNTAyIiB5Mj0iMTE1IiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHBvbHlnb24gcG9pbnRzPSI1MDIsMTA5IDUxNCwxMTUgNTAyLDEyMSIgZmlsbD0iIzZiNzI4MCIvPjxyZWN0IHg9IjUxMCIgeT0iNzAiIHdpZHRoPSIxOTAiIGhlaWdodD0iOTAiIHJ4PSIxNCIgZmlsbD0iI2ZlZjJmMiIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIuNSIvPjx0ZXh0IHg9IjYwNSIgeT0iMTIwIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xMiBhbmQgdXAg4oCUIEFkdWx0PC90ZXh0Pjwvc3ZnPg==",
      },
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
    title: "Module 3: Booking Basics — Accel Aero Walkthrough, Payment Channels & Credit Vouchers",
    description:
      "A screen-by-screen walkthrough of building a new booking in Accel Aero, the payment channels available by country, and how to apply an existing credit voucher to a new booking.",
    overview:
      "Time to actually build a booking. The 14 steps below are a real, screen-by-screen walkthrough of Accel Aero — from searching flights through to reading a PNR's history — worth working through slowly the first few times.\n\nOnce it's built, it needs paying for. Payment channels differ by market — Installments, Book Now Pay Later, or a local method like Mada, KNET, UPI or iDeal depending on where the passenger's based — and every one of them carries a small, mandatory-to-disclose charge. Sometimes the passenger isn't paying fresh, either — they're using credit from a previous booking, which is a name-matching exercise as much as a payment one.\n\nNext: what happens when the booking itself needs to change.",
    procedures: [
      {
        title: "Making a new booking in Accel Aero — 1. Search flights",
        content: "Enter origin, destination and dates, then run the search to see available flights and fares.",
        image: "/uploads/1783880038872-01-search-flights.png",
      },
      {
        title: "Making a new booking in Accel Aero — 2. Data collection",
        content: "Collect passenger count and basic trip details before selecting a flight.",
        image: "/uploads/1783880039592-02-data-collection.png",
      },
      {
        title: "Making a new booking in Accel Aero — 3. Flight details",
        content: "Confirm the selected flight's details with the passenger before proceeding.",
        image: "/uploads/1783880040424-03-flight-details.png",
      },
      {
        title: "Making a new booking in Accel Aero — 4. Ticket price",
        content: "Review the fare breakdown and total ticket price before moving to passenger info.",
        image: "/uploads/1783880041289-04-ticket-price.png",
      },
      {
        title: "Making a new booking in Accel Aero — 5. Passenger info",
        content: "Enter each passenger's name and details exactly as they appear on their travel document.",
        image: "/uploads/1783880042138-05-passenger-info.png",
      },
      {
        title: "Making a new booking in Accel Aero — 6. Contact details",
        content: "Add a mobile number and email so the booking has a valid contact detail on file — needed later for caller verification.",
        image: "/uploads/1783880042927-06-contact-details.png",
      },
      {
        title: "Making a new booking in Accel Aero — 7. Loading passenger info",
        content: "Let the system load and validate the passenger information before continuing.",
        image: "/uploads/1783880043722-07-loading-passenger-info.png",
      },
      {
        title: "Making a new booking in Accel Aero — 8. Ancillaries",
        content: "Offer and add any ancillaries the passenger wants — baggage, seat, meal, insurance — before payment.",
        image: "/uploads/1783880044527-08-ancillaries.png",
      },
      {
        title: "Making a new booking in Accel Aero — 9. Editing name/nationality",
        content: "If a name or nationality needs correcting before ticketing, edit it here — this is the pre-payment window to fix simple errors.",
        image: "/uploads/1783880045343-09-editing-name-nationality.png",
      },
      {
        title: "Making a new booking in Accel Aero — 10. Editing ancillaries",
        content: "Ancillaries already added can be changed here before the booking is finalized.",
        image: "/uploads/1783880046202-10-editing-ancillaries.png",
      },
      {
        title: "Making a new booking in Accel Aero — 11. Split passengers",
        content: "Use this when part of a group booking needs to be split into a separate PNR.",
        image: "/uploads/1783880046926-11-split-passengers.png",
      },
      {
        title: "Making a new booking in Accel Aero — 12. Adding an infant",
        content: "Add an infant passenger under the accompanying adult — remember infants get no checked baggage allowance.",
        image: "/uploads/1783880047727-12-adding-infant.png",
      },
      {
        title: "Making a new booking in Accel Aero — 13. Removing an infant",
        content: "Use this screen if an infant needs to be removed from an existing booking.",
        image: "/uploads/1783880048527-13-removing-infant.png",
      },
      {
        title: "Making a new booking in Accel Aero — 14. Reading booking history",
        content: "Check a PNR's history to see everything that's already happened on it before making a new change.",
        image: "/uploads/1783880049306-14-reading-history.png",
      },
      {
        title: "Payment channels",
        content:
          "Installments (UAE, KSA, Egypt — select routes); Book Now Pay Later (cash at offices, travel agents, airports, partner banks, exchange houses, retail chains, post offices); market-specific options — Mada (KSA), KNET (Kuwait), RuPay/UPI (India), iDeal (Netherlands), Bancontact (Belgium), Sofort (Germany), Internet/Mobile Banking (Morocco, India).",
        image: "/uploads/1783879088637-office-payment.png",
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
        image: "/uploads/1783879087775-manage-booking-pay.png",
      },
      {
        title: "Partial credit",
        content:
          "If the credit doesn't cover the full fare, send a payment link for the remaining balance — the booking shows as forced (CNF forced), and if that link isn't paid, cancellation charges apply. Make sure the passenger understands this before you hang up.",
        image: "/uploads/1783879089451-payment-link.png",
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
      "Every so often a routine booking call turns out to be something else — a same-day return that's actually a visa run. Here's how to spot it and what to do next.\n\nAir Arabia doesn't process visa applications. For a UAE visa, any Air Arabia office can help; for anywhere else, the passenger needs the relevant consulate or embassy.\n\nWith bookings sorted and eligibility covered, the next thing every Champion needs is what happens when plans change.",
    procedures: [
      {
        title: "Visa questions",
        content: "Direct passengers to the relevant authority — any Air Arabia office for a UAE visa, or the consulate/embassy for any other visa. Air Arabia does not process visa applications itself.",
      },
      { title: "Spotting a visa-change (VFR) request", content: "When a passenger requests a same-day return ticket, ask whether it's for a visa change." },
      {
        title: "Handling a VFR booking",
        content: "Visa-change tickets can't be booked, modified, or cancelled from the Call Center — the passenger must visit an Air Arabia office. These are marked VFR in Accel Aero.",
        image: "/uploads/1783879100516-visachange-vfr.png",
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
      { title: "Modification — 1. Verification", content: "Collect the PNR and confirm all 3 verification questions (passenger name, flight destination & date, one contact detail)." },
      { title: "Modification — 2. Data collection", content: "Confirm whether the modification is for all passengers on the PNR, and which segment is affected." },
      { title: "Modification — 3. First recap", content: "Read back the current flight details to the passenger." },
      {
        title: "Modification — 4. Ancillary",
        content: "Check whether previously selected ancillaries carry forward automatically to the new flight.",
        image: "/uploads/1783878442370-modcancel-04-ancillary-carryforward.png",
      },
      {
        title: "Modification — 5. Charges",
        content: "Quote the balance per passenger under \"Balance,\" then the total amount due.",
        image: "/uploads/1783878442672-modcancel-05-charges-balance.png",
      },
      { title: "Modification — 6. Terms & conditions", content: "Explain that the previous date is cancelled, the new date is confirmed, and payment is due before the new segment can be used." },
      {
        title: "Modification — 7. Final recap",
        content: "Confirm the new flight details back to the passenger.",
        image: "/uploads/1783878443023-modcancel-07-final-recap.png",
      },
      {
        title: "Modification — 8. Payment",
        content: "Send the offline payment link.",
        image: "/uploads/1783878443296-modcancel-08-payment-link.png",
      },
      { title: "Modification — 9. Confirmation", content: "Ask the passenger to double-check the new travel dates are correct." },
      { title: "Cancellation — 1. Verification", content: "Collect the PNR and confirm all 3 verification questions." },
      { title: "Cancellation — 2. Data collection", content: "Confirm whether the cancellation is for all passengers, and which segment." },
      {
        title: "Cancellation — 3. Terms & conditions",
        content: "Check the original payment date and payment method — these affect what's owed/returned, and any refund goes back to the original payment method.",
        image: "/uploads/1783878443625-modcancel-12-refund-original-payment.png",
      },
      {
        title: "Cancellation — 4. Credit details",
        content: "Confirm the credit amount and its expiry date with the passenger.",
        image: "/uploads/1783878443925-modcancel-13-credit-details.png",
      },
      { title: "Cancellation — 5. Confirmation", content: "Send the cancellation confirmation by email." },
    ],
    scenarios: [
      {
        situation: "A Champion quotes charges before checking whether ancillaries carried forward.",
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
        image: "/uploads/checked-baggage-dimensions.png",
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
      {
        title: "Front-row seating",
        content: "Extra legroom, and the only row eligible for a baby bassinet request (subject to availability).",
        image: "/uploads/1783879081009-frontrow-exit-layout.jpeg",
      },
      {
        title: "Exit row seating",
        content: "Passenger must be over 16, not pregnant, in good health, and able to assist in an emergency if instructed by crew.",
        image: "/uploads/1783879080112-exit-seat-screen.png",
      },
      {
        title: "SkyTime",
        content:
          "Free onboard entertainment on the passenger's own device. After take-off, connect to the SkyTime Wi-Fi network and log in with email + seat number — movies, TV, music and games included free. Power banks and headsets are available onboard at an extra charge.",
      },
      {
        title: "Travel insurance — Gold vs Platinum",
        content:
          "Both Tune Protect plans include Accidental Death & Disablement (USD 20,000), medical reimbursement (up to USD 50,000), hospital allowance, and 24/7 emergency assistance. Platinum adds loss of documents/money, travel delay, missed departure, cancellation, baggage delay/loss, home protection and mugging cover. Coverage runs from departure to return date, maximum 90 days — changing the return date doesn't automatically update the policy.",
        image: "/uploads/1783879086916-insurance-tab.png",
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
        image: "/uploads/1783879078486-checkin-options.png",
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
        image: "/uploads/1783879073278-bus-service-accelaero.png",
      },
      {
        title: "Wheelchair assistance",
        content:
          "Arranged through the airport's own service provider, not Air Arabia directly — personal wheelchairs can't be used within the airport. Any charge is assessed at check-in based on the passenger's situation. Recommend requesting as early as possible.",
        image: "/uploads/1783879101315-wheelchair-ssr.png",
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
        image: "/uploads/1783879753505-noshow-history.png",
      },
      {
        title: "Flight change entitlements",
        content:
          "Delay/advance under 2 hours: no free entitlements. 2–4 hours: free rebooking and free cancellation, no refund. Over 4 hours, or a commercial/operational cancellation: free rebooking, cancellation and refund. Force majeure (weather, airspace closure): free rebooking and cancellation, no refund (except 9P Domestic).",
      },
      { title: "Passenger-initiated rebooking", content: "Free within ±7 days of the original date. Beyond that window, only the fare difference applies." },
      {
        title: "Handling a disruption — 1. Identify the alert",
        content: "Spot the disruption alert on the booking before doing anything else — it drives every step that follows.",
        image: "/uploads/1783879094514-resched-identify-alert.png",
      },
      {
        title: "Handling a disruption — 2. Check the Accel Aero flag",
        content: "Confirm the disruption is flagged on the booking in Accel Aero.",
        image: "/uploads/1783879091146-resched-accelaero-flag.png",
      },
      {
        title: "Handling a disruption — 3. Passenger notification",
        content: "Check whether the passenger has already been notified of the change.",
        image: "/uploads/1783879095366-resched-notification.png",
      },
      {
        title: "Handling a disruption — 4. Confirm via Caesar",
        content: "Cross-check the schedule change against the hub's Caesar link to confirm it's real and current.",
        image: "/uploads/1783879092831-resched-caesar.png",
      },
      {
        title: "Handling a disruption — 5. Escalate via Teams if needed",
        content: "If anything doesn't add up or needs another team, escalate via Teams the same way you would for any urgent case.",
        image: "/uploads/1783879096994-resched-teams.png",
      },
      {
        title: "Handling a disruption — 6. Action the alert",
        content: "Work through the entitlement (rebooking, cancellation, refund) that matches the disruption type.",
        image: "/uploads/1783879092013-resched-action-alert.png",
      },
      {
        title: "Handling a disruption — 7. Search for a transfer flight",
        content: "If rebooking, search for the passenger's replacement flight.",
        image: "/uploads/1783879096197-resched-search-transfer.png",
      },
      {
        title: "Handling a disruption — 8. Clear the alert",
        content: "Once everything is actioned, clear the alert so it doesn't sit open on the booking.",
        image: "/uploads/1783879093690-resched-clear-alert.png",
      },
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
        image: "/uploads/1783879081855-groupbooking-criteria.png",
      },
      {
        title: "Identifying a group booking",
        content: "10+ passengers; any passenger name shown as \"TBA\"; an Accel Aero note confirming it's a group; or the booking was created by \"Groups User.\"",
        image: "/uploads/1783879082724-groupbooking-verify.png",
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
        image: "/uploads/1783878442055-airrewards-registration-accelaero.png",
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
      "Not every call is about what's coming up — some are about what already went wrong. These calls need a different instinct: fix the timing-sensitive stuff fast, and lead every complaint with empathy before policy.\n\nBaggage claims are location- and time-sensitive — reported at the arrival airport, at the time of arrival, full stop. Complaints are broader, but they all start the same way: listen, acknowledge, then act.\n\nEverything so far has applied across every hub the same way. From here, the ground shifts — G9, 3O, 9P and E5 each run their own bundle fares, baggage rates, name-change rules and more, and that's the next stretch of the job.",
    procedures: [
      {
        title: "Reporting baggage claims",
        content: "Damaged, lost, or delayed baggage must be reported at the arrival airport's baggage services desk, at the time of arrival — not by phone or email afterward.",
      },
      {
        title: "Complaint handling approach",
        content:
          "Listen and show empathy first, then acknowledge the inconvenience. Offer a solution, escalate to a supervisor, or raise a case, depending on the complaint type: AirRewards, Booking issues, Business Class downgrade, Call Center complaints, Flight delay & cancellation, Holiday booking complaints, Onboard services, Payment issues, Staff behavior.",
        image: "/uploads/1783879079290-complaint-quality-case.png",
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
    title: "Module 13: Fare Bundles by Hub — G9, 3O & 9P",
    description: "How Basic/Value/Ultimate bundle fares differ across G9, 3O and 9P — baggage, seating, meals, and modification/cancellation terms for each.",
    overview:
      "Same three tiers — Basic, Value, Ultimate — but the numbers change hub by hub, and mixing them up is an easy mistake to make. Basic always charges baggage/seat/meal separately and has the tightest change window; Ultimate is always the most flexible, with the biggest baggage allowance, best seat choice, a hot meal, and included priority check-in. Value sits in between.\n\nWhat changes is the fine print: currencies, exact fees, and cut-off windows differ by hub — and by domestic vs. international within 9P and 3O.\n\nOnce the bundle is sorted, the next question is almost always what it costs to go over the baggage that came with it.",
    procedures: [
      {
        title: "G9 Bundle Fares",
        content:
          "Basic: baggage/seat/meal at a charge, AED 200 modification fee (24h), AED 200 cancellation fee for credit or AED 200 more for refund (24h). Value: 20/30kg baggage, free seat from row 8+, sandwich + water, 1 free modification (24h), AED 100 cancellation credit or AED 300 refund. Ultimate: 30/40kg baggage, any seat row 2+, hot meal, 2 free modifications (8h), free cancellation credit or AED 200 refund, priority check-in included. Effective 15 Jan 2026; not applicable on Cairo routes.",
        image: "/uploads/g9-bundle-fares.png",
      },
      {
        title: "3O Bundle Fares — Domestic vs International",
        content:
          "Separate charts by currency: International in EUR, Domestic in MAD. International Basic: modification €40, cancellation credit €50 (72h), no refund. International Ultimate: 25kg baggage, 2 free modifications (8h), free cancellation credit or €40 refund, priority check-in included. Domestic follows the same 3-tier shape at MAD figures with shorter windows (Value 12h, Ultimate 8h).",
        image: "/uploads/3o-bundle-fares-international.png",
      },
      {
        title: "9P Bundle Fares — Domestic vs International",
        content:
          "Domestic in PKR, International in AED. Domestic Ultimate: 46kg baggage, 2 free modifications (8h), free cancellation credit or PKR 7,000 refund. International Ultimate: 40kg baggage, same 2 free modifications (8h), free cancellation credit or AED 200 refund. Only discuss the modification/cancellation cut-off and what's included on a call — full T&Cs aren't for the phone.",
        image: "/uploads/1783879751130-9p-bundle-chart-intl.png",
      },
    ],
    scenarios: [
      {
        situation: "A passenger asks what's included in G9 Ultimate.",
        response: "30/40kg baggage, any seat from row 2+, a hot meal, 2 free modifications (up to 8h before departure), and included priority check-in.",
      },
      {
        situation: "A 3O domestic Basic passenger wants to modify 80 hours before departure.",
        response: "Within the window — Basic domestic modification is allowed up to 72 hours prior, so 80 hours out is fine; quote the MAD fee from the chart.",
      },
      {
        situation: "A 9P passenger quotes a PKR fee but is flying an international sector.",
        response: "International 9P fares are in AED, not PKR — confirm domestic vs international before quoting, since the two use entirely different currency charts.",
      },
    ],
    notes: [{ type: "Information", content: "G9 bundles don't split by domestic/international like 3O and 9P do — confirm which structure applies before quoting a chart." }],
    keywords: ["bundle fares", "G9", "3O", "9P", "basic", "value", "ultimate"],
  },
  {
    title: "Module 14: Excess Baggage Rates by Hub",
    description: "How excess baggage is priced per kg on G9, 9P and 3O, and where to check E5's current rates.",
    overview:
      "Every hub bills excess weight differently, and getting the wrong figure on a call is one of the fastest ways to end up in a quality case. G9 prices per kg by destination zone and whether the passenger is flying point-to-point or connecting; 9P splits by domestic vs international-departing vs international-arriving; 3O splits by direction (from/to Morocco) with different currencies each way.\n\nWhen in doubt, confirm destination and direction first — the rate table only makes sense once those two are pinned down.\n\nBaggage rates sorted, the next set of hub differences is about the passenger's own name on the ticket.",
    procedures: [
      {
        title: "G9 excess baggage",
        content:
          "Priced per kg by destination zone (GCC/KSA, Africa, Egypt/Sudan, India, Iran/Iraq, Levant, Sub-Continent, CIS, Turkey, Europe, Far East, Morocco), and by whether the journey is point-to-point (to/from UAE), connecting to GCC, or connecting elsewhere — connecting routes cost more. Example: Sub-Continent point-to-point is AED 60/kg. No-baggage-fare customers: first 20kg flat AED 100, extra piece AED 50. No carton boxes accepted on flights to Bangladesh, regardless of willingness to pay.",
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MzAiIGhlaWdodD0iMTkwIiB2aWV3Qm94PSIwIDAgNzMwIDE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj48cmVjdCB3aWR0aD0iNzMwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjM2NSIgeT0iMzAiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FeGNlc3MgYmFnZ2FnZSDigJQgY29uZmlybSBiZWZvcmUgcXVvdGluZzwvdGV4dD48cmVjdCB4PSIzMCIgeT0iNzAiIHdpZHRoPSIxOTAiIGhlaWdodD0iOTAiIHJ4PSIxNCIgZmlsbD0iI2ZlZjJmMiIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIuNSIvPjx0ZXh0IHg9IjEyNSIgeT0iMTIwIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db25maXJtIGRlc3RpbmF0aW9uPC90ZXh0PjxsaW5lIHgxPSIyMjgiIHkxPSIxMTUiIHgyPSIyNjIiIHkyPSIxMTUiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48cG9seWdvbiBwb2ludHM9IjI2MiwxMDkgMjc0LDExNSAyNjIsMTIxIiBmaWxsPSIjNmI3MjgwIi8+PHJlY3QgeD0iMjcwIiB5PSI3MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI5MCIgcng9IjE0IiBmaWxsPSIjZmVmMmYyIiBzdHJva2U9IiNiOTFjMWMiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHRleHQgeD0iMzY1IiB5PSIxMTEiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBvaW50LXRvLXBvaW50IG9yPC90ZXh0Pjx0ZXh0IHg9IjM2NSIgeT0iMTI5IiBmb250LXNpemU9IjE0IiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5jb25uZWN0aW5nPzwvdGV4dD48bGluZSB4MT0iNDY4IiB5MT0iMTE1IiB4Mj0iNTAyIiB5Mj0iMTE1IiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHBvbHlnb24gcG9pbnRzPSI1MDIsMTA5IDUxNCwxMTUgNTAyLDEyMSIgZmlsbD0iIzZiNzI4MCIvPjxyZWN0IHg9IjUxMCIgeT0iNzAiIHdpZHRoPSIxOTAiIGhlaWdodD0iOTAiIHJ4PSIxNCIgZmlsbD0iI2ZlZjJmMiIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIuNSIvPjx0ZXh0IHg9IjYwNSIgeT0iMTExIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BcHBseSB0aGUgbWF0Y2hpbmc8L3RleHQ+PHRleHQgeD0iNjA1IiB5PSIxMjkiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPnBlci1rZyByYXRlPC90ZXh0Pjwvc3ZnPg==",
      },
      {
        title: "9P excess baggage",
        content:
          "Three separate tables: Domestic (PKR, e.g. 1st piece 23kg PKR 3,800, excess PKR 200/kg), International departing Pakistan (higher PKR figures), International arriving Pakistan (AED, direct AED 60/kg vs connecting AED 70/kg). Max oversize dimension 305cm. Carton boxes accepted departing Pakistan (PKR 3,800) but not accepted arriving Pakistan (N/A).",
      },
      {
        title: "3O excess baggage",
        content:
          "From Morocco: MAD 120/kg to Europe/Turkey, MAD 250/kg to UAE, MAD 50/kg domestic. To Morocco: priced in the destination's own currency (EUR/GBP/CHF), e.g. €12/kg from Europe. No-baggage-fare first 20kg: from MAD 300 (domestic) up to MAD 1,200 (to UAE). No restriction on number of pieces.",
      },
      {
        title: "E5 excess baggage",
        content: "Priced per kg by destination from/to Egypt, same shape as the other hubs — check the live Excess Baggage Rates – E5 article or the shared rate workbook for the current figures before quoting.",
      },
    ],
    scenarios: [
      {
        situation: "A G9 passenger flying direct UAE to Pakistan asks the excess rate.",
        response: "Sub-Continent point-to-point: AED 60 per kg, plus airport handling fees.",
      },
      {
        situation: "A 9P passenger arriving in Pakistan on a connecting flight asks the excess rate.",
        response: "AED 70 per kg for a connecting arrival into Pakistan — AED 60 per kg if it were direct instead.",
      },
      {
        situation: "A 3O no-baggage-fare passenger flying Casablanca to Turkey asks about their first 20kg.",
        response: "MAD 800 flat for the first 20kg, with no restriction on the number of pieces within that weight.",
      },
    ],
    notes: [{ type: "Information", content: "Always confirm exact destination and direction (point-to-point vs connecting, from vs to) before quoting — the same passenger's rate can change materially based on either." }],
    keywords: ["excess baggage", "rates", "G9", "9P", "3O", "E5"],
  },
  {
    title: "Module 15: Name Changes & Corrections by Hub",
    description: "G9, 9P and 3O name-change fees and eligibility, plus 3O's 5-case name-correction decision flow.",
    overview:
      "Two different things get called \"name change\" and they're handled completely differently: a paid name change (a different passenger, essentially) versus a free spelling correction (the same passenger, fixed). G9 and 9P follow the same shape — paid changes need 24 hours' notice and a fee plus fare difference; credit-based changes are restricted to immediate family with proof; spelling fixes go straight to a supervisor, free.\n\n3O breaks this into five distinct cases with their own do/don't rules — worth knowing in detail, since getting the wrong case wrong is an easy quality-case trigger.\n\nName changes handled, what a passenger can bring with them — and what needs special handling — is next.",
    procedures: [
      {
        title: "G9 & 9P name change (same shape)",
        content:
          "Paid by card/cash: 24 hours before first-sector departure, AED 350/PKR 3,500 per passenger + fare difference. Paid via previous credit: immediate family only, same 24h notice, same fee — raise a Sprinklr case and request proof of relationship. Free spelling amendments (e.g. married name change): send directly to a Supervisor, not Sprinklr.",
        image: "/uploads/1783879752702-namechange-screen.png",
      },
      {
        title: "3O name correction — cases 1–3 (free)",
        content:
          "1. Spelling correction — free, raise a DS Form directly, no manager approval needed. 2. AirRewards ID correction — free, but only if the ID is already visible in Accelaero. 3. Spouse/family name — free, raise an SP case, requires marriage certificate.",
        image: "/uploads/3o-namecorrection-1to3.png",
      },
      {
        title: "3O name correction — cases 4–5 (charge / not permitted)",
        content:
          "4. First/last name wrong — charge applies, requires passport number + DOB already on Accelaero, raise SP case with proof documents, 24h reply. 5. Total name change — not permitted at all (ticket is nominative); offer alternatives like a refund depending on the fare bundle.",
        image: "/uploads/3o-namecorrection-4to5.png",
      },
      {
        title: "3O urgent same-day cases",
        content: "Cases 1–3 on a same-day flight: escalate via Teams immediately and follow up until resolved. Manager support is reserved for genuinely urgent, exceptional, or non-standard cases only — not routine ones.",
      },
    ],
    scenarios: [
      {
        situation: "A G9 passenger wants a name change 10 hours before departure.",
        response: "Not possible through this channel — name changes need at least 24 hours' notice before the first sector's departure. Escalate to check for an airport-level exception.",
      },
      {
        situation: "A 3O passenger's AirRewards ID correction request comes in, but the ID isn't visible in Accelaero.",
        response: "Don't raise the case yet — the free AirRewards correction (case 2) requires the ID to already be confirmed in Accelaero. Verify it there first.",
      },
      {
        situation: "A 9P passenger wants to use a sibling's credit for a name change.",
        response: "Siblings count as immediate family, so it's permitted — raise a Sprinklr case and request proof of relationship before processing.",
      },
    ],
    notes: [{ type: "Warning", content: "Never confuse a paid name change (different passenger) with a free spelling correction (same passenger) — they go to completely different queues." }],
    keywords: ["name change", "name correction", "G9", "9P", "3O", "spelling correction"],
  },
  {
    title: "Module 16: TV Handling & Cargo Support by Hub",
    description: "Rules for carrying a TV as checked baggage on E5 and G9, and cargo/trade contacts for G9, 3O and E5.",
    overview:
      "Two more things that vary by hub but follow a recognizable pattern once you've seen it once: TVs travel free under a size threshold, cost a flat fee in a middle band, and aren't accepted past a maximum size at all. Cargo and trade questions, meanwhile, almost never get handled by the Call Center directly — the job is knowing exactly which contact to hand off to.\n\nWith hub differences covered, a few special, less-common cases are worth knowing before the story wraps up.",
    procedures: [
      {
        title: "TV handling — G9",
        content: "Counted as 1 baggage piece, no limit on number of TVs. Under 40in: no extra charge. 40–60in: AED 150 + airport handling fee. Over 60in: not allowed.",
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MzAiIGhlaWdodD0iMTkwIiB2aWV3Qm94PSIwIDAgNzMwIDE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj48cmVjdCB3aWR0aD0iNzMwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjM2NSIgeT0iMzAiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UViBoYW5kbGluZyDigJQgY2hlY2sgdGhlIHNpemUgYmFuZDwvdGV4dD48cmVjdCB4PSIzMCIgeT0iNzAiIHdpZHRoPSIxOTAiIGhlaWdodD0iOTAiIHJ4PSIxNCIgZmlsbD0iI2ZlZjJmMiIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIuNSIvPjx0ZXh0IHg9IjEyNSIgeT0iMTIwIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VbmRlciA0MGluIOKAlCBmcmVlPC90ZXh0PjxsaW5lIHgxPSIyMjgiIHkxPSIxMTUiIHgyPSIyNjIiIHkyPSIxMTUiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48cG9seWdvbiBwb2ludHM9IjI2MiwxMDkgMjc0LDExNSAyNjIsMTIxIiBmaWxsPSIjNmI3MjgwIi8+PHJlY3QgeD0iMjcwIiB5PSI3MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI5MCIgcng9IjE0IiBmaWxsPSIjZmVmMmYyIiBzdHJva2U9IiNiOTFjMWMiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHRleHQgeD0iMzY1IiB5PSIxMTEiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPjQw4oCTNjBpbiDigJQgZmxhdCBmZWU8L3RleHQ+PHRleHQgeD0iMzY1IiB5PSIxMjkiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPmFwcGxpZXM8L3RleHQ+PGxpbmUgeDE9IjQ2OCIgeTE9IjExNSIgeDI9IjUwMiIgeTI9IjExNSIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjIuNSIvPjxwb2x5Z29uIHBvaW50cz0iNTAyLDEwOSA1MTQsMTE1IDUwMiwxMjEiIGZpbGw9IiM2YjcyODAiLz48cmVjdCB4PSI1MTAiIHk9IjcwIiB3aWR0aD0iMTkwIiBoZWlnaHQ9IjkwIiByeD0iMTQiIGZpbGw9IiNmZWYyZjIiIHN0cm9rZT0iI2I5MWMxYyIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48dGV4dCB4PSI2MDUiIHk9IjEyMCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzExMTgyNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T3ZlciA2MGluIOKAlCBub3QgYWNjZXB0ZWQ8L3RleHQ+PC9zdmc+",
      },
      {
        title: "TV handling — E5",
        content: "Under 40in: free. 40–60in: EGP 2,000 per TV + airport handling fees. Maximum accepted size: 60in.",
      },
      {
        title: "TV handling — 9P & 3O",
        content: "Follow the same under-40/40-60/over-60 shape as G9 and E5, at their own local rates — check the hub-specific TV Handling article for the current figures before quoting.",
      },
      {
        title: "Cargo & trade contacts — G9 (Sharjah)",
        content: "SAS Export Counter: 06-514-1174, 24/7. SAS Import Counter: 06-514-1188 or 06-514-1189, 24/7.",
      },
      {
        title: "Cargo & trade contacts — 3O (Morocco)",
        content: "Cargo booking: +212 666 28 49 02 / maccargobooking@airarabia.com. UAE Sales Support: trade@airarabia.com / 600 50 8002 (9am–10pm). Country-specific trade-support emails exist per market (Spain, Belgium, France, Netherlands, UK & Ireland, Germany, Switzerland, Morocco, Italy) plus a dedicated Turkey contact (info@airarabiaturkey.com) separate from the general line.",
      },
      {
        title: "Cargo & trade contacts — E5 (Egypt)",
        content: "Check the live Cargo & Trade Contacts – E5 article for the current export/import and trade-support numbers before directing a passenger.",
      },
    ],
    scenarios: [
      { situation: "A G9 passenger wants to check in three 45-inch TVs.", response: "Permitted — no limit on number of TVs. Each is AED 150 plus airport handling fee, and each counts as one baggage piece." },
      { situation: "An E5 passenger wants to check a 65-inch TV.", response: "Not accepted — E5's maximum accepted TV size is 60 inches." },
      { situation: "A travel agent in Turkey asks for their 3O support contact instead of the general UAE line.", response: "Turkey has its own dedicated contact, info@airarabiaturkey.com, separate from the general UAE Sales Support line." },
    ],
    keywords: ["TV handling", "cargo", "trade support", "G9", "E5", "3O"],
  },
  {
    title: "Module 17: Hub-Specific Services — Falcons, Discounts, Holidays & Check-in Variants",
    description: "G9-exclusive services (falcons, card discounts, holiday packages, Sharjah airport services, Ok to Board) and 3L/G9/Sharjah check-in variants.",
    overview:
      "A handful of services only exist on specific hubs, and knowing they exist — even if you're not the one who processes them — is what keeps a call from stalling out. G9 alone carries falcons, offers card-based fare discounts, sells holiday packages, and runs a premium airport-services desk at Sharjah. Abu Dhabi and Sharjah passengers also get check-in options nobody else has: early check-in at city locations, and full home check-in.\n\nA few genuinely rare situations round out the hub picture before the wrap-up.",
    procedures: [
      {
        title: "Pets & Animals (Falcons) — G9 only",
        content: "No pets or animals on any Air Arabia flight, except falcons on G9. Book on Basic fare with no added services, via Accel Aero, at least 48 hours before departure. No baggage allowance is added for a falcon's seat. Add a User Note in Accel Aero: \"Passenger is Travelling with Falcon.\"",
        image: "/uploads/1783879090329-pets-usernotes.png",
      },
      {
        title: "Special Discounts — G9",
        content: "Homat Al Watan, Fazaa & Waffer: 10% off Ultimate Bundle fare/surcharge (Business/Ultimate on Cairo), cardholder + spouse/children up to 18. Esaad: same 10%, cardholder + spouse/parents/children with no age limit. All valid only on departures from Abu Dhabi, RAK & Sharjah. Raise a Sprinklr case with ID + proof of relationship — never create an on-hold booking.",
        image: "/uploads/1783879099673-specialdiscount-procedure.png",
      },
      {
        title: "Air Arabia Holidays — G9 only",
        content: "Predesigned flight+hotel+transfer+tour packages. No modification permitted. Cancellation needs 72 hours' notice and results in a credit voucher only (1 year validity, usable for any passenger on the booking) — never a refund. Raise on Sprinklr; the Holidays team contacts the passenger directly.",
        image: "/uploads/1783879083558-holiday-sprinklr.png",
      },
      {
        title: "Sharjah Airport Services — 1. Departure",
        content: "Meet & Assist (Warm Welcome, Fast Track, Porter, Dedicated Check-in, Accompanied Assistance — all included) or Fast Track Services (Warm Welcome, Fast Track, Dedicated Check-in — no porter/accompanied assistance). Bookable up to 24 hours prior.",
        image: "/uploads/1783879068153-airport-svc-departure.png",
      },
      {
        title: "Sharjah Airport Services — 2. Arrival",
        content: "Meet & Assist includes Warm Welcome, Fast Track, Porter and Accompanied Assistance. Fast Track Services covers Warm Welcome and Fast Track only.",
        image: "/uploads/1783879067345-airport-svc-arrival.png",
      },
      {
        title: "Sharjah Airport Services — 3. Transit",
        content: "Warm Welcome, Fast Track and Accompanied Assistance for passengers transiting through Sharjah.",
        image: "/uploads/1783879069001-airport-svc-transit.png",
      },
      {
        title: "Sharjah Airport Services — 4. Business Lounge",
        content: "Business Centre, Wi-Fi, smoking cabin, international TV, shower room with toiletries/towels, newspapers, boarding announcements, and 24/7 food & beverage. Starting AED 145 depending on bag count.",
        image: "/uploads/shj-business-lounge.png",
      },
      {
        title: "Sharjah Airport Services — 5. Airport Transfers",
        content: "Standard Sedan, up to 4 passengers with 4 medium bags. 24/7 via call/WhatsApp +971 54 3082573 or booking@sayararental.com.",
        image: "/uploads/1783879069942-airport-transfers.png",
      },
      {
        title: "Ok to Board (OTB) — G9 & 9P",
        content: "Required for passengers travelling from India, Pakistan or Bangladesh to the UAE on a UAE visa copy. Update only at an Air Arabia office, minimum 24h prior, with visa copy + passport + PNR. Charge: free at Pakistan offices, AED 15–20 per passenger at UAE offices.",
      },
      {
        title: "Check-in variants — Abu Dhabi (3L)",
        content:
          "Early Check-in: select locations (Cruise Terminal, YAS Mall, Mussafah), from 24h prior, AED 35/25/15 (adult/child/infant). Home Check-in (via MORAFIQ): a champion visits within a 24h–5h window, priced AED 185–400 by bag count.",
        image: "/uploads/1783879084345-home-checkin-auh.png",
      },
      {
        title: "Check-in variants — Sharjah (G9)",
        content: "Home Check-in: Sharjah residents only, bookable up to 6h prior, AED 145–185 by bag count. Early Check-in: free, from 24h prior.",
        image: "/uploads/1783879085201-home-checkin-shj.png",
      },
    ],
    scenarios: [
      { situation: "A passenger wants to bring a pet cat on a G9 flight.", response: "Not possible — no pets or animals are carried on any flight; G9's only exception is falcons, under the 48-hour-advance procedure." },
      { situation: "A Fazaa cardholder wants their 10% discount on a Dubai departure.", response: "Not eligible — the discount only applies to departures from Abu Dhabi, RAK & Sharjah." },
      { situation: "A Sharjah resident wants Home Check-in booked 4 hours before departure.", response: "Too late — Sharjah Home Check-in needs 6 hours' notice. Offer the standard counter or Sharjah's free 24-hour early check-in instead." },
    ],
    notes: [{ type: "Warning", content: "Never create an on-hold booking for a Special Discount request — the outbound team contacts the passenger directly once the Sprinklr case is raised." }],
    keywords: ["falcons", "special discounts", "air arabia holidays", "sharjah airport services", "ok to board", "home check-in", "early check-in"],
  },
  {
    title: "Module 18: Special Cases — Dead Body Transport, Military Vouchers & Office Moves",
    description: "9P's transport-of-deceased procedure and military voucher handling, plus the Islamabad sales office relocation.",
    overview:
      "Some calls are rare enough that they're easy to freeze up on — this module exists so that doesn't happen. Transporting a deceased passenger is the clearest example: it needs empathy first, then a precise document checklist, because getting it wrong at cargo check-in adds pain to an already difficult day.\n\nWith the rare cases covered, the last stretch of this training turns to Cairo's unique fare rules and whatever promotions are currently active.",
    procedures: [
      {
        title: "Transport of a deceased passenger — 9P",
        content:
          "Requires: one attendant with a confirmed ticket; death certificate (government-hospital-attested) + CNIC copy; coffin box certificate from a certified provider; police station NOC; deceased's CNIC copy. Last reporting time: 1 hour before departure, at cargo (not standard check-in). Charge: PKR 20,000 + airport handling fees. 24/7 contact: +92 300 8214381.",
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NzAiIGhlaWdodD0iMTkwIiB2aWV3Qm94PSIwIDAgOTcwIDE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj48cmVjdCB3aWR0aD0iOTcwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjQ4NSIgeT0iMzAiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Eb2N1bWVudHMgcmVxdWlyZWQg4oCUIGRlYWQgYm9keSB0cmFuc3BvcnQ8L3RleHQ+PHJlY3QgeD0iMzAiIHk9IjcwIiB3aWR0aD0iMTkwIiBoZWlnaHQ9IjkwIiByeD0iMTQiIGZpbGw9IiNmZWYyZjIiIHN0cm9rZT0iI2I5MWMxYyIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48dGV4dCB4PSIxMjUiIHk9IjEyMCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzExMTgyNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGVhdGggY2VydGlmaWNhdGUgKyBDTklDPC90ZXh0PjxsaW5lIHgxPSIyMjgiIHkxPSIxMTUiIHgyPSIyNjIiIHkyPSIxMTUiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48cG9seWdvbiBwb2ludHM9IjI2MiwxMDkgMjc0LDExNSAyNjIsMTIxIiBmaWxsPSIjNmI3MjgwIi8+PHJlY3QgeD0iMjcwIiB5PSI3MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI5MCIgcng9IjE0IiBmaWxsPSIjZmVmMmYyIiBzdHJva2U9IiNiOTFjMWMiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHRleHQgeD0iMzY1IiB5PSIxMjAiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvZmZpbiBib3ggY2VydGlmaWNhdGU8L3RleHQ+PGxpbmUgeDE9IjQ2OCIgeTE9IjExNSIgeDI9IjUwMiIgeTI9IjExNSIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjIuNSIvPjxwb2x5Z29uIHBvaW50cz0iNTAyLDEwOSA1MTQsMTE1IDUwMiwxMjEiIGZpbGw9IiM2YjcyODAiLz48cmVjdCB4PSI1MTAiIHk9IjcwIiB3aWR0aD0iMTkwIiBoZWlnaHQ9IjkwIiByeD0iMTQiIGZpbGw9IiNmZWYyZjIiIHN0cm9rZT0iI2I5MWMxYyIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48dGV4dCB4PSI2MDUiIHk9IjEyMCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzExMTgyNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UG9saWNlIE5PQzwvdGV4dD48bGluZSB4MT0iNzA4IiB5MT0iMTE1IiB4Mj0iNzQyIiB5Mj0iMTE1IiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHBvbHlnb24gcG9pbnRzPSI3NDIsMTA5IDc1NCwxMTUgNzQyLDEyMSIgZmlsbD0iIzZiNzI4MCIvPjxyZWN0IHg9Ijc1MCIgeT0iNzAiIHdpZHRoPSIxOTAiIGhlaWdodD0iOTAiIHJ4PSIxNCIgZmlsbD0iI2ZlZjJmMiIgc3Ryb2tlPSIjYjkxYzFjIiBzdHJva2Utd2lkdGg9IjIuNSIvPjx0ZXh0IHg9Ijg0NSIgeT0iMTExIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BdHRlbmRhbnQgd2l0aCBjb25maXJtZWQ8L3RleHQ+PHRleHQgeD0iODQ1IiB5PSIxMjkiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPnRpY2tldDwvdGV4dD48L3N2Zz4=",
      },
      {
        title: "APW/TAC Military Vouchers — 9P",
        content: "A dedicated voucher-based fare category for military travel — check the live APW/TAC Military Vouchers article for current documentation and servicing requirements before processing.",
      },
      {
        title: "Islamabad Sales Office move — 9P & G9",
        content: "The Fly Jinnah (9P) and Air Arabia (G9) Islamabad Sales Office relocated to a new address effective 13 July 2026 — confirm the current address before directing a passenger there in person.",
      },
    ],
    scenarios: [
      {
        situation: "A family calls about transporting a deceased relative on 9P and asks what's needed.",
        response: "A government-hospital-attested death certificate + CNIC copy, a coffin box certificate from a certified provider, a police NOC, the deceased's CNIC copy, and one attendant with a confirmed ticket — reporting is 1 hour before departure, at cargo.",
      },
      {
        situation: "A passenger asks how late they can arrive for a dead body transport booking.",
        response: "Strictly 1 hour before departure, at cargo — not the standard passenger check-in counter.",
      },
    ],
    notes: [{ type: "Information", content: "Lead with empathy on dead body transport calls — the documentation checklist matters, but tone matters just as much." }],
    keywords: ["dead body transport", "9P", "military vouchers", "islamabad office"],
  },
  {
    title: "Module 19: Cairo Special Rules & Current Promotions",
    description: "Cairo's unique Business Class and bundle rules, plus the promotions and card partnerships currently active.",
    overview:
      "Two last things don't fit neatly into any hub bucket: Cairo, which plays by its own rules entirely, and promotions, which are only true for as long as their booking window lasts. Both need the same instinct — check before you quote, because both change without much warning.\n\nAfter this, the story loops back to where it started: the habits that make every one of these calls go well.",
    procedures: [
      {
        title: "Cairo (CAI) — 1. Overview",
        content: "Cairo is the only route with Business Class. Economy offers Basic and Ultimate bundles only — no Value. Cairo Economy passengers have no baby bassinet access.",
        image: "/uploads/1783879077585-cai-overview.png",
      },
      {
        title: "Cairo (CAI) — 2. Basic & Ultimate T&Cs",
        content:
          "Basic: 10kg carry-on + 20/30kg checked, standard meal, 24h modification/cancellation, AED 200/passenger/sector modification + fare difference, AED 200 cancellation. Ultimate: 40kg checked, premium meal, any seat, priority check-in, 8h notice, 2 free modifications, AED 200 cancellation.",
        image: "/uploads/1783879075006-cai-basic-ultimate-tc.png",
      },
      {
        title: "Cairo (CAI) — 3. Business Class T&Cs",
        content: "40kg checked, Business meal, any seat, priority check-in, 8h notice, free modifications (fare difference only), AED 200 cancellation.",
        image: "/uploads/1783879076720-cai-business-tc.png",
      },
      {
        title: "Cairo (CAI) — 4. Business Class seat layout",
        content: "Free seating in the first 2 rows (A320) or 3 rows (A321), with the middle seat always blocked and left empty.",
        image: "/uploads/1783879075866-cai-business-seatlayout.png",
      },
      {
        title: "RAK Bank tickets",
        content: "Cannot be modified or cancelled once issued, through any channel, including in person at an office — no exceptions.",
      },
      {
        title: "Active promotions (confirm dates before quoting)",
        content:
          "AUH promo: starting fares from JOD 115 (Amman) up to KWD 29 (Kuwait); booking window 1–15 July 2026, travel to 31 Oct 2026. Emirates Islamic Visa Card: 10% off Value / 20% off Ultimate, fare+surcharge only, UAE-departing flights, promo code EIB at search, booking window 8 Jul–6 Aug 2026, travel to 30 Sep 2026.",
      },
      {
        title: "Travel Fusion bookings",
        content: "Third-party channel bookings are on hold for all standard actions (modification, cancellation, name change, credit transfer) through any channel — direct the passenger to Travel Fusion directly. Sole exception: a flight transfer specifically due to a disruption alert can be processed here.",
      },
    ],
    scenarios: [
      { situation: "A passenger tries to book a Value bundle to Cairo.", response: "Not available — Cairo Economy only offers Basic and Ultimate." },
      { situation: "A passenger with a RAK Bank ticket visits an office in person to cancel.", response: "Still not possible — RAK Bank tickets can't be modified or cancelled through any channel, including in person." },
      { situation: "A Travel Fusion passenger's flight is disrupted and they want to transfer to a new flight.", response: "This is the one exception — process the transfer directly. A cancellation or refund request instead still goes to Travel Fusion." },
    ],
    notes: [{ type: "Warning", content: "Promotions have hard booking/travel windows — always confirm today's date falls inside both before quoting a promotional fare." }],
    keywords: ["cairo", "CAI", "business class", "RAK Bank", "promotion", "travel fusion", "emirates islamic"],
  },
  {
    title: "Module 20: Call Handling Wrap-up — Quality & Escalations",
    description: "How quality cases get raised, and the habits — verification, checklists, empathy — that separate a good call from one that ends up as a complaint.",
    overview:
      "You've now been through the full flow twice over — the general rules every hub shares, and then the hub-by-hub specifics: bundles, baggage rates, name changes, cargo, special services, Cairo, and today's promotions. This last module closes the loop on quality itself.\n\nWhen a call doesn't go right — wrong information, a wrong booking, a wrong modification, a cancellation that was requested but never completed — that's a quality case, raised under Complaints > Call Center Complaints with the correct sub-type so it reaches the right team.\n\nThe throughline across everything in this training is the same: verify first, follow the checklist in order, quote things accurately for the right hub, and lead with empathy when something's gone wrong. Get those right and quality cases stay rare. Welcome to the floor — you're ready for your first real call.",
    procedures: [
      {
        title: "Raising a quality case",
        content: "Raise under Complaints > Call Center Complaints, then select the correct sub-type — wrong information given, wrong booking, wrong modification, or a cancellation that was requested but not completed.",
        image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NzAiIGhlaWdodD0iMTkwIiB2aWV3Qm94PSIwIDAgOTcwIDE5MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIj48cmVjdCB3aWR0aD0iOTcwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPjx0ZXh0IHg9IjQ4NSIgeT0iMzAiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMTExODI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UaGUgaGFiaXRzIGJlaGluZCBldmVyeSBnb29kIGNhbGw8L3RleHQ+PHJlY3QgeD0iMzAiIHk9IjcwIiB3aWR0aD0iMTkwIiBoZWlnaHQ9IjkwIiByeD0iMTQiIGZpbGw9IiNmZWYyZjIiIHN0cm9rZT0iI2I5MWMxYyIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48dGV4dCB4PSIxMjUiIHk9IjEyMCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzExMTgyNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VmVyaWZ5PC90ZXh0PjxsaW5lIHgxPSIyMjgiIHkxPSIxMTUiIHgyPSIyNjIiIHkyPSIxMTUiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48cG9seWdvbiBwb2ludHM9IjI2MiwxMDkgMjc0LDExNSAyNjIsMTIxIiBmaWxsPSIjNmI3MjgwIi8+PHJlY3QgeD0iMjcwIiB5PSI3MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI5MCIgcng9IjE0IiBmaWxsPSIjZmVmMmYyIiBzdHJva2U9IiNiOTFjMWMiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHRleHQgeD0iMzY1IiB5PSIxMjAiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZvbGxvdyB0aGUgY2hlY2tsaXN0PC90ZXh0PjxsaW5lIHgxPSI0NjgiIHkxPSIxMTUiIHgyPSI1MDIiIHkyPSIxMTUiIHN0cm9rZT0iIzZiNzI4MCIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48cG9seWdvbiBwb2ludHM9IjUwMiwxMDkgNTE0LDExNSA1MDIsMTIxIiBmaWxsPSIjNmI3MjgwIi8+PHJlY3QgeD0iNTEwIiB5PSI3MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI5MCIgcng9IjE0IiBmaWxsPSIjZmVmMmYyIiBzdHJva2U9IiNiOTFjMWMiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHRleHQgeD0iNjA1IiB5PSIxMjAiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMTE4MjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPlF1b3RlIGFjY3VyYXRlbHk8L3RleHQ+PGxpbmUgeDE9IjcwOCIgeTE9IjExNSIgeDI9Ijc0MiIgeTI9IjExNSIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjIuNSIvPjxwb2x5Z29uIHBvaW50cz0iNzQyLDEwOSA3NTQsMTE1IDc0MiwxMjEiIGZpbGw9IiM2YjcyODAiLz48cmVjdCB4PSI3NTAiIHk9IjcwIiB3aWR0aD0iMTkwIiBoZWlnaHQ9IjkwIiByeD0iMTQiIGZpbGw9IiNmZWYyZjIiIHN0cm9rZT0iI2I5MWMxYyIgc3Ryb2tlLXdpZHRoPSIyLjUiLz48dGV4dCB4PSI4NDUiIHk9IjEyMCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzExMTgyNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TGVhZCB3aXRoIGVtcGF0aHk8L3RleHQ+PC9zdmc+",
      },
    ],
    scenarios: [
      {
        situation: "A passenger complains that a previous Champion quoted the wrong modification fee.",
        response: "This is a quality case — raise it under Complaints > Call Center Complaints with the 'wrong information' sub-type.",
      },
    ],
    notes: [{ type: "Information", content: "Quality cases map to a specific Sprinklr sub-type each — selecting the right one is what gets it to the correct team." }],
    keywords: ["quality", "escalation", "call handling", "complaints"],
  },
];
