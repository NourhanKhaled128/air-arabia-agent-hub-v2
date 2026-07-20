"use server";

import { revalidatePath } from "next/cache";
import { saveGlossaryEntries } from "@/lib/glossary-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";
import type { GlossaryEntry } from "@/components/GlossaryFinder";

export async function saveGlossaryEntriesAction(entries: GlossaryEntry[]) {
  await requireAdminUser();

  await saveGlossaryEntries(entries);

  const user = await getCurrentAdminUser();
  await logAction("Updated", "GlossaryEntries", null, user?.name ?? "System");

  revalidatePath("/admin/glossary");
  revalidatePath("/glossary");
}
