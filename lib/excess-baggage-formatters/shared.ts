import { prisma } from "@/lib/prisma";
import type { ExcessBaggageRow } from "@/lib/excess-baggage-service";

const CURRENCY_AR: Record<string, string> = {
  AED: "درهمًا إماراتيًا",
  MAD: "درهمًا مغربيًا",
  PKR: "روبية باكستانية",
  EGP: "جنيهًا مصريًا",
  JOD: "دينارًا أردنيًا",
  EUR: "يورو",
  GBP: "جنيهًا إسترلينيًا",
  CHF: "فرنكًا سويسريًا",
  SAR: "ريالًا سعوديًا",
  USD: "دولارًا أمريكيًا",
  KWD: "دينارًا كويتيًا",
  OMR: "ريالًا عمانيًا",
  BHD: "دينارًا بحرينيًا",
};

export function currencyAr(currency: string): string {
  return CURRENCY_AR[currency.toUpperCase()] ?? currency;
}

function titleCaseWord(word: string): string {
  // Keep short all-letter tokens as-is (acronyms like GCC, KSA, CIS, UAE, UK).
  if (word.length <= 4 && /^[A-Za-z]+$/.test(word) && word === word.toUpperCase()) {
    return word;
  }
  return word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word;
}

export function titleCase(value: string) {
  return value
    .split(/(\s|\/)/)
    .map((part) => (part === " " || part === "/" ? part : titleCaseWord(part)))
    .join("");
}

/** Only matches a simple single-value cell like "AED 45" — compound/multi-line cells return null. */
export function simpleRate(rate: string): { currency: string; value: number } | null {
  const trimmed = rate.trim();
  if (trimmed.includes("\n")) return null;

  const match = trimmed.match(/^([A-Za-z]+)\s*([\d,]+)$/);
  if (!match) return null;

  return { currency: match[1].toUpperCase(), value: Number(match[2].replace(/,/g, "")) };
}

export function minMaxRange(rows: { rate: string }[]): { min: number; max: number; currency: string } | null {
  let min: number | null = null;
  let max: number | null = null;
  let currency = "";

  for (const row of rows) {
    const parsed = simpleRate(row.rate);
    if (!parsed) continue;
    currency = parsed.currency;
    if (min === null || parsed.value < min) min = parsed.value;
    if (max === null || parsed.value > max) max = parsed.value;
  }

  if (min === null || max === null) return null;
  return { min, max, currency };
}

export function findRate(
  rows: ExcessBaggageRow[],
  match: { section?: string; region?: string; destination?: string }
): string | null {
  const row = rows.find(
    (r) =>
      (match.section === undefined || r.section === match.section) &&
      (match.region === undefined || r.region === match.region) &&
      (match.destination === undefined || r.destination.toLowerCase() === match.destination!.toLowerCase())
  );
  return row?.rate.trim() ?? null;
}

/** Groups rows by region, sub-grouping by identical rate, for a readable bullet-list overview block. */
export function formatRegionRateList(rows: ExcessBaggageRow[]): string {
  const regionOrder: string[] = [];
  const byRegion = new Map<string, ExcessBaggageRow[]>();

  for (const row of rows) {
    const region = row.region ?? row.destination;
    if (!byRegion.has(region)) {
      byRegion.set(region, []);
      regionOrder.push(region);
    }
    byRegion.get(region)!.push(row);
  }

  const lines: string[] = [];

  for (const region of regionOrder) {
    const items = byRegion.get(region)!;
    const rateOrder: string[] = [];
    const byRate = new Map<string, string[]>();

    for (const item of items) {
      const rate = item.rate.replace(/\n/g, "; ");
      if (!byRate.has(rate)) {
        byRate.set(rate, []);
        rateOrder.push(rate);
      }
      byRate.get(rate)!.push(item.destination);
    }

    if (rateOrder.length === 1) {
      const countries = [...new Set(items.map((i) => i.destination))];
      if (countries.length === 1 && countries[0].toLowerCase() === region.toLowerCase()) {
        lines.push(`- ${titleCase(region)} — ${rateOrder[0]}`);
      } else {
        lines.push(`- ${titleCase(region)} (${countries.map(titleCase).join(", ")}) — ${rateOrder[0]}`);
      }
    } else {
      for (const rate of rateOrder) {
        const countries = byRate.get(rate)!;
        lines.push(`- ${titleCase(region)} — ${countries.map(titleCase).join(", ")}: ${rate}`);
      }
    }
  }

  return lines.join("\n");
}

/** Groups rows purely by rate value (ignoring region), for sheets like 3O/E5 where destinations sharing a rate should be listed together. */
export function formatByRate(rows: ExcessBaggageRow[]): string {
  const rateOrder: string[] = [];
  const byRate = new Map<string, string[]>();

  for (const row of rows) {
    const rate = row.rate.replace(/\n/g, "; ");
    if (!byRate.has(rate)) {
      byRate.set(rate, []);
      rateOrder.push(rate);
    }
    byRate.get(rate)!.push(row.destination);
  }

  return rateOrder
    .map((rate) => `- ${byRate.get(rate)!.map(titleCase).join(", ")} — ${rate}`)
    .join("\n");
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export async function updateArticleOverview(slug: string, overview: string) {
  await prisma.article.update({ where: { slug }, data: { overview } });
}

export async function updateChatTemplateByTitle(articleSlug: string, title: string, content: string) {
  const article = await prisma.article.findUnique({ where: { slug: articleSlug }, select: { id: true } });
  if (!article) return;

  await prisma.chatTemplate.updateMany({
    where: { articleId: article.id, title },
    data: { content },
  });
}

export async function updateEmailTemplateByTitle(articleSlug: string, title: string, body: string) {
  const article = await prisma.article.findUnique({ where: { slug: articleSlug }, select: { id: true } });
  if (!article) return;

  await prisma.emailTemplate.updateMany({
    where: { articleId: article.id, title },
    data: { body },
  });
}

export async function updateDecisionTreeNode(treeTitle: string, nodeOrder: number, text: string) {
  const tree = await prisma.decisionTree.findFirst({ where: { title: treeTitle }, select: { id: true } });
  if (!tree) return;

  await prisma.decisionNode.updateMany({
    where: { treeId: tree.id, order: nodeOrder },
    data: { text },
  });
}
