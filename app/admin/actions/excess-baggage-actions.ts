"use server";

import { revalidatePath } from "next/cache";
import {
  parseExcessBaggageWorkbook,
  replaceExcessBaggageRatesFromRows,
  applyExcessBaggageRatesToKB,
} from "@/lib/excess-baggage-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function uploadExcessBaggageRatesAction(formData: FormData) {
  await requireAdminUser();

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose the excess baggage rates .xlsx file to upload." };
  }

  try {
    const buffer = await file.arrayBuffer();
    const rows = await parseExcessBaggageWorkbook(buffer);

    await replaceExcessBaggageRatesFromRows(rows);
    await applyExcessBaggageRatesToKB(rows);

    await logAction("Uploaded", "ExcessBaggageRate", null, await currentUserName());

    revalidatePath("/admin/excess-baggage-rates");
    revalidatePath("/Knowledge");
    revalidatePath("/decision-trees");
    revalidatePath("/Knowledge/g9-excess-baggage-rates-g9");
    revalidatePath("/Knowledge/3o-excess-baggage-rates-3o");
    revalidatePath("/Knowledge/9p-excess-baggage-rates-9p");
    revalidatePath("/Knowledge/e5-excess-baggage-rates-e5");

    return { success: true, count: rows.length };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to process the uploaded file.",
    };
  }
}
