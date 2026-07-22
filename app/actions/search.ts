"use server";

import { logSearchMiss } from "@/lib/search-miss-service";

export async function logSearchMissAction(query: string) {
  await logSearchMiss(query);
}
