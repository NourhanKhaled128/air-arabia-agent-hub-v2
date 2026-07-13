// Registers the new Champion Tools pages (Glossary, Quick Reference, Recent
// Changes, Practice Mode) as sidebar links via the real admin form — sidebar
// link creation is a Next.js Server Action tied to a <form>, not a JSON API,
// so this drives the actual /admin/sidebar/new form like a real user.
//
// Requires ADMIN_EMAIL / ADMIN_PASSWORD in .env. Run with:
//   npx tsx scripts/add-sidebar-links-via-admin.ts

import "dotenv/config";
import { chromium } from "playwright";

const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";

const NEW_LINKS = [
  { label: "Glossary", href: "/glossary", icon: "BookOpen" },
  { label: "Quick Reference", href: "/quick-reference", icon: "FileText" },
  { label: "Recent Changes", href: "/recent-changes", icon: "Clock3" },
  { label: "Practice Mode", href: "/practice", icon: "GraduationCap" },
];

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

  // Skip any link whose href is already registered.
  await page.goto(`${SITE_URL}/admin/sidebar`);
  const existingHrefs = await page.locator("table tbody tr").evaluateAll((rows) =>
    rows.map((r) => r.textContent ?? "")
  );

  for (const link of NEW_LINKS) {
    if (existingHrefs.some((text) => text.includes(link.href))) {
      console.log(`Skip (already exists): ${link.label}`);
      continue;
    }

    await page.goto(`${SITE_URL}/admin/sidebar/new`);
    await page.fill('input[name="label"]', link.label);
    await page.fill('input[name="href"]', link.href);
    await page.selectOption('select[name="icon"]', link.icon);
    await Promise.all([
      page.waitForURL(`${SITE_URL}/admin/sidebar`),
      page.click('button:has-text("Save Link")'),
    ]);
    console.log(`Created sidebar link: ${link.label} -> ${link.href}`);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
