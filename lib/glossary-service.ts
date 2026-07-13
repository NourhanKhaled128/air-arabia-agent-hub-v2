import { prisma } from "@/lib/prisma";
import type { GlossaryEntry } from "@/components/GlossaryFinder";
import { GLOSSARY_ENTRIES as DEFAULT_GLOSSARY_ENTRIES } from "@/lib/glossary-data";

const SETTING_KEY = "glossaryEntries";

export async function getGlossaryEntries(): Promise<GlossaryEntry[]> {
  const row = await prisma.appSetting.findUnique({ where: { key: SETTING_KEY } });
  if (!row) return DEFAULT_GLOSSARY_ENTRIES;

  try {
    const parsed = JSON.parse(row.value);
    return Array.isArray(parsed) ? parsed : DEFAULT_GLOSSARY_ENTRIES;
  } catch {
    return DEFAULT_GLOSSARY_ENTRIES;
  }
}

export async function saveGlossaryEntries(entries: GlossaryEntry[]) {
  await prisma.appSetting.upsert({
    where: { key: SETTING_KEY },
    create: { key: SETTING_KEY, value: JSON.stringify(entries) },
    update: { value: JSON.stringify(entries) },
  });
}
