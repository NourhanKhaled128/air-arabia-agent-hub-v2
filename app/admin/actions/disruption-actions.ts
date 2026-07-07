"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createDisruption,
  deleteDisruption,
  updateDisruption,
} from "@/lib/disruption-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createDisruptionAction(formData: FormData) {
  const disruption = await createDisruption({
    airportCode: formData.get("airportCode") as string,
    message: formData.get("message") as string,
    level: (formData.get("level") as string) || "Medium",
    active: formData.get("active") === "on",
  });

  await logAction("Created", "Disruption", disruption.id, await currentUserName());

  revalidatePath("/admin/disruptions");
  revalidatePath("/disruptions");
  revalidatePath("/", "layout");
  redirect("/admin/disruptions");
}

export async function updateDisruptionAction(
  id: number,
  formData: FormData
) {
  await updateDisruption(id, {
    airportCode: formData.get("airportCode") as string,
    message: formData.get("message") as string,
    level: (formData.get("level") as string) || "Medium",
    active: formData.get("active") === "on",
  });

  await logAction("Updated", "Disruption", id, await currentUserName());

  revalidatePath("/admin/disruptions");
  revalidatePath("/disruptions");
  revalidatePath("/", "layout");
  redirect("/admin/disruptions");
}

export async function deleteDisruptionAction(id: number) {
  await deleteDisruption(id);

  await logAction("Deleted", "Disruption", id, await currentUserName());

  revalidatePath("/admin/disruptions");
  revalidatePath("/disruptions");
  revalidatePath("/", "layout");
}
