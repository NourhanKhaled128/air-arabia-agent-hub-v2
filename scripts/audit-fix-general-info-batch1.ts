import { prisma } from "../lib/prisma";
import { createDecisionTree } from "../lib/decision-tree-service";

async function fixNewBookingArticle() {
  const article = await prisma.article.findFirst({ where: { title: "Making a New Booking – Accel Aero (All Hubs)" } });
  if (!article) {
    console.warn("Making a New Booking article not found — skipping.");
    return;
  }

  const existingScenarios = await prisma.scenario.count({ where: { articleId: article.id } });
  if (existingScenarios === 0) {
    await prisma.article.update({
      where: { id: article.id },
      data: {
        scenarios: {
          create: [
            {
              situation: "The passenger's preferred flight shows as full during Search Flights.",
              response: "Offer the nearest available dates/flights from the search results — there's no override for a fully-booked flight.",
            },
            {
              situation: "The passenger hears the fare total and says it's too expensive.",
              response: "Check whether a lower fare bundle (Basic vs. Value/Ultimate) still meets their needs, per the Bundle Fares article for that hub — if they still decline, no booking is made.",
            },
            {
              situation: "None of the available flight times work for the passenger.",
              response: "Check adjacent dates in Search Flights — if nothing suitable exists, no booking is made.",
            },
            {
              situation: "A passenger asks general questions about how booking works but isn't ready to commit.",
              response: "Answer their questions from this article, but don't start Booking Creation until they confirm they want to proceed.",
            },
            {
              situation: "A passenger needs to move one traveller out of a group PNR into their own separate booking.",
              response: "Open Booking Information on the existing PNR and use Split — this creates a separate PNR for that passenger without disturbing the rest of the group.",
            },
            {
              situation: "A passenger's name was entered with a typo and the booking isn't paid for yet.",
              response: "Open the passenger record on the PNR and correct the name/nationality directly in the edit field — this is a same-call fix, not a Name Change case.",
            },
            {
              situation: "A passenger paid but never received a booking confirmation email.",
              response: "Don't rebook — this is a payment-issue complaint. See Handling Complaints (Payment issues) for the advanced-search and Sprinklr steps.",
            },
            {
              situation: "A travel agency calls to make or manage a booking on behalf of their client.",
              response: "Handle it the same as a direct passenger booking through Accel Aero — verification and the standard flow still apply.",
            },
            {
              situation: "A passenger asks to have their itinerary emailed to them again.",
              response: "Resend the itinerary to the contact email on file — no PNR changes are needed for this.",
            },
          ],
        },
        escalations: {
          create: [
            {
              department: "Handling Complaints (payment issues)",
              condition: "Passenger's payment was debited but Accel Aero shows no confirmed PNR",
              content: "Don't attempt to rebook — follow the payment-issue advanced-search and Sprinklr steps in Handling Complaints – All Hubs",
            },
          ],
        },
      },
    });
    console.log("Added 9 scenarios + 1 escalation to: Making a New Booking – Accel Aero (All Hubs)");
  } else {
    console.log("Making a New Booking already has scenarios — skipping content add.");
  }

  const existingTree = await prisma.decisionTree.findFirst({ where: { sourceArticleId: article.id } });
  if (!existingTree) {
    const tree = await createDecisionTree({
      title: "Making a New Booking — What Does the Caller Need?",
      slug: `making-a-new-booking-what-does-the-caller-need-${Date.now()}`,
      description: "Routes a booking call to the right part of the Accel Aero flow — new booking vs. the common post-booking edits.",
      topic: "General Information",
      status: "Published",
      author: "Nourhan Khaled",
      sourceArticleId: article.id,
      nodes: [
        {
          clientKey: 1,
          type: "question",
          text: "What does the caller need?",
          order: 1,
          options: [
            { label: "Book a brand-new flight", targetClientKey: 2 },
            { label: "Correct a passenger's name/nationality on an existing booking", targetClientKey: 3 },
            { label: "Change or remove ancillaries on an existing booking", targetClientKey: 4 },
            { label: "Split one or more passengers into a separate PNR", targetClientKey: 5 },
            { label: "Add or remove an infant on an existing booking", targetClientKey: 6 },
            { label: "Review the full change history on a PNR", targetClientKey: 9 },
          ],
        },
        {
          clientKey: 2,
          type: "outcome",
          text: "Search Flights → confirm dates/passenger ages → select fare bundle → confirm price → enter passenger & contact details → confirm total → add ancillaries → Payments.",
          order: 2,
          options: [],
        },
        {
          clientKey: 3,
          type: "outcome",
          text: "Open the passenger record on the existing PNR and use the relevant edit field to correct the title, name, or nationality.",
          order: 3,
          options: [],
        },
        {
          clientKey: 4,
          type: "outcome",
          text: "Open the Ancillary tab on the existing PNR and update the selection (Baggage, Meal, Seat, Insurance, SSR, Airport Services).",
          order: 4,
          options: [],
        },
        {
          clientKey: 5,
          type: "outcome",
          text: "Open Booking Information on the PNR and click Split to move the passenger(s) to a new, separate PNR.",
          order: 5,
          options: [],
        },
        {
          clientKey: 6,
          type: "question",
          text: "Add or remove the infant?",
          order: 6,
          options: [
            { label: "Add an infant", targetClientKey: 7 },
            { label: "Remove an infant", targetClientKey: 8 },
          ],
        },
        {
          clientKey: 7,
          type: "outcome",
          text: "Open the passenger record and click Add Infant.",
          order: 7,
          options: [],
        },
        {
          clientKey: 8,
          type: "outcome",
          text: "Open the passenger record and use Remove Pax on the infant entry.",
          order: 8,
          options: [],
        },
        {
          clientKey: 9,
          type: "outcome",
          text: "Use the History tab on the PNR to review passenger changes, splits, and reservation actions with date, user, and system notes.",
          order: 9,
          options: [],
        },
      ],
    });
    console.log(`Created decision tree for Making a New Booking (#${tree.id}).`);
  } else {
    console.log("Making a New Booking already has a decision tree — skipping.");
  }
}

async function fixModificationCancellationArticle() {
  const article = await prisma.article.findFirst({ where: { title: "Modification & Cancellation Checklists – All Hubs" } });
  if (!article) {
    console.warn("Modification & Cancellation Checklists article not found — skipping.");
    return;
  }

  const alreadyDone = await prisma.scenario.findFirst({
    where: { articleId: article.id, situation: { startsWith: "A passenger's modification isn't eligible" } },
  });
  if (alreadyDone) {
    console.log("Modification & Cancellation Checklists already audited — skipping.");
    return;
  }

  await prisma.article.update({
    where: { id: article.id },
    data: {
      scenarios: {
        create: [
          {
            situation: "A passenger's modification isn't eligible under the fare rules, but they insist they should be allowed to change it.",
            response: "Explain the applicable fare rule from the hub's Bundle Fares article. If the passenger has a genuine exceptional circumstance, escalate to the Duty Supervisor for an exception review — don't override the rule yourself.",
          },
          {
            situation: "A passenger fails caller verification partway through a modification or cancellation.",
            response: "Stop the request — do not proceed with any modification or cancellation details until verification passes. See Caller Verification – All Hubs.",
          },
          {
            situation: "A passenger wants to cancel, but the credit amount quoted is less than they expected.",
            response: "Confirm the original payment date/method and re-check the credit calculation with the passenger — if they still find it unsuitable, log it as a cancellation not completed due to credit amount.",
          },
          {
            situation: "The flight the passenger wants to modify into is now full.",
            response: "Offer the nearest available alternative dates/flights — there's no override for a fully-booked flight.",
          },
        ],
      },
      escalations: {
        create: [
          {
            department: "Duty Supervisor",
            condition: "Passenger requests a modification/cancellation/refund exception outside standard eligibility",
            content: "Escalate exception requests to the Duty Supervisor for review — do not grant exceptions directly",
          },
        ],
      },
    },
  });

  console.log("Added 4 scenarios + 1 escalation to: Modification & Cancellation Checklists – All Hubs");
}

async function main() {
  await fixNewBookingArticle();
  await fixModificationCancellationArticle();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
