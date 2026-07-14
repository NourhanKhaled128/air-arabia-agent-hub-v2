// Creates the "Jeddah (JED) Terminal Relocation" KB article on the real deployed
// site via the admin session + the same /api/articles endpoint the admin UI uses.
// Direct DB access (port 5432) isn't reachable from this environment, so this
// goes through the live app over HTTPS instead, same as the other *-via-admin
// scripts in this folder.
//
// Requires ADMIN_EMAIL / ADMIN_PASSWORD in .env. Run with:
//   npx tsx scripts/create-jeddah-article-via-admin.ts

import "dotenv/config";
import { chromium } from "playwright";
import { buildArticleSectionsCreateData } from "../lib/article-service";

const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";
const GENERAL_INFO_ID = 11;
const TITLE = "Jeddah (JED) Terminal Relocation — Fly Jinnah (9P) & Air Arabia (G9/E5)";

const sections = buildArticleSectionsCreateData({
  procedures: [
    {
      title: "Confirm airline and travel date before quoting a terminal",
      content:
        "Check which airline the passenger is flying (9P vs G9/E5) and the travel date, then compare against the relevant cutover date: 9P moves to T4 on 12 September 2026; G9/E5 move to T4 on 21 September 2026. Before those dates, the old terminal (Hajj Terminal for 9P, North Terminal for G9/E5) still applies.",
    },
  ],
  scenarios: [
    {
      situation: "A Fly Jinnah (9P) passenger asks which Jeddah terminal to use for a flight on 15 September 2026.",
      response: "Terminal 4 (T4) — 9P moved there effective 12 September 2026, so this flight is after the cutover.",
    },
    {
      situation: "An Air Arabia (G9 or E5) passenger asks which Jeddah terminal to use for a flight on 15 September 2026.",
      response: "Still the North Terminal — G9/E5 don't move to Terminal 4 (T4) until 21 September 2026.",
    },
    {
      situation: "A passenger asks about the Jeddah terminal today, before either cutover date.",
      response:
        "9P currently operates from the Hajj Terminal (moving to T4 on 12 September 2026), and G9/E5 currently operate from the North Terminal (moving to T4 on 21 September 2026).",
    },
  ],
  notes: [
    {
      type: "Warning",
      content:
        "Two different cutover dates apply at Jeddah (JED): 9P → T4 effective 12 September 2026; G9/E5 → T4 effective 21 September 2026. Always confirm the airline and travel date before quoting a terminal.",
    },
  ],
  keywords: ["Jeddah", "JED", "Terminal 4", "T4", "Hajj Terminal", "North Terminal", "Fly Jinnah", "9P", "G9", "E5"],
  chatTemplates: [
    {
      title: "Jeddah terminal relocation (English)",
      content:
        "Just to confirm — Fly Jinnah (9P) moves to Terminal 4 at Jeddah from 12 September 2026, and Air Arabia (G9/E5) moves to Terminal 4 from 21 September 2026. Before those dates, 9P is at the Hajj Terminal and G9/E5 are at the North Terminal.",
    },
    {
      title: "انتقال صالات جدة (Arabic)",
      content:
        "نود إفادتكم بأن رحلات Fly Jinnah (9P) ستنتقل إلى الصالة 4 في مطار جدة اعتباراً من 12 سبتمبر 2026، بينما تنتقل رحلات العربية للطيران (G9/E5) إلى الصالة 4 اعتباراً من 21 سبتمبر 2026. وحتى ذلك الحين، تعمل 9P من صالة الحج وتعمل G9/E5 من الصالة الشمالية.",
    },
  ],
  emailTemplates: [
    {
      title: "Jeddah terminal relocation (English)",
      subject: "Jeddah (JED) — terminal change notice",
      body: "Dear [Customer Name],\n\nThank you for reaching out about your Jeddah flight.\n\nPlease note the following terminal changes at Jeddah (JED):\n- Fly Jinnah (9P): final day at the Hajj Terminal is 11 September 2026. From 12 September 2026, 9P operates from Terminal 4 (T4).\n- Air Arabia (G9 & E5): final day at the North Terminal is 20 September 2026. From 21 September 2026, G9/E5 operates from Terminal 4 (T4).\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support",
    },
    {
      title: "انتقال صالات جدة (Arabic)",
      subject: "مطار جدة - إشعار تغيير الصالة",
      body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لتواصلكم بخصوص رحلتكم عبر مطار جدة.\n\nنود إفادتكم بالتغييرات التالية في الصالات بمطار جدة:\n- Fly Jinnah (9P): آخر يوم تشغيل من صالة الحج هو 11 سبتمبر 2026. واعتباراً من 12 سبتمبر 2026، ستعمل رحلات 9P من الصالة 4.\n- العربية للطيران (G9 وE5): آخر يوم تشغيل من الصالة الشمالية هو 20 سبتمبر 2026. واعتباراً من 21 سبتمبر 2026، ستعمل رحلات G9/E5 من الصالة 4.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران",
    },
  ],
});

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("Logging in...");
  await page.goto(`${SITE_URL}/admin/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([page.waitForURL(`${SITE_URL}/admin`), page.click('button[type="submit"]')]);
  console.log("Logged in.");

  await page.goto(`${SITE_URL}/admin/articles?q=Jeddah`);
  const existingText = await page.locator("body").innerText();
  if (existingText.includes(TITLE) || existingText.includes("Jeddah (JED) Terminal Relocation")) {
    console.log("Skip (already exists): Jeddah terminal article");
    await browser.close();
    return;
  }

  const response = await page.request.post(`${SITE_URL}/api/articles`, {
    data: {
      title: TITLE,
      categoryId: GENERAL_INFO_ID,
      description:
        "Fly Jinnah (9P) and Air Arabia (G9/E5) are relocating to Terminal 4 (T4) at Jeddah (JED), on two different effective dates.",
      overview:
        "Fly Jinnah (9P): final day of operations at the Hajj Terminal is 11 September 2026. Effective 12 September 2026, 9P flights operate from Terminal 4 (T4).\n\nAir Arabia (G9 & E5): final day of operations at the North Terminal is 20 September 2026. Effective 21 September 2026, G9 & E5 flights operate from Terminal 4 (T4).\n\nThe two carriers move on different dates — always check both the airline and the travel date before confirming a terminal.",
      author: "Nourhan Khaled",
      status: "Published",
      ...sections,
    },
  });

  if (!response.ok()) {
    console.error(`Failed: ${response.status()} ${await response.text()}`);
    process.exitCode = 1;
  } else {
    const created = await response.json();
    console.log(`Created article: ${created.title} (#${created.id}), status: ${created.status}`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
