"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  parseAirportsWorkbook,
  replaceAirportsFromRows,
  updateAirport,
} from "@/lib/airport-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function updateAirportAction(id: number, formData: FormData) {
  await requireAdminUser();

  await updateAirport(id, {
    code: formData.get("code") as string,
    city: formData.get("city") as string,
    airport: formData.get("airport") as string,
    country: formData.get("country") as string,
    terminal: (formData.get("terminal") as string) || undefined,
  });

  await logAction("Updated", "Airport", id, await currentUserName());

  revalidatePath("/admin/airport-codes");
  revalidatePath("/airport-codes");
  redirect("/admin/airport-codes");
}

export async function uploadAirportsAction(formData: FormData) {
  await requireAdminUser();

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an .xlsx or .xls file to upload." };
  }

  try {
    const buffer = await file.arrayBuffer();
    const rows = await parseAirportsWorkbook(buffer);
    await replaceAirportsFromRows(rows);

    await logAction("Uploaded", "Airport", null, await currentUserName());

    revalidatePath("/admin/airport-codes");
    revalidatePath("/airport-codes");

    return { success: true, count: rows.length };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to process the uploaded file.",
    };
  }
}

export async function deleteAirportAction(id: number) {
  await requireAdminUser();

  await prisma.airport.delete({ where: { id } });

  await logAction("Deleted", "Airport", id, await currentUserName());

  revalidatePath("/admin/airport-codes");
  revalidatePath("/airport-codes");
}

export async function deleteManyAirportsAction(ids: number[]) {
  await requireAdminUser();

  await prisma.airport.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Airport", null, await currentUserName());

  revalidatePath("/admin/airport-codes");
  revalidatePath("/airport-codes");
}
