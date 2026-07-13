import { prisma } from "../lib/prisma";

async function updateHandlingComplaints() {
  const article = await prisma.article.findFirst({ where: { title: "Handling Complaints – All Hubs" } });
  if (!article) {
    console.warn("Handling Complaints article not found — skipping update.");
    return;
  }

  const existingStepCount = await prisma.procedureStep.count({ where: { articleId: article.id } });

  await prisma.article.update({
    where: { id: article.id },
    data: {
      procedures: {
        create: [
          {
            stepNo: existingStepCount + 1,
            title: "Categorizing DS follow-up requests",
            content:
              "Follow-up requests added in DS under the wrong category delay handling and resolution — always get the category right. A follow-up can only be added if the caller has an open SP Case. Do not raise a follow-up for closed cases or those marked \"No Response Required\". Always add a clear note explaining why the passenger called, assign the follow-up to the correct team using the \"Assign to Team\" option, and inform the passenger that the follow-up has been raised and they will be contacted shortly.",
          },
          {
            stepNo: existingStepCount + 2,
            title: "Follow-up — Customer Relation Team",
            content:
              "Make sure the case is open (status not closed, or not \"No Response Required\"). Add a clear note on the request (why the passenger called), then add the DS follow-up with Assign to Team set to Customer Relation. Inform the passenger the follow-up is done and they will get a reply ASAP.",
          },
          {
            stepNo: existingStepCount + 3,
            title: "Follow-up — Customer Support Team",
            content:
              "Make sure the case is open (status not closed, or not \"No Response Required\"). Add a clear note on the request (why the passenger called), then add the DS follow-up with Assign to Team set to Customer Support. Inform the passenger the follow-up is done and they will get a reply ASAP.",
          },
          {
            stepNo: existingStepCount + 4,
            title: "Follow-up — Payment issue",
            content:
              "This option can only be used for payment-issue complaints. Make sure the case is open (status not closed, or not \"No Response Required\"). Add a clear note on the request (why the passenger called), then add the DS follow-up with Assign to Team set to Customer Support. Inform the passenger the follow-up is done and they will get a reply ASAP.",
          },
          {
            stepNo: existingStepCount + 5,
            title: "Follow-up — Baggage cases",
            content:
              "Make sure the case is open (status not closed, or not \"No Response Required\"). Add a clear note on the request (why the passenger called), then add the DS follow-up with Assign to Team set to Baggage team — this will show as the Lost and Found team.",
          },
        ],
      },
      scenarios: {
        create: [
          {
            situation: "A passenger calls to check on an existing complaint or case.",
            response:
              "Confirm the case is open (not closed, not \"No Response Required\") before raising anything — a follow-up cannot be added otherwise. Add a clear note on why the passenger called, then use \"Assign to Team\" to route it correctly: Customer Relation or Customer Support for general complaints, Payment issue for payment complaints only, or Baggage (routes to Lost and Found) for baggage cases. Inform the passenger the follow-up has been raised and they'll be contacted shortly.",
          },
        ],
      },
      keywords: {
        create: [{ value: "ds follow-up" }, { value: "sp case" }, { value: "assign to team" }],
      },
    },
  });

  console.log(`Updated: ${article.title}`);
}

async function updateSystemsOverview() {
  const article = await prisma.article.findFirst({
    where: { title: "Contact Center Systems Overview – Accel Aero, Sprinklr, Caesar & Teams" },
  });
  if (!article) {
    console.warn("Contact Center Systems Overview article not found — skipping update.");
    return;
  }

  await prisma.article.update({
    where: { id: article.id },
    data: {
      notes: {
        create: [
          {
            type: "Information",
            content:
              "DS/Sprinklr follow-ups can only be added to an open SP Case (never to closed cases or those marked \"No Response Required\") and must be assigned to the correct team — Customer Relation, Customer Support, Payment issue, or Baggage. See \"Handling Complaints – All Hubs\" for the full categorization checklist.",
          },
        ],
      },
    },
  });

  console.log(`Updated: ${article.title}`);
}

async function main() {
  await updateHandlingComplaints();
  await updateSystemsOverview();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
