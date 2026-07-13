import { prisma } from "../lib/prisma";

async function main() {
  const codes = await prisma.dispositionCode.findMany({
    select: { category: true, code: true, scenario: true },
  });
  const scenarioByKey = new Map(codes.map((c) => [`${c.category}::${c.code}`, c.scenario]));

  const dispositions = await prisma.disposition.findMany({
    select: { id: true, category: true, code: true },
  });

  let updated = 0;
  let unmatched = 0;

  for (const d of dispositions) {
    const scenario = scenarioByKey.get(`${d.category}::${d.code}`);
    if (!scenario) {
      console.warn(`No matching global code for disposition #${d.id} (category="${d.category}", code="${d.code}")`);
      unmatched++;
      continue;
    }

    await prisma.disposition.update({ where: { id: d.id }, data: { scenario } });
    updated++;
  }

  console.log(`Updated: ${updated} / ${dispositions.length} | Unmatched: ${unmatched}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
