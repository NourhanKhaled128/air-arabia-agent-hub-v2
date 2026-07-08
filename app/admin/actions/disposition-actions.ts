"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createDispositionCode,
  updateDispositionCode,
  deleteDispositionCode,
} from "@/lib/disposition-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createDispositionCodeAction(formData: FormData) {
  const disposition = await createDispositionCode({
    code: formData.get("code") as string,
    label: formData.get("label") as string,
    description: formData.get("description") as string,
    active: formData.get("active") === "true",
  });

  await logAction("Created", "DispositionCode", disposition.id, await currentUserName());

  revalidatePath("/admin/disposition-codes");
  revalidatePath("/disposition-codes");
  redirect("/admin/disposition-codes");
}

export async function updateDispositionCodeAction(
  id: number,
  formData: FormData
) {
  await updateDispositionCode(id, {
    code: formData.get("code") as string,
    label: formData.get("label") as string,
    description: formData.get("description") as string,
    active: formData.get("active") === "true",
  });

  await logAction("Updated", "DispositionCode", id, await currentUserName());

  revalidatePath("/admin/disposition-codes");
  revalidatePath("/disposition-codes");
  redirect("/admin/disposition-codes");
}

export async function deleteDispositionCodeAction(id: number) {
  await deleteDispositionCode(id);

  await logAction("Deleted", "DispositionCode", id, await currentUserName());

  revalidatePath("/admin/disposition-codes");
  revalidatePath("/disposition-codes");
}

export async function deleteManyDispositionCodesAction(ids: number[]) {
  await prisma.dispositionCode.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "DispositionCode", null, await currentUserName());

  revalidatePath("/admin/disposition-codes");
  revalidatePath("/disposition-codes");
}
