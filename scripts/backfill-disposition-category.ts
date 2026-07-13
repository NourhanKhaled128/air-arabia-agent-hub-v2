import { prisma } from "../lib/prisma";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const codes = await prisma.dispositionCode.findMany({
    select: { code: true, category: true },
  });
  const exactCodeToCategory = new Map(codes.filter((c) => c.category).map((c) => [c.code, c.category as string]));
  const categoryNames = new Set(codes.filter((c) => c.category).map((c) => c.category as string));

  const dispositions = await prisma.disposition.findMany({
    select: { id: true, code: true, articleId: true, article: { select: { title: true } } },
  });

  const updates: { id: number; category: string; newCode: string }[] = [];
  const unresolved: typeof dispositions = [];

  for (const d of dispositions) {
    if (!d.code) {
      unresolved.push(d);
      continue;
    }

    const prefixMatch = /^(.+?) – (.+)$/.exec(d.code);

    if (prefixMatch && categoryNames.has(prefixMatch[1])) {
      // Article-level "Type – Subtype" disambiguation prefix (near-dispositions / multi-type articles).
      updates.push({ id: d.id, category: prefixMatch[1], newCode: prefixMatch[2] });
      continue;
    }

    const directCategory = exactCodeToCategory.get(d.code);
    if (directCategory) {
      // Exact match against a global code (including hub-prefixed codes like "G9 – Bundle comparison",
      // where the prefix is a hub, not a category, so the whole string is the real code).
      updates.push({ id: d.id, category: directCategory, newCode: d.code });
      continue;
    }

    unresolved.push(d);
  }

  console.log(`Resolved: ${updates.length} / ${dispositions.length}`);
  console.log(`Unresolved: ${unresolved.length}`);
  for (const u of unresolved) {
    console.log(`  - article #${u.articleId} (${u.article.title}) code="${u.code}"`);
  }

  const categoryCounts = new Map<string, number>();
  for (const u of updates) categoryCounts.set(u.category, (categoryCounts.get(u.category) ?? 0) + 1);
  console.log("\nCategory distribution:");
  for (const [cat, count] of [...categoryCounts.entries()].sort()) console.log(`  ${cat}: ${count}`);

  const codeChanges = updates.filter((u) => {
    const original = dispositions.find((d) => d.id === u.id)!;
    return original.code !== u.newCode;
  });
  console.log(`\nCodes that will be stripped of their prefix: ${codeChanges.length}`);
  for (const c of codeChanges.slice(0, 10)) {
    const original = dispositions.find((d) => d.id === c.id)!;
    console.log(`  "${original.code}" -> category="${c.category}" code="${c.newCode}"`);
  }

  if (DRY_RUN) {
    console.log("\nDry run — no changes applied.");
    return;
  }

  if (unresolved.length > 0) {
    console.log("\nRefusing to apply: there are unresolved rows. Fix the mapping logic first.");
    process.exitCode = 1;
    return;
  }

  for (const u of updates) {
    await prisma.disposition.update({
      where: { id: u.id },
      data: { category: u.category, code: u.newCode },
    });
  }
  console.log(`\nApplied ${updates.length} updates.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
