import "dotenv/config";
import { chromium } from "playwright";
import fs from "fs";

const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env");

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${SITE_URL}/admin/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([page.waitForURL(`${SITE_URL}/admin`), page.click('button[type="submit"]')]);
  console.log("Logged in.");

  // Articles: 146 = Baggage Claims, 145 = Handling Complaints
  for (const id of [146, 145]) {
    await page.goto(`${SITE_URL}/admin/articles/${id}`);
    await page.waitForSelector("select");
    const categorySelect = page.locator("select").first();
    const categoryId = await categorySelect.inputValue();
    let folderId = "";
    const folderSelect = page.locator("select").nth(1);
    if (await folderSelect.count()) {
      folderId = await folderSelect.inputValue().catch(() => "");
    }
    console.log(`Article #${id}: categoryId=${categoryId} folderId=${folderId}`);
    const html = await page.content();
    fs.writeFileSync(`C:/Users/NELHAL~1/AppData/Local/Temp/admin-article-${id}.html`, html, "utf-8");
  }

  // Decision trees: 54 = Baggage Claim, 53 = Handling a Complaint
  for (const id of [54, 53]) {
    await page.goto(`${SITE_URL}/admin/decision-trees/${id}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const html = await page.content();
    fs.writeFileSync(`C:/Users/NELHAL~1/AppData/Local/Temp/admin-tree-${id}.html`, html, "utf-8");
    console.log(`Saved admin tree #${id}`);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
