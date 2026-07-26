"use server";

import { requireAdminUser } from "@/lib/admin-dal";
import { checkAllLinks, type LinkCheckResult } from "@/lib/link-check-service";

export async function checkLinksAction(): Promise<LinkCheckResult[]> {
  await requireAdminUser();

  return checkAllLinks();
}
