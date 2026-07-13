import { chromium } from "playwright";
const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";

const slugs = [
  "baggage-claims-all-hubs-1783838669489",
  "handling-complaints-all-hubs-1783838669372",
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const slug of slugs) {
    await page.goto(`${SITE_URL}/Knowledge/${slug}`);
    const text = await page.locator("main, body").first().innerText();
    console.log(`\n\n########## ${slug} ##########`);
    console.log(text);
  }

  // Also check decision trees listing for anything baggage/complaint related.
  await page.goto(`${SITE_URL}/decision-trees`);
  await page.waitForTimeout(500);
  const treeLinks = await page.locator("a[href^='/decision-trees/']").allInnerTexts();
  console.log("\n\n########## Decision Trees list ##########");
  console.log(treeLinks.join("\n"));

  await browser.close();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
