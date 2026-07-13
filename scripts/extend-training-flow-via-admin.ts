// Extends the Training flow with hub-specific modules 13-19, and renumbers
// the old "Module 13: Call Handling Wrap-up" to Module 20 so it stays the
// closing module. Uses the same browser-automation approach as
// publish-training-flow-via-admin.ts (login as a real session, then call the
// site's own JSON API), since raw Postgres isn't reachable from this network.
//
// Requires ADMIN_EMAIL / ADMIN_PASSWORD in .env. Run with:
//   npx tsx scripts/extend-training-flow-via-admin.ts

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

  // Find current Training article IDs by title so we know which to PUT.
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
  console.log("Found existing module IDs:", idByTitle);

  const module12 = MODULES.find((m) => m.title.startsWith("Module 12:"));
  const module20 = MODULES.find((m) => m.title.startsWith("Module 20:"));
  if (!module12 || !module20) throw new Error("Could not find Module 12/20 in content file");

  const module12Id = idByTitle["Module 12: Baggage Claims & Handling Complaints"];
  const oldModule13Id = idByTitle["Module 13: Call Handling Wrap-up — Quality & Escalations"];

  if (!module12Id || !oldModule13Id) {
    throw new Error(
      `Could not find live IDs for Module 12 / old Module 13. Found titles: ${Object.keys(idByTitle).join(", ")}`
    );
  }

  async function putModule(id: number, mod: (typeof MODULES)[number]) {
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

  console.log("Updating Module 12 transition text...");
  await putModule(module12Id, module12);

  console.log("Renumbering old Module 13 -> Module 20...");
  await putModule(oldModule13Id, module20);

  const newModules = MODULES.filter((m) => {
    const num = Number(m.title.match(/^Module (\d+):/)?.[1]);
    return num >= 13 && num <= 19;
  });

  console.log(`Creating ${newModules.length} new modules (13-19)...`);
  for (const mod of newModules) {
    const response = await page.request.post(`${SITE_URL}/api/articles`, {
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
      throw new Error(`Failed to create "${mod.title}": ${response.status()} ${await response.text()}`);
    }
    const created = await response.json();
    console.log(`Created: ${mod.title} (#${created.id})`);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
