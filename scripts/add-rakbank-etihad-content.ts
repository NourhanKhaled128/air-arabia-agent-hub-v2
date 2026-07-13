// Enriches the AirRewards KB with RAKBANK / Etihad Guest transfer content:
//   1. Updates the existing "AirRewards Loyalty Program – All Hubs" article
//      (cashback/redemption value, no blackout dates, partner network, hub-based
//      registration, family head designation).
//   2. Creates "Transferring AirRewards Points to Etihad Guest – All Hubs".
//   3. Creates "RAKBANK Air Arabia Platinum Credit Card & Points Linking – All Hubs".
//
// Requires ADMIN_EMAIL / ADMIN_PASSWORD in .env. Run with:
//   npx tsx scripts/add-rakbank-etihad-content.ts

import "dotenv/config";
import { chromium } from "playwright";

const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";
const AUTHOR = "Nourhan Khaled";
const EXISTING_TITLE = "AirRewards Loyalty Program – All Hubs";

// ---------------------------------------------------------------------------
// Merged content for the existing article. PUT replaces every section, so
// this includes the article's original content (kept verbatim from
// scripts/seed-kb-content.ts) plus the new additions.
// ---------------------------------------------------------------------------

const UPDATED_EXISTING_ARTICLE = {
  title: EXISTING_TITLE,
  description:
    "Overview of the AirRewards loyalty programme — earning and cashback rates, registration, family-head accounts, redemption and expiry, partner network and redemption value.",
  overview:
    "AirRewards is Air Arabia's loyalty programme — the more a passenger flies, the more points they earn, redeemable against ticket discounts or free services. Passengers can only earn points for their own flights.\n\nCashback rates: 5% as points on tickets and baggage purchases; 10% as points on seat, meal, insurance and airport services; no points on airport taxes.\n\nPoints expire 2 years from the travel date.\n\nRedemption value is fixed at 100 points = 1 USD, with no blackout dates — every seat is available for point redemption, any day of the year. Points can be combined with cash if the passenger doesn't have enough points to cover the full amount.\n\nAirRewards also has a partner network where passengers earn or redeem points outside of flying: the RAKBANK Air Arabia Platinum Credit Card, Union Insurance (200 points per AED 100), Kalyan Jewellers (up to 40 points per AED 100), Sixt car rental, Rocketmiles/Kaligo hotel bookings, Buzzpay mobile recharges, and Land of Fashion.",
  procedures: [
    { title: "Registration", content: "Register online via the website (sign-up takes about a minute), or through the Call Center via Accel Aero (Join Air Rewards option). Registration is via the passenger's booking hub portal — Sharjah, Abu Dhabi, Morocco or Egypt." },
    { title: "Eligibility", content: "Any passenger 12 years or older can register, earn and redeem full points. Children aged 2–11 must be linked to a family head account, and the family head must already be an existing AirRewards member." },
    { title: "Family head accounts", content: "Up to 8 family members can be linked to one account. The family head earns 50% of a linked passenger's points (the other 50% is forfeited); the family head account itself earns 0 points directly. The family head is designated by email during registration — family members are linked to that email as the head of the account." },
    { title: "Earning — future flights", content: "Add the AirRewards ID to the PNR. Points are credited within 24 hours after the full ticket is used." },
    { title: "Earning — past flights", content: "Passenger claims points from their account via \"Claim points for past flight,\" within a maximum of 90 days from the travel date." },
    { title: "Redemption", content: "Redeem via the passenger's account on the payment page. Minimum 3,000 points required for fare or baggage redemption; no minimum for seat, meal, insurance or airport services. Points cannot be used against airport taxes." },
  ],
  scenarios: [
    { situation: "A passenger asks if their 10-year-old child can register for their own AirRewards account.", response: "Not directly — a child aged 2–11 must be linked to a family head account, and that family head must already be an existing AirRewards member. Only passengers 12+ can register and earn/redeem in their own right." },
    { situation: "A family head with 3 linked family members asks why their own account shows 0 points after a family member's flight.", response: "That's expected — the family head account itself doesn't earn points directly; it earns 50% of each linked passenger's points from their flights." },
    { situation: "A passenger wants to redeem 2,000 points against a seat selection.", response: "No minimum applies to seat, meal, insurance or airport service redemptions — the 3,000-point minimum only applies to fare or baggage redemption. Proceed with the seat redemption." },
  ],
  notes: [
    { type: "Information", content: "Points cannot be earned for another passenger's flights — only for the account holder's own travel." },
    { type: "Warning", content: "Points expire 2 years from the travel date — check the account before assuming a balance is still valid." },
  ],
  keywords: ["airrewards", "loyalty", "points", "cashback", "redemption", "redemption value", "partner network"],
  chatTemplates: [
    { title: "AirRewards points query", content: "Hi! AirRewards points work like this: you earn 5% back as points on tickets and baggage, or 10% on seat/meal/insurance/airport services (no points on airport taxes). Points expire 2 years after travel. Want me to check your current balance or help you register?" },
  ],
  emailTemplates: [
    { title: "AirRewards registration & earning", subject: "Your AirRewards account", body: "Dear passenger,\n\nThanks for your interest in AirRewards, our loyalty programme. You can register free online or through our Call Center. Once registered, you'll earn 5% cashback as points on tickets and baggage, and 10% on seat, meal, insurance and airport services (airport taxes don't earn points). To credit points on a future flight, make sure your AirRewards ID is added to your booking — points post within 24 hours of travel. For a past flight, you can claim points from your account within 90 days of the travel date. Points are valid for 2 years from the date of travel.\n\nLet us know if you'd like help registering or checking your balance.\n\nAir Arabia Customer Support" },
  ],
};

// ---------------------------------------------------------------------------
// New article: Etihad Guest transfer
// ---------------------------------------------------------------------------

const ETIHAD_TRANSFER_ARTICLE = {
  title: "Transferring AirRewards Points to Etihad Guest – All Hubs",
  description: "Rules and step-by-step process for converting AirRewards points into Etihad Guest Miles.",
  overview:
    "AirRewards has a partnership with Etihad Guest that lets members convert AirRewards points into Etihad Guest Miles. The conversion rate is 2 AirRewards points = 1 Etihad Guest Mile. Transferred points should reflect in the passenger's Etihad Guest account within 24 hours. Transfers are final — they cannot be reversed or refunded once submitted.",
  procedures: [
    { title: "Log in to Etihad Guest", content: "The passenger must log in to their Etihad Guest account before starting a transfer — this is required before AirRewards points can be converted." },
    { title: "Log in to AirRewards", content: "The passenger logs in to their AirRewards account." },
    { title: "Start the conversion", content: "From the AirRewards dashboard, select \"Convert Points to Etihad Guest Miles.\"" },
    { title: "Enter points (even numbers only)", content: "Enter the number of AirRewards points to convert. Points must be transferred in even numbers — an odd amount will not go through." },
    { title: "Confirm", content: "Confirm the conversion. The converted miles should appear in the Etihad Guest account within 24 hours." },
  ],
  scenarios: [
    { situation: "A passenger wants to transfer 1,251 AirRewards points to Etihad Guest.", response: "Points must be transferred in even numbers — the passenger will need to round down to 1,250 (or up to 1,252) before the transfer will go through." },
    { situation: "A passenger transferred points to Etihad Guest 2 days ago and they still haven't appeared.", response: "Transfers normally reflect within 24 hours. Since it's been longer, advise the passenger to email airrewards@airarabia.com so the transfer can be investigated — the transfer itself cannot be reversed or resubmitted from the passenger's side." },
    { situation: "A passenger wants to link a second Etihad Guest account to their AirRewards account.", response: "Not possible — one Etihad Guest account can only be linked to a single AirRewards account, and an AirRewards account can't be linked to multiple Etihad Guest accounts." },
    { situation: "A passenger gets an error partway through the transfer process on the website.", response: "Ask them to clear their browser cache and cookies, then try the transfer again before escalating further." },
  ],
  notes: [
    { type: "Warning", content: "Transfers cannot be reversed or refunded once submitted — confirm the point amount with the passenger before they proceed." },
    { type: "Information", content: "An Etihad Guest account can only be linked to one AirRewards account, and vice versa — multiple linkages aren't supported." },
    { type: "Warning", content: "If a transfer error occurs mid-process, have the passenger clear their browser cache and cookies and retry before escalating to airrewards@airarabia.com." },
  ],
  keywords: ["etihad guest", "transfer points", "points conversion", "airrewards", "miles"],
  chatTemplates: [
    { title: "Etihad Guest transfer instructions", content: "You can convert your AirRewards points into Etihad Guest Miles at a rate of 2 AirRewards points = 1 Etihad Guest Mile. Just make sure you're logged in to both your Etihad Guest and AirRewards accounts, enter an even number of points on the conversion screen, and confirm — the miles should land in your Etihad Guest account within 24 hours. Note that once submitted, transfers can't be reversed." },
  ],
  emailTemplates: [
    { title: "AirRewards to Etihad Guest transfer", subject: "Transferring your AirRewards points to Etihad Guest", body: "Dear passenger,\n\nYou can convert your AirRewards points into Etihad Guest Miles at a rate of 2 AirRewards points = 1 Etihad Guest Mile. To transfer: log in to your Etihad Guest account first, then log in to AirRewards and select \"Convert Points to Etihad Guest Miles\" from your dashboard. Points must be entered in even numbers. Converted miles should reflect in your Etihad Guest account within 24 hours.\n\nPlease note transfers are final and cannot be reversed or refunded, and an Etihad Guest account can only be linked to one AirRewards account. If you run into an error during the transfer, try clearing your browser cache and cookies first. If your points still haven't arrived after 24 hours, let us know at airrewards@airarabia.com.\n\nAir Arabia Customer Support" },
  ],
};

// ---------------------------------------------------------------------------
// New article: RAKBANK card & points linking
// ---------------------------------------------------------------------------

const RAKBANK_ARTICLE = {
  title: "RAKBANK Air Arabia Platinum Credit Card & Points Linking – All Hubs",
  description: "Card benefits, AirRewards earning rates, and how to link or troubleshoot RAKBANK points transfers into a passenger's AirRewards account.",
  overview:
    "The RAKBANK Air Arabia Platinum Credit Card has no joining fee and comes with a 20,000-point AirRewards welcome bonus. Cardholders also get a free annual return ticket to any destination, complimentary airport lounge access, free 10kg extra baggage and 2 meal vouchers, a 0% Easy Payment Plan with no processing fees, 50% off VOX Cinemas, and complimentary airport transfers with Careem.\n\nAirRewards points are earned on card spend: 1.75 points per AED 5 spent on airarabia.com and on international spend outside the UAE, 1.25 points per AED 5 on UAE domestic spend, and 0.30 points per AED 5 on special category purchases (conditions apply — see www.rakbank.ae for details). Applications are made digitally through RAKBANK's website and only take a few minutes.",
  procedures: [
    { title: "Register & activate AirRewards", content: "The passenger must register for AirRewards and make sure the account is active before RAKBANK points can be linked." },
    { title: "Link the accounts with RAKBANK", content: "After the AirRewards account is active, the passenger contacts RAKBANK directly to link the same email address used on their AirRewards account to their bank account." },
    { title: "Points transferred before activation", content: "If RAKBANK points were transferred before the AirRewards account was activated, they will not appear automatically once the account is later activated. The passenger should either contact RAKBANK to resend the points, or wait for the next monthly transfer cycle." },
    { title: "Monthly claim window", content: "Points claims land between the 6th and 13th of the month following the transfer — advise the passenger not to expect points outside this window." },
  ],
  scenarios: [
    { situation: "A passenger says their RAKBANK points aren't showing in their AirRewards account.", response: "First confirm the AirRewards account is registered and active, and ask when it was activated relative to when the points were transferred. If the transfer happened before activation, it won't backfill automatically — the passenger needs RAKBANK to resend the points, or to wait for the next monthly cycle." },
    { situation: "A passenger activated their AirRewards account today and expects last month's RAKBANK points to appear immediately.", response: "Explain that points claims land between the 6th and 13th of the month following the transfer, so it may not be immediate even once linked — and if the transfer happened before activation, it needs to be resent by RAKBANK or wait for the next cycle." },
    { situation: "A passenger asks when their 20,000-point welcome bonus will post after approval.", response: "Direct them to RAKBANK for the exact bonus posting timeline, since that's managed on the bank's side, not through AirRewards." },
    { situation: "A passenger's AirRewards email doesn't match the email on file with RAKBANK.", response: "The passenger needs to contact RAKBANK to update the linked email to match their AirRewards account exactly — mismatched emails are a common reason points don't reflect." },
  ],
  notes: [
    { type: "Information", content: "Always confirm whether — and when — the AirRewards account was activated before troubleshooting missing RAKBANK points; this determines whether it's a pre-activation gap or a genuine missing transfer." },
    { type: "Warning", content: "Points transferred before AirRewards activation do not backfill automatically — RAKBANK must resend them manually, or the passenger waits for the next monthly cycle." },
    { type: "Information", content: "Monthly RAKBANK points claims post between the 6th and 13th of the following month." },
  ],
  keywords: ["rakbank", "platinum credit card", "points linking", "welcome bonus", "airrewards"],
  chatTemplates: [
    { title: "RAKBANK points not reflecting", content: "Let's check a couple of things — is your AirRewards account registered and active, and if so, when was it activated compared to when the RAKBANK points were sent? If the points were transferred before activation, they won't appear automatically — you'd need to ask RAKBANK to resend them, or wait for the next monthly cycle. Monthly claims normally post between the 6th and 13th of the following month." },
  ],
  emailTemplates: [
    { title: "RAKBANK AirRewards points linking", subject: "Linking your RAKBANK points to AirRewards", body: "Dear passenger,\n\nTo receive AirRewards points from your RAKBANK Air Arabia Platinum Credit Card, please make sure you've registered for AirRewards and that the account is active. Once active, contact RAKBANK directly to link the same email address used on your AirRewards account to your bank account.\n\nPlease note: if points were transferred before your AirRewards account was activated, they will not appear automatically after activation — you'll need to ask RAKBANK to resend them, or wait for the next monthly transfer cycle. Monthly points claims post between the 6th and 13th of the following month.\n\nAir Arabia Customer Support" },
  ],
};

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env");

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Logging in...");
  await page.goto(`${SITE_URL}/admin/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([page.waitForURL(`${SITE_URL}/admin`), page.click('button[type="submit"]')]);
  console.log("Logged in.");

  // --- Resolve General Information categoryId / AirRewards folderId from the New Article form's selects ---
  // (the AirRewards category was folded into General Information > AirRewards folder — see
  // scripts/fold-new-categories-into-general.ts — and app/(portal)/AirRewards/page.tsx queries
  // getArticlesByCategoryAndFolderName("General Information", "AirRewards") accordingly.)
  await page.goto(`${SITE_URL}/admin/articles/new`);
  const categorySelect = page.locator("select").first();
  await categorySelect.selectOption({ label: "General Information" });
  await page.waitForTimeout(300);

  const categoryId = Number(await categorySelect.inputValue());
  if (!categoryId) throw new Error('Could not resolve categoryId for "General Information".');

  const folderSelect = page.locator("select").nth(1);
  const folderOptions = await folderSelect.locator("option").allTextContents();
  let folderId: number | null = null;
  if (folderOptions.some((t) => t.trim() === "AirRewards")) {
    await folderSelect.selectOption({ label: "AirRewards" });
    folderId = Number(await folderSelect.inputValue());
  }
  console.log(`Resolved AirRewards categoryId=${categoryId}, folderId=${folderId}`);

  // --- Find the existing article's id ---
  await page.goto(`${SITE_URL}/admin/articles`);
  const selects = page.locator("select");
  await selects.nth(1).selectOption("General Information");
  await page.waitForTimeout(500);

  const rows = page.locator("tbody tr");
  const rowCount = await rows.count();
  let existingId: number | null = null;
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const title = (await row.locator("td").nth(1).innerText()).trim();
    if (title === EXISTING_TITLE) {
      const editHref = await row.locator("a[href^='/admin/articles/']").getAttribute("href");
      existingId = editHref ? Number(editHref.split("/").pop()) : null;
      break;
    }
  }
  if (!existingId) throw new Error(`Could not find existing article "${EXISTING_TITLE}" under AirRewards.`);
  console.log(`Found existing article #${existingId}.`);

  // --- 1. Update the existing article ---
  const putResponse = await page.request.put(`${SITE_URL}/api/articles/${existingId}`, {
    data: {
      ...UPDATED_EXISTING_ARTICLE,
      categoryId,
      folderId,
      author: AUTHOR,
      status: "Published",
    },
  });
  if (!putResponse.ok()) {
    throw new Error(`Failed to update #${existingId}: ${putResponse.status()} ${await putResponse.text()}`);
  }
  console.log(`Updated: ${EXISTING_TITLE} (#${existingId})`);

  // --- 2 & 3. Create the two new articles ---
  for (const spec of [ETIHAD_TRANSFER_ARTICLE, RAKBANK_ARTICLE]) {
    const postResponse = await page.request.post(`${SITE_URL}/api/articles`, {
      data: {
        ...spec,
        categoryId,
        folderId,
        author: AUTHOR,
        status: "Published",
      },
    });
    if (!postResponse.ok()) {
      throw new Error(`Failed to create "${spec.title}": ${postResponse.status()} ${await postResponse.text()}`);
    }
    const created = await postResponse.json();
    console.log(`Created: ${spec.title} (#${created.id})`);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
