import type { DecisionTreeSpec } from "./types";

export const NEW_CATEGORY_TREES: DecisionTreeSpec[] = [
  {
    title: "AirRewards — What's the Question About?",
    description: "Registration, earning, redemption or expiry.",
    topic: "AirRewards",
    sourceArticleSlug: "airrewards-loyalty-program-all-hubs-1783838668534",
    nodes: [
      { clientKey: 1, type: "question", text: "What does the passenger want to know?", options: [
        { label: "How to register / who's eligible", targetClientKey: 2 },
        { label: "How points are earned", targetClientKey: 3 },
        { label: "How to redeem points", targetClientKey: 4 },
        { label: "When points expire", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "outcome", text: "Register online or via Accel Aero. 12+ registers directly. Ages 2–11 must link to an existing family-head member's account (up to 8 members; family head earns 50% of a linked passenger's points)." },
      { clientKey: 3, type: "outcome", text: "5% cashback as points on tickets/baggage, 10% on seat/meal/insurance/airport services. No points on airport taxes or another passenger's flights. Future flights: add AirRewards ID to PNR, credited within 24h of travel. Past flights: claim within 90 days." },
      { clientKey: 4, type: "outcome", text: "Redeem via the account payment page. 3,000-point minimum for fare/baggage; no minimum for seat/meal/insurance/airport services." },
      { clientKey: 5, type: "outcome", text: "Points expire 2 years from the travel date." },
    ],
  },
  {
    title: "Payment Options — Method or Charge?",
    description: "Which payment channel applies, and the country-specific charge.",
    topic: "Payments",
    sourceArticleSlug: "payment-channels-charges-all-hubs-1783838668718",
    nodes: [
      { clientKey: 1, type: "question", text: "Is the passenger asking about a payment method, or the charge for paying a call-center booking?", options: [
        { label: "Which methods are available", targetClientKey: 2 },
        { label: "What's the charge in their country", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "Installments (UAE/KSA/Egypt), Book Now Pay Later (offices/agents/banks/exchange houses), Mada (KSA), KNET (Kuwait), RuPay/UPI (India), iDeal (Netherlands), Bancontact (Belgium), Sofort (Germany)." },
      { clientKey: 3, type: "outcome", text: "A flat per-passenger or per-booking charge applies by country (e.g. AED 10/booking UAE, USD 14/passenger Pakistan, EGP 250–500/passenger Egypt). Always disclose the charge before payment — check Payment Channels & Charges for the exact country figure." },
    ],
  },
  {
    title: "Applying Credit to a New Booking",
    description: "Does the credit cover the new fare, or is there a balance due?",
    topic: "Payments",
    sourceArticleSlug: "using-credit-vouchers-for-a-new-booking-all-hubs-1783838668831",
    nodes: [
      { clientKey: 1, type: "question", text: "Does the passenger's spelling on the new booking match the original PNR exactly?", options: [
        { label: "Yes, matches", targetClientKey: 2 },
        { label: "No, spelling differs", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "question", text: "Does the credit cover the full new fare?", options: [
        { label: "Yes, fully covered", targetClientKey: 3 },
        { label: "No, partial coverage only", targetClientKey: 4 },
      ] },
      { clientKey: 3, type: "outcome", text: "Apply the credit at the payment stage (click Credit, search the PNR, confirm). Booking is paid and confirmed." },
      { clientKey: 4, type: "outcome", text: "Apply the credit, then send a payment link for the remaining balance. Booking shows as forced — non-payment triggers cancellation charges." },
      { clientKey: 5, type: "outcome", text: "Credit can't be matched — correct the spelling on the new booking to match the original PNR exactly before applying it." },
    ],
  },
  {
    title: "Caller Verification Check",
    description: "Can this caller be given booking details or have changes made?",
    topic: "Reservations",
    sourceArticleSlug: "caller-verification-all-hubs-1783838668928",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a general flight-status question, or does it involve a paid PNR?", options: [
        { label: "General flight status only", targetClientKey: 2 },
        { label: "Paid PNR — need details or a change", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "No PNR or verification needed — look up the flight directly using the flight number/date." },
      { clientKey: 3, type: "question", text: "Did the caller correctly answer all 3: passenger name, flight destination & date, and one contact detail (mobile or email)?", options: [
        { label: "Yes, all 3 correct", targetClientKey: 4 },
        { label: "No, at least one wrong or missing", targetClientKey: 5 },
      ] },
      { clientKey: 4, type: "outcome", text: "Verification passed — proceed with sharing details or making the requested change." },
      { clientKey: 5, type: "outcome", text: "Do not share details or take any action. Politely explain that full verification is required." },
    ],
  },
  {
    title: "Visa Question or Visa-Change Booking?",
    description: "Route the request correctly.",
    topic: "Reservations",
    sourceArticleSlug: "visa-applications-visa-change-bookings-all-hubs-1783838669014",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a visa application question, or a same-day return booking for a visa run?", options: [
        { label: "Visa application/requirements question", targetClientKey: 2 },
        { label: "Same-day return for a visa run — new booking", targetClientKey: 3 },
        { label: "Existing visa-change (VFR) booking — modify or cancel", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "UAE visa: check with any Air Arabia office. Any other visa: check with the relevant consulate or embassy — Air Arabia doesn't process visa applications." },
      { clientKey: 3, type: "outcome", text: "Must be booked as a visa-change (VFR) ticket at an Air Arabia office — can't be created over the phone." },
      { clientKey: 4, type: "outcome", text: "Not possible from the Call Center — the passenger must visit an Air Arabia office." },
    ],
  },
  {
    title: "Modification or Cancellation — Follow the Checklist",
    description: "Step-by-step order for handling either request.",
    topic: "Reservations",
    sourceArticleSlug: "modification-cancellation-checklists-all-hubs-1783838669091",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a modification or a cancellation?", options: [
        { label: "Modification", targetClientKey: 2 },
        { label: "Cancellation", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "1. Verify (PNR + 3 questions). 2. Data collection (all pax? which segment?). 3. First recap. 4. Check ancillary carry-forward. 5. Quote charges (per pax, then total). 6. Explain T&C. 7. Final recap. 8. Send payment link. 9. Confirm new dates with the passenger." },
      { clientKey: 3, type: "outcome", text: "1. Verify (PNR + 3 questions). 2. Data collection (all pax? which segment?). 3. Check payment date & method. 4. Confirm credit amount + expiry. 5. Send the cancellation confirmation by email." },
    ],
  },
  {
    title: "Group Booking — New Request or Existing Booking?",
    description: "Eligibility for a new group, and what's allowed on an existing one.",
    topic: "Reservations",
    sourceArticleSlug: "group-booking-requests-inquiries-all-hubs-1783838669189",
    nodes: [
      { clientKey: 1, type: "question", text: "Is this a new group request, or a question about an existing group booking?", options: [
        { label: "New request — how many passengers, and seats available?", targetClientKey: 2 },
        { label: "Existing group booking — wants a change", targetClientKey: 4 },
        { label: "Existing group booking — wants PNR details", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "question", text: "Is it more than 10 passengers, and does the flight have more than 70 available seats per sector?", options: [
        { label: "Yes to both", targetClientKey: 3 },
        { label: "No to either", targetClientKey: 6 },
      ] },
      { clientKey: 3, type: "outcome", text: "Eligible — submit via the group booking form: forms.office.com/r/4Eewf1TWD9. The Groups team follows up directly." },
      { clientKey: 4, type: "outcome", text: "Not possible from the Call Center — no modification, cancellation, split, ancillary or contact-detail changes on group bookings." },
      { clientKey: 5, type: "outcome", text: "Only share details if the caller correctly verifies all passenger names, flight details, and one contact detail." },
      { clientKey: 6, type: "outcome", text: "Not eligible as a group booking — book individually or check other flight options." },
    ],
  },
  {
    title: "SkyTime — What's the Question?",
    description: "Onboard entertainment how-to.",
    topic: "Ancillaries",
    sourceArticleSlug: "skytime-onboard-entertainment-all-hubs-1783838669295",
    nodes: [
      { clientKey: 1, type: "question", text: "What does the passenger want to know?", options: [
        { label: "How to connect", targetClientKey: 2 },
        { label: "Device battery is low", targetClientKey: 3 },
        { label: "Is it free?", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "After take-off, connect the device's Wi-Fi to the SkyTime network and log in with email + seat number. No pre-flight download needed." },
      { clientKey: 3, type: "outcome", text: "Power banks are available onboard for a small extra charge." },
      { clientKey: 4, type: "outcome", text: "Yes, SkyTime itself is free — only power banks and headsets carry an extra charge." },
    ],
  },
  {
    title: "Handling a Complaint — What Type?",
    description: "Routes each complaint type to the right sub-procedure.",
    topic: "Customer Support",
    sourceArticleSlug: "handling-complaints-all-hubs-1783838669372",
    nodes: [
      { clientKey: 1, type: "question", text: "What kind of complaint is this?", options: [
        { label: "Payment issue — money debited, no confirmation", targetClientKey: 2 },
        { label: "Quality case — wrong info/booking/modification from a previous call", targetClientKey: 3 },
        { label: "Any other complaint type (AirRewards, delay, staff behavior, etc.)", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "Ask the passenger to check again after 2 hours. If still unresolved: advanced search for a generated PNR, raise a Sprinklr payment-issues request, extend the booking time limit 24h+." },
      { clientKey: 3, type: "outcome", text: "Raise a request under Complaints > Call Center Complaints, selecting the correct sub-type (wrong info, wrong booking, wrong modification, cancellation not done)." },
      { clientKey: 4, type: "outcome", text: "Listen, empathize, acknowledge the inconvenience, then offer a solution, escalate to a supervisor, or raise a case under the matching complaint type in Sprinklr." },
    ],
  },
  {
    title: "Baggage Claim — Still at the Airport?",
    description: "Where and when a baggage claim can be filed.",
    topic: "Customer Support",
    sourceArticleSlug: "baggage-claims-all-hubs-1783838669489",
    nodes: [
      { clientKey: 1, type: "question", text: "Is the passenger still at the arrival airport?", options: [
        { label: "Yes, still at the airport", targetClientKey: 2 },
        { label: "No, already left the airport", targetClientKey: 3 },
      ] },
      { clientKey: 2, type: "outcome", text: "Direct them to the baggage services counter right now to log the damage/loss/delay report immediately." },
      { clientKey: 3, type: "outcome", text: "Damage, loss and delay must be reported at the arrival airport at the time of arrival — this can't be substituted with a later phone or email report. Advise contacting that airport's baggage desk directly regardless." },
    ],
  },
  {
    title: "Which System Do I Use?",
    description: "Accel Aero, Sprinklr, Caesar or Teams — pick the right tool.",
    topic: "Systems",
    sourceArticleSlug: "contact-center-systems-overview-accel-aero-sprinklr-caesar-teams-1783838669574",
    nodes: [
      { clientKey: 1, type: "question", text: "What do you need to do?", options: [
        { label: "Search, book, modify or cancel a flight", targetClientKey: 2 },
        { label: "Raise or track a customer case", targetClientKey: 3 },
        { label: "Verify a planned vs. unplanned flight-time change", targetClientKey: 4 },
        { label: "Escalate something urgently to another team", targetClientKey: 5 },
      ] },
      { clientKey: 2, type: "outcome", text: "Accel Aero." },
      { clientKey: 3, type: "outcome", text: "Sprinklr (login: airarabia.sprinklr.com, via SSO)." },
      { clientKey: 4, type: "outcome", text: "Caesar — use the hub-specific link. If not updated yet, check with the Duty Supervisor." },
      { clientKey: 5, type: "outcome", text: "Microsoft Teams." },
    ],
  },
  {
    title: "Airport Shuttle Bus — Which Route?",
    description: "Bus options for Sharjah, Abu Dhabi and Ras Al Khaimah.",
    topic: "General",
    sourceArticleSlug: "airport-shuttle-bus-services-g9-3l-1783838669661",
    nodes: [
      { clientKey: 1, type: "question", text: "Which airport does the passenger need a bus to/from?", options: [
        { label: "Sharjah Airport", targetClientKey: 2 },
        { label: "Abu Dhabi Airport", targetClientKey: 3 },
        { label: "Ras Al Khaimah Airport", targetClientKey: 4 },
      ] },
      { clientKey: 2, type: "outcome", text: "RAK office ↔ Sharjah Airport: AED 30 (Air Arabia). City Centre Al Shindagha ↔ Sharjah Airport: free (Air Arabia)." },
      { clientKey: 3, type: "outcome", text: "Hourly bus, Ibn Battuta Mall ↔ Abu Dhabi Airport, operated by Abu Dhabi Airport. Ticket at the bus station, subject to availability." },
      { clientKey: 4, type: "outcome", text: "Free shuttle from Dubai, Sharjah, Ajman & Umm Al Quwain, operated by RAK Airport. First come, first served." },
    ],
  },
];
