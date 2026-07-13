import { chromium } from "playwright";
const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${SITE_URL}/Knowledge`);
  await page.waitForSelector("a[href^='/Knowledge/']");
  const titles = await page.locator("a[href^='/Knowledge/'] h2, a[href^='/Knowledge/'] h3").allInnerTexts();

  const found = titles.filter((t) => /rakbank|etihad guest/i.test(t));
  console.log("Total articles listed:", titles.length);
  console.log("RAKBANK/Etihad matches:", found);

  await browser.close();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
