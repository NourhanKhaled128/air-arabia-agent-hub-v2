// Attaches screenshots to the relevant procedure steps on two existing AirRewards
// articles:
//   #137 "AirRewards Loyalty Program – All Hubs" — splits "Redemption" into
//        3 screenshotted steps (select yes / log in / scroll to redeem).
//   #178 "RAKBANK Air Arabia Platinum Credit Card & Points Linking – All Hubs" —
//        splits "Register & activate AirRewards" into 2 screenshotted steps
//        (verify membership in Accel Aero / resend activation email).
//
// Requires the screenshots to already be deployed at the given /uploads/ paths
// (i.e. run this only after the commit adding them has been pushed and deployed).
//
// Requires ADMIN_EMAIL / ADMIN_PASSWORD in .env. Run with:
//   npx tsx scripts/add-redemption-and-rakbank-screenshots.ts

import "dotenv/config";
import { chromium } from "playwright";

const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";
const AUTHOR = "Nourhan Khaled";

const AIRREWARDS_ARTICLE_ID = 137;
const RAKBANK_ARTICLE_ID = 178;

const IMG = {
  activateAccount: "/uploads/1783942547000-rakbank-accelaero-activate-account.png",
  notAMember: "/uploads/1783942547001-rakbank-accelaero-not-a-member-error.png",
  selectYes: "/uploads/1783942547002-airrewards-redemption-select-yes.png",
  login: "/uploads/1783942547003-airrewards-redemption-login.png",
  scrollToRedeem: "/uploads/1783942547004-airrewards-redemption-scroll-to-redeem.png",
};

const AIRREWARDS_ARTICLE = {
  title: "AirRewards Loyalty Program – All Hubs",
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
    { title: "Redemption — select Yes", content: "On the payment page, select \"Yes\" for \"Would you like to pay using your AirRewards points?\"", image: IMG.selectYes },
    { title: "Redemption — log in to AirRewards", content: "The passenger logs in with their AirRewards email and password to redeem points.", image: IMG.login },
    { title: "Redemption — scroll to redeem", content: "On the balance summary screen, scroll the slider to select how many points to redeem. Minimum 3,000 points required for fare or baggage redemption; no minimum for admin fee, seat, meal, insurance or airport services. Points cannot be used against airport taxes.", image: IMG.scrollToRedeem },
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

const RAKBANK_ARTICLE = {
  title: "RAKBANK Air Arabia Platinum Credit Card & Points Linking – All Hubs",
  description: "Card benefits, AirRewards earning rates, and how to link or troubleshoot RAKBANK points transfers into a passenger's AirRewards account.",
  overview:
    "The RAKBANK Air Arabia Platinum Credit Card has no joining fee and comes with a 20,000-point AirRewards welcome bonus. Cardholders also get a free annual return ticket to any destination, complimentary airport lounge access, free 10kg extra baggage and 2 meal vouchers, a 0% Easy Payment Plan with no processing fees, 50% off VOX Cinemas, and complimentary airport transfers with Careem.\n\nAirRewards points are earned on card spend: 1.75 points per AED 5 spent on airarabia.com and on international spend outside the UAE, 1.25 points per AED 5 on UAE domestic spend, and 0.30 points per AED 5 on special category purchases (conditions apply — see www.rakbank.ae for details). Applications are made digitally through RAKBANK's website and only take a few minutes.",
  procedures: [
    { title: "Verify AirRewards membership in Accel Aero", content: "Search the passenger's email under Search Customers in Accel Aero. If the account isn't registered or active, the search returns \"This user is not an Air Rewards member.\"", image: IMG.notAMember },
    { title: "Resend the AirRewards activation email", content: "Open the customer record, click Edit, then the AirRewards tab. If it shows \"AirRewards email confirmation is pending,\" click Resend AirRewards Activation Email so the passenger can complete activation.", image: IMG.activateAccount },
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

  // Sanity-check the images are actually deployed before wiring them into the DB.
  for (const url of Object.values(IMG)) {
    const res = await fetch(`${SITE_URL}${url}`, { method: "HEAD" });
    if (!res.ok) {
      throw new Error(`Image not yet deployed at ${url} (status ${res.status}). Push & wait for deploy first.`);
    }
  }
  console.log("All screenshot URLs are live.");

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Logging in...");
  await page.goto(`${SITE_URL}/admin/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([page.waitForURL(`${SITE_URL}/admin`), page.click('button[type="submit"]')]);
  console.log("Logged in.");

  // Resolve General Information categoryId / AirRewards folderId (same as before).
  await page.goto(`${SITE_URL}/admin/articles/new`);
  const categorySelect = page.locator("select").first();
  await categorySelect.selectOption({ label: "General Information" });
  await page.waitForTimeout(300);
  const categoryId = Number(await categorySelect.inputValue());

  const folderSelect = page.locator("select").nth(1);
  await folderSelect.selectOption({ label: "AirRewards" });
  const folderId = Number(await folderSelect.inputValue());
  console.log(`Resolved categoryId=${categoryId}, folderId=${folderId}`);

  for (const [id, spec] of [
    [AIRREWARDS_ARTICLE_ID, AIRREWARDS_ARTICLE],
    [RAKBANK_ARTICLE_ID, RAKBANK_ARTICLE],
  ] as const) {
    const putResponse = await page.request.put(`${SITE_URL}/api/articles/${id}`, {
      data: {
        ...spec,
        categoryId,
        folderId,
        author: AUTHOR,
        status: "Published",
      },
    });
    if (!putResponse.ok()) {
      throw new Error(`Failed to update #${id}: ${putResponse.status()} ${await putResponse.text()}`);
    }
    console.log(`Updated: ${spec.title} (#${id})`);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
