import { chromium } from "playwright";
const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${SITE_URL}/Training`);
  const heading = await page.locator("h1, h2").first().innerText().catch(() => "(no heading)");
  const subtitle = await page
    .locator("p")
    .filter({ hasText: /module|Training manuals/i })
    .first()
    .innerText()
    .catch(() => "(no subtitle match)");
  const cardTitles = await page.locator("a:has-text('Module')").allInnerTexts();
  console.log("Heading:", heading);
  console.log("Subtitle:", subtitle);
  console.log("Module links found:", cardTitles.length);
  for (const t of cardTitles) console.log(" -", t.split("\n")[0]);
  await browser.close();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
