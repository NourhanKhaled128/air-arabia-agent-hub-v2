import { prisma } from "@/lib/prisma";
import type { QuickReferenceHub } from "@/lib/quick-reference-data";
import { QUICK_REFERENCE_HUBS as DEFAULT_QUICK_REFERENCE_HUBS } from "@/lib/quick-reference-data";

const SETTING_KEY = "quickReferenceHubs";

export async function getQuickReferenceHubs(): Promise<QuickReferenceHub[]> {
  const row = await prisma.appSetting.findUnique({ where: { key: SETTING_KEY } });
  if (!row) return DEFAULT_QUICK_REFERENCE_HUBS;

  try {
    const parsed = JSON.parse(row.value);
    return Array.isArray(parsed) ? parsed : DEFAULT_QUICK_REFERENCE_HUBS;
  } catch {
    return DEFAULT_QUICK_REFERENCE_HUBS;
  }
}

export async function saveQuickReferenceHubs(hubs: QuickReferenceHub[]) {
  await prisma.appSetting.upsert({
    where: { key: SETTING_KEY },
    create: { key: SETTING_KEY, value: JSON.stringify(hubs) },
    update: { value: JSON.stringify(hubs) },
  });
}
