"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createDispositionCode,
  updateDispositionCode,
  deleteDispositionCode,
  parseDispositionCodesWorkbook,
  replaceDispositionCodesFromRows,
} from "@/lib/disposition-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createDispositionCodeAction(formData: FormData) {
  await requireAdminUser();

  const disposition = await createDispositionCode({
    code: formData.get("code") as string,
    label: formData.get("label") as string,
    description: formData.get("description") as string,
    scenario: (formData.get("scenario") as string) || undefined,
    category: (formData.get("category") as string) || undefined,
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
  await requireAdminUser();

  await updateDispositionCode(id, {
    code: formData.get("code") as string,
    label: formData.get("label") as string,
    description: formData.get("description") as string,
    scenario: (formData.get("scenario") as string) || undefined,
    category: (formData.get("category") as string) || undefined,
    active: formData.get("active") === "true",
  });

  await logAction("Updated", "DispositionCode", id, await currentUserName());

  revalidatePath("/admin/disposition-codes");
  revalidatePath("/disposition-codes");
  redirect("/admin/disposition-codes");
}

export async function deleteDispositionCodeAction(id: number) {
  await requireAdminUser();

  await deleteDispositionCode(id);

  await logAction("Deleted", "DispositionCode", id, await currentUserName());

  revalidatePath("/admin/disposition-codes");
  revalidatePath("/disposition-codes");
}

export async function deleteManyDispositionCodesAction(ids: number[]) {
  await requireAdminUser();

  await prisma.dispositionCode.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "DispositionCode", null, await currentUserName());

  revalidatePath("/admin/disposition-codes");
  revalidatePath("/disposition-codes");
}

export async function uploadDispositionCodesAction(formData: FormData) {
  await requireAdminUser();

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an .xlsx or .xls file to upload." };
  }

  try {
    const buffer = await file.arrayBuffer();
    const rows = await parseDispositionCodesWorkbook(buffer);
    await replaceDispositionCodesFromRows(rows);

    await logAction("Uploaded", "DispositionCode", null, await currentUserName());

    revalidatePath("/admin/disposition-codes");
    revalidatePath("/disposition-codes");

    return { success: true, count: rows.length };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to process the uploaded file.",
    };
  }
}
