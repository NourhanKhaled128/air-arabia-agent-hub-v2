// Pushes the updated MODULES content (real screenshots reused from source KB
// articles, generated diagrams for gaps, and restructured step sequences)
// live by PUT-updating all 20 existing Training articles.
//
// Requires ADMIN_EMAIL / ADMIN_PASSWORD in .env. Run with:
//   npx tsx scripts/add-training-images-via-admin.ts

import "dotenv/config";
import { chromium } from "playwright";
import { TRAINING_CATEGORY_ID, MODULES, AUTHOR } from "./training-flow-content";

const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";

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

  await page.goto(`${SITE_URL}/admin/articles`);
  const selects = page.locator("select");
  await selects.nth(1).selectOption("Training");
  await page.waitForTimeout(500);

  const rows = page.locator("tbody tr");
  const rowCount = await rows.count();
  const idByTitle: Record<string, number> = {};
  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const title = (await row.locator("td").nth(1).innerText()).trim();
    const editHref = await row.locator("a[href^='/admin/articles/']").getAttribute("href");
    const id = editHref ? Number(editHref.split("/").pop()) : null;
    if (id) idByTitle[title] = id;
  }
  console.log(`Found ${Object.keys(idByTitle).length} live Training articles.`);

  for (const mod of MODULES) {
    // Titles for modules 3, 15, 17, 19 changed; match by module number prefix instead.
    const moduleNum = mod.title.match(/^Module (\d+):/)?.[1];
    const matchTitle = Object.keys(idByTitle).find((t) => t.startsWith(`Module ${moduleNum}:`));
    const id = matchTitle ? idByTitle[matchTitle] : undefined;

    if (!id) {
      console.error(`Could not find live ID for "${mod.title}" — skipping.`);
      continue;
    }

    const response = await page.request.put(`${SITE_URL}/api/articles/${id}`, {
      data: {
        title: mod.title,
        categoryId: TRAINING_CATEGORY_ID,
        description: mod.description,
        overview: mod.overview,
        author: AUTHOR,
        status: "Published",
        procedures: mod.procedures,
        scenarios: mod.scenarios,
        notes: mod.notes,
        keywords: mod.keywords,
      },
    });

    if (!response.ok()) {
      throw new Error(`Failed to update #${id} "${mod.title}": ${response.status()} ${await response.text()}`);
    }
    console.log(`Updated: ${mod.title} (#${id})`);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
