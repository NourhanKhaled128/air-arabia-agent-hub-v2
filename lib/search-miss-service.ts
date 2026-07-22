import { prisma } from "@/lib/prisma";

export async function logSearchMiss(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return;
  await prisma.searchMiss.create({ data: { query: normalized } });
}

export async function getTopSearchMisses(limit = 10) {
  const misses = await prisma.searchMiss.groupBy({
    by: ["query"],
    _count: { query: true },
    orderBy: { _count: { query: "desc" } },
    take: limit,
  });

  return misses.map((m) => ({ query: m.query, count: m._count.query }));
}
