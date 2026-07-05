export interface Article {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  author: string;
  lastUpdated: string;
  content: string[];
}

export const articles: Article[] = [

  {
    id: 1,
    slug: "new-booking",
    title: "New Booking",
    category: "Reservations",
    description: "Create a new reservation in the reservation system.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Open the reservation system.",
      "Search for the requested origin and destination.",
      "Verify travel dates.",
      "Select the preferred flight.",
      "Enter passenger details exactly as shown on the passport.",
      "Offer baggage and seat selection.",
      "Review the itinerary with the passenger.",
      "Collect payment.",
      "Issue the booking confirmation.",
    ],
  },

  {
    id: 2,
    slug: "flight-change",
    title: "Flight Change",
    category: "Reservations",
    description: "Modify an existing reservation.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Retrieve the booking using the PNR.",
      "Verify the passenger's identity.",
      "Select Change Flight.",
      "Search for available alternatives.",
      "Explain any fare difference.",
      "Collect additional payment if applicable.",
      "Confirm the changes.",
      "Send the updated itinerary.",
    ],
  },

  {
    id: 3,
    slug: "booking-cancellation",
    title: "Booking Cancellation",
    category: "Reservations",
    description: "Cancel an existing booking.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Retrieve the reservation.",
      "Verify passenger details.",
      "Review cancellation conditions.",
      "Explain applicable charges.",
      "Cancel the booking.",
      "Process refund or travel credit if eligible.",
      "Send confirmation.",
    ],
  },

  {
    id: 4,
    slug: "name-correction",
    title: "Name Correction",
    category: "Reservations",
    description: "Correct passenger name according to policy.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Retrieve the booking.",
      "Compare the ticket with the passport.",
      "Determine whether the correction is allowed.",
      "Apply the correction.",
      "Collect any applicable fee.",
      "Save the reservation.",
      "Send updated itinerary.",
    ],
  },

  {
    id: 5,
    slug: "schedule-change",
    title: "Schedule Change",
    category: "Reservations",
    description: "Handle airline schedule changes.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Review the updated schedule.",
      "Inform the passenger.",
      "Offer available alternatives.",
      "Apply the selected option.",
      "Update the reservation.",
      "Send confirmation.",
    ],
  },

  {
    id: 6,
    slug: "group-booking",
    title: "Group Booking",
    category: "Reservations",
    description: "Create and manage group reservations.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Confirm group size.",
      "Request the travel itinerary.",
      "Check group availability.",
      "Create the group booking.",
      "Collect passenger names before the deadline.",
      "Issue tickets.",
    ],
  },

  {
    id: 7,
    slug: "special-services",
    title: "Special Services (SSR)",
    category: "Reservations",
    description: "Request wheelchair, meals and other SSR services.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Retrieve the booking.",
      "Identify the requested service.",
      "Check airline availability.",
      "Add the SSR request.",
      "Confirm with the passenger.",
    ],
  },

  {
    id: 8,
    slug: "no-show",
    title: "No Show",
    category: "Reservations",
    description: "Procedure for passengers who miss their flight.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Verify flight departure.",
      "Confirm no-show status.",
      "Review fare conditions.",
      "Explain available options.",
      "Rebook if permitted.",
    ],
  },
  {
    id: 9,
    slug: "refund-policy",
    title: "Refund Policy",
    category: "Refunds",
    description: "General refund eligibility and policy.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Verify ticket eligibility.",
      "Check fare conditions.",
      "Determine refundable amount.",
      "Explain applicable fees.",
      "Proceed according to company policy.",
    ],
  },

  {
    id: 10,
    slug: "voluntary-refund",
    title: "Voluntary Refund",
    category: "Refunds",
    description: "Refund requested by the passenger.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Retrieve the reservation.",
      "Confirm passenger identity.",
      "Review fare rules.",
      "Calculate refund amount.",
      "Submit refund request.",
      "Inform passenger of processing time.",
    ],
  },

  {
    id: 11,
    slug: "involuntary-refund",
    title: "Involuntary Refund",
    category: "Refunds",
    description: "Refund due to airline disruption.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Verify disruption reason.",
      "Confirm eligibility.",
      "Calculate refund.",
      "Submit airline approval.",
      "Notify passenger.",
    ],
  },

  {
    id: 12,
    slug: "voucher-conversion",
    title: "Travel Voucher",
    category: "Refunds",
    description: "Convert eligible tickets into travel vouchers.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Verify ticket validity.",
      "Explain voucher conditions.",
      "Issue voucher.",
      "Send voucher confirmation.",
    ],
  },

  {
    id: 13,
    slug: "duplicate-payment",
    title: "Duplicate Payment Refund",
    category: "Refunds",
    description: "Handle duplicate payment cases.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Verify duplicate transaction.",
      "Collect payment evidence.",
      "Submit finance request.",
      "Inform passenger.",
    ],
  },

  {
    id: 14,
    slug: "tax-refund",
    title: "Airport Tax Refund",
    category: "Refunds",
    description: "Refund applicable airport taxes.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Verify unused ticket.",
      "Calculate refundable taxes.",
      "Submit request.",
      "Notify passenger.",
    ],
  },

  {
    id: 15,
    slug: "refund-status",
    title: "Refund Status",
    category: "Refunds",
    description: "Check refund processing status.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Locate refund request.",
      "Review processing stage.",
      "Inform passenger.",
    ],
  },

  {
    id: 16,
    slug: "refund-escalation",
    title: "Refund Escalation",
    category: "Refunds",
    description: "Escalate delayed refund requests.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Review refund history.",
      "Verify SLA.",
      "Escalate to finance.",
      "Update passenger.",
    ],
  },
    {
    id: 17,
    slug: "credit-card-payment",
    title: "Credit Card Payment",
    category: "Payments",
    description: "Accept credit card payments.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Verify booking.",
      "Select payment option.",
      "Process payment securely.",
      "Issue receipt.",
    ],
  },

  {
    id: 18,
    slug: "cash-payment",
    title: "Cash Payment",
    category: "Payments",
    description: "Accept cash payments at sales office.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Count received cash.",
      "Confirm booking amount.",
      "Issue receipt.",
    ],
  },

  {
    id: 19,
    slug: "payment-failure",
    title: "Payment Failure",
    category: "Payments",
    description: "Resolve failed payment attempts.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Verify payment gateway.",
      "Retry transaction.",
      "Offer alternative payment.",
    ],
  },

  {
    id: 20,
    slug: "payment-link",
    title: "Payment Link",
    category: "Payments",
    description: "Send secure payment link.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Generate payment link.",
      "Verify email.",
      "Send payment request.",
    ],
  },

  {
    id: 21,
    slug: "invoice-request",
    title: "Invoice Request",
    category: "Payments",
    description: "Issue invoice after payment.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Retrieve booking.",
      "Generate invoice.",
      "Send PDF invoice.",
    ],
  },

  {
    id: 22,
    slug: "payment-verification",
    title: "Payment Verification",
    category: "Payments",
    description: "Verify completed transactions.",
    author: "Air Arabia Training",
    lastUpdated: "05 July 2026",
    content: [
      "Check payment gateway.",
      "Verify booking.",
      "Confirm successful payment.",
    ],
  },
  {
  id: 23,
  slug: "extra-baggage",
  title: "Extra Baggage Purchase",
  category: "Ancillaries",
  description: "Purchase additional baggage allowance.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Retrieve the reservation.",
    "Check baggage allowance.",
    "Select additional baggage.",
    "Collect payment.",
    "Issue updated itinerary."
  ],
},

{
  id: 24,
  slug: "seat-selection",
  title: "Seat Selection",
  category: "Ancillaries",
  description: "Assign or modify passenger seats.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Open seat map.",
    "Check available seats.",
    "Offer premium seats.",
    "Collect payment if required.",
    "Save reservation."
  ],
},

{
  id: 25,
  slug: "meal-purchase",
  title: "Pre-book Meal",
  category: "Ancillaries",
  description: "Purchase onboard meals before departure.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify booking.",
    "Display available meals.",
    "Select passenger preference.",
    "Collect payment.",
    "Confirm meal request."
  ],
},

{
  id: 26,
  slug: "sports-equipment",
  title: "Sports Equipment",
  category: "Ancillaries",
  description: "Book sports equipment transportation.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Confirm equipment type.",
    "Verify airline policy.",
    "Calculate charges.",
    "Add SSR.",
    "Confirm booking."
  ],
},

{
  id: 27,
  slug: "pet-travel",
  title: "Pet Travel",
  category: "Ancillaries",
  description: "Handle pet transportation requests.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify pet policy.",
    "Confirm route eligibility.",
    "Check documentation.",
    "Collect applicable fees."
  ],
},

{
  id: 28,
  slug: "wheelchair-service",
  title: "Wheelchair Assistance",
  category: "Ancillaries",
  description: "Arrange wheelchair assistance.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Identify assistance type.",
    "Add SSR.",
    "Confirm airport service.",
    "Advise passenger."
  ],
},

{
  id: 29,
  slug: "unaccompanied-minor",
  title: "Unaccompanied Minor",
  category: "Ancillaries",
  description: "UMNR booking procedure.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify passenger age.",
    "Confirm eligible routes.",
    "Collect guardian information.",
    "Complete UMNR forms."
  ],
},

{
  id: 30,
  slug: "priority-boarding",
  title: "Priority Boarding",
  category: "Ancillaries",
  description: "Purchase priority boarding.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify availability.",
    "Collect payment.",
    "Add service to booking."
  ],
},

{
  id: 31,
  slug: "airport-transfer",
  title: "Airport Transfer",
  category: "Ancillaries",
  description: "Book airport transfer service.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify destination.",
    "Select transfer option.",
    "Collect payment.",
    "Issue confirmation."
  ],
},

{
  id: 32,
  slug: "travel-insurance",
  title: "Travel Insurance",
  category: "Ancillaries",
  description: "Offer travel insurance.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Explain coverage.",
    "Select insurance package.",
    "Collect payment.",
    "Issue policy."
  ],
},
{
  id: 33,
  slug: "airrewards-registration",
  title: "AirRewards Registration",
  category: "AirRewards",
  description: "Register a new AirRewards member.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Collect passenger details.",
    "Create membership.",
    "Send welcome email."
  ],
},

{
  id: 34,
  slug: "claim-missing-points",
  title: "Claim Missing Points",
  category: "AirRewards",
  description: "Submit missing points request.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify flight.",
    "Check eligibility.",
    "Submit claim."
  ],
},

{
  id: 35,
  slug: "redeem-points",
  title: "Redeem Points",
  category: "AirRewards",
  description: "Redeem loyalty points.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify balance.",
    "Select reward.",
    "Redeem points.",
    "Confirm booking."
  ],
},

{
  id: 36,
  slug: "membership-update",
  title: "Update Membership",
  category: "AirRewards",
  description: "Modify member profile.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify identity.",
    "Update details.",
    "Save changes."
  ],
},

{
  id: 37,
  slug: "membership-benefits",
  title: "Membership Benefits",
  category: "AirRewards",
  description: "Explain loyalty benefits.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Explain earning rules.",
    "Explain redemption.",
    "Explain promotions."
  ],
},

{
  id: 38,
  slug: "membership-tier",
  title: "Membership Tier",
  category: "AirRewards",
  description: "Review membership level.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Check qualifying flights.",
    "Verify current tier.",
    "Advise customer."
  ],
},
{
  id: 39,
  slug: "navitaire-login",
  title: "Navitaire Login",
  category: "Systems",
  description: "Access the Navitaire reservation system.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Launch Navitaire.",
    "Enter your employee credentials.",
    "Complete two-factor authentication if prompted.",
    "Verify successful login."
  ],
},

{
  id: 40,
  slug: "navitaire-password-reset",
  title: "Reset Navitaire Password",
  category: "Systems",
  description: "Reset a forgotten or expired password.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Open the password reset page.",
    "Verify your employee ID.",
    "Create a new password.",
    "Log in using the updated credentials."
  ],
},

{
  id: 41,
  slug: "system-timeout",
  title: "System Timeout",
  category: "Systems",
  description: "Resolve automatic session timeout.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Refresh the application.",
    "Log in again.",
    "Restore the reservation if available."
  ],
},

{
  id: 42,
  slug: "printer-setup",
  title: "Printer Setup",
  category: "Systems",
  description: "Configure ticket printer.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify printer connection.",
    "Select default printer.",
    "Print test page.",
    "Confirm successful output."
  ],
},

{
  id: 43,
  slug: "boarding-pass-print",
  title: "Boarding Pass Printing",
  category: "Systems",
  description: "Print passenger boarding passes.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Retrieve reservation.",
    "Select Print Boarding Pass.",
    "Verify printer output."
  ],
},

{
  id: 44,
  slug: "email-configuration",
  title: "Corporate Email Setup",
  category: "Systems",
  description: "Configure company email.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Open Outlook.",
    "Enter company email.",
    "Complete authentication.",
    "Verify mailbox synchronization."
  ],
},

{
  id: 45,
  slug: "vpn-access",
  title: "VPN Access",
  category: "Systems",
  description: "Connect securely to company systems.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Launch VPN client.",
    "Sign in.",
    "Verify secure connection."
  ],
},

{
  id: 46,
  slug: "system-escalation",
  title: "System Escalation",
  category: "Systems",
  description: "Escalate technical issues to IT.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Document the issue.",
    "Collect screenshots.",
    "Create IT ticket.",
    "Monitor resolution."
  ],
},
{
  id: 47,
  slug: "flight-delay",
  title: "Flight Delay",
  category: "Flight Disruptions",
  description: "Assist passengers during delays.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify updated departure time.",
    "Notify passenger.",
    "Explain available options."
  ],
},

{
  id: 48,
  slug: "flight-cancellation",
  title: "Flight Cancellation",
  category: "Flight Disruptions",
  description: "Handle cancelled flights.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify cancellation.",
    "Offer rebooking.",
    "Offer refund if eligible."
  ],
},

{
  id: 49,
  slug: "missed-connection",
  title: "Missed Connection",
  category: "Flight Disruptions",
  description: "Assist passengers who miss connecting flights.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify itinerary.",
    "Search alternative flights.",
    "Update reservation."
  ],
},

{
  id: 50,
  slug: "weather-disruption",
  title: "Weather Disruption",
  category: "Flight Disruptions",
  description: "Manage weather-related disruptions.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Confirm weather advisory.",
    "Explain airline policy.",
    "Offer alternatives."
  ],
},

{
  id: 51,
  slug: "airport-closure",
  title: "Airport Closure",
  category: "Flight Disruptions",
  description: "Handle airport closure situations.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Verify official airport notice.",
    "Offer alternate airports.",
    "Update itinerary."
  ],
},

{
  id: 52,
  slug: "overbooking",
  title: "Overbooking",
  category: "Flight Disruptions",
  description: "Manage overbooked flights.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Review passenger priority.",
    "Offer voluntary options.",
    "Follow compensation policy."
  ],
},
{
  id: 53,
  slug: "new-agent-training",
  title: "New Agent Training",
  category: "Training",
  description: "Training plan for newly hired agents.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Complete orientation.",
    "Learn reservation system.",
    "Pass knowledge assessment."
  ],
},

{
  id: 54,
  slug: "customer-service",
  title: "Customer Service Standards",
  category: "Training",
  description: "Best practices for customer interactions.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Greet professionally.",
    "Listen actively.",
    "Provide accurate information.",
    "Confirm customer understanding."
  ],
},

{
  id: 55,
  slug: "quality-monitoring",
  title: "Quality Monitoring",
  category: "Training",
  description: "Quality assurance guidelines.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Follow call script.",
    "Verify passenger identity.",
    "Document interactions."
  ],
},

{
  id: 56,
  slug: "security-awareness",
  title: "Security Awareness",
  category: "Training",
  description: "Information security and data protection.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Protect customer data.",
    "Use strong passwords.",
    "Report suspicious activity."
  ],
},

{
  id: 57,
  slug: "gdpr-compliance",
  title: "Data Privacy Compliance",
  category: "Training",
  description: "Handle customer information responsibly.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Collect only required information.",
    "Do not share personal data.",
    "Follow company privacy policy."
  ],
},

{
  id: 58,
  slug: "call-handling",
  title: "Call Handling",
  category: "Training",
  description: "Telephone communication standards.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Answer promptly.",
    "Verify identity.",
    "Resolve efficiently.",
    "Close professionally."
  ],
},

{
  id: 59,
  slug: "complaint-handling",
  title: "Complaint Handling",
  category: "Training",
  description: "Resolve customer complaints professionally.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Listen carefully.",
    "Apologize appropriately.",
    "Offer available solutions.",
    "Document the case."
  ],
},

{
  id: 60,
  slug: "knowledge-refresh",
  title: "Knowledge Refresh",
  category: "Training",
  description: "Monthly knowledge review process.",
  author: "Air Arabia Training",
  lastUpdated: "05 July 2026",
  content: [
    "Review updated procedures.",
    "Complete mandatory quizzes.",
    "Attend refresher sessions."
  ],
}
];