// Publishes the Training flow (scripts/training-flow-content.ts) through the
// live deployed site instead of a direct database connection — for networks
// where raw Postgres (port 5432) is blocked but normal HTTPS works.
//
// Logs into /admin/login as a real browser session (required: login is a
// Next.js Server Action, not a plain HTTP endpoint), uses the admin UI's
// "Delete All" (filtered to the Training category) to remove the current
// modules, then calls POST /api/articles — the same JSON endpoint the admin
// "new article" form uses — once per module, reusing the authenticated
// session's cookies.
//
// Requires ADMIN_EMAIL / ADMIN_PASSWORD in .env. Run with:
//   npx tsx scripts/publish-training-flow-via-admin.ts

import "dotenv/config";
import { chromium } from "playwright";
import { TRAINING_CATEGORY_ID, MODULES } from "./training-flow-content";

const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env");
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("dialog", (dialog) => dialog.accept());

  console.log("Logging in...");
  await page.goto(`${SITE_URL}/admin/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([page.waitForURL(`${SITE_URL}/admin`), page.click('button[type="submit"]')]);
  console.log("Logged in.");

  console.log("Opening admin articles list, filtering to Training...");
  await page.goto(`${SITE_URL}/admin/articles`);
  await page.selectOption("select#category-filter, select:has(option:text('Category: All'))", "Training").catch(async () => {
    // Fall back to the second <select> on the page (Status, Category) if no id is present.
    const selects = page.locator("select");
    await selects.nth(1).selectOption("Training");
  });

  const deleteAllButton = page.getByRole("button", { name: /Delete All \(\d+\)/ });
  await deleteAllButton.waitFor();
  const buttonText = await deleteAllButton.innerText();
  console.log(`Found existing Training articles — ${buttonText}.`);

  const beforeRows = await page.locator("tbody tr").allInnerTexts();
  console.log("Current Training articles about to be deleted:");
  for (const row of beforeRows) {
    console.log(` - ${row.split("\n")[0]}`);
  }

  if (process.argv.includes("--dry-run")) {
    console.log("--dry-run: stopping before delete/create.");
    await browser.close();
    return;
  }

  await deleteAllButton.click();
  await page.getByText("No articles yet.").waitFor({ timeout: 15000 }).catch(() => {
    console.log("(Table may just be showing 0 filtered rows rather than the empty-state message — continuing.)");
  });
  console.log("Deleted existing Training articles.");

  console.log(`Creating ${MODULES.length} new Training modules via POST /api/articles...`);
  for (const mod of MODULES) {
    const response = await page.request.post(`${SITE_URL}/api/articles`, {
      data: {
        title: mod.title,
        categoryId: TRAINING_CATEGORY_ID,
        description: mod.description,
        overview: mod.overview,
        author: "Nourhan Khaled",
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

  console.log("Verifying via /Training...");
  await page.goto(`${SITE_URL}/Training`);
  const subtitle = await page.locator("p").first().innerText().catch(() => "(couldn't read subtitle)");
  console.log(`/Training subtitle: ${subtitle}`);

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
