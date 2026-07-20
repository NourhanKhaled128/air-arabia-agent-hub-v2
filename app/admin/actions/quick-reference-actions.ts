"use server";

import { revalidatePath } from "next/cache";
import { saveQuickReferenceHubs } from "@/lib/quick-reference-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";
import type { QuickReferenceHub } from "@/lib/quick-reference-data";

export async function saveQuickReferenceHubsAction(hubs: QuickReferenceHub[]) {
  await requireAdminUser();

  await saveQuickReferenceHubs(hubs);

  const user = await getCurrentAdminUser();
  await logAction("Updated", "QuickReferenceHubs", null, user?.name ?? "System");

  revalidatePath("/admin/quick-reference");
  revalidatePath("/quick-reference");
}
