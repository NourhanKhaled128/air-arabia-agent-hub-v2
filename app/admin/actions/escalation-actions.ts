"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createEscalationContact,
  updateEscalationContact,
  deleteEscalationContact,
} from "@/lib/escalation-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createEscalationContactAction(formData: FormData) {
  await requireAdminUser();

  const escalation = await createEscalationContact({
    issueType: formData.get("issueType") as string,
    escalateTo: formData.get("escalateTo") as string,
    contactInfo: formData.get("contactInfo") as string,
    notes: formData.get("notes") as string,
    active: formData.get("active") === "true",
  });

  await logAction("Created", "EscalationContact", escalation.id, await currentUserName());

  revalidatePath("/admin/escalation");
  revalidatePath("/escalation");
  redirect("/admin/escalation");
}

export async function updateEscalationContactAction(
  id: number,
  formData: FormData
) {
  await requireAdminUser();

  await updateEscalationContact(id, {
    issueType: formData.get("issueType") as string,
    escalateTo: formData.get("escalateTo") as string,
    contactInfo: formData.get("contactInfo") as string,
    notes: formData.get("notes") as string,
    active: formData.get("active") === "true",
  });

  await logAction("Updated", "EscalationContact", id, await currentUserName());

  revalidatePath("/admin/escalation");
  revalidatePath("/escalation");
  redirect("/admin/escalation");
}

export async function deleteEscalationContactAction(id: number) {
  await requireAdminUser();

  await deleteEscalationContact(id);

  await logAction("Deleted", "EscalationContact", id, await currentUserName());

  revalidatePath("/admin/escalation");
  revalidatePath("/escalation");
}

export async function deleteManyEscalationContactsAction(ids: number[]) {
  await requireAdminUser();

  await prisma.escalationContact.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "EscalationContact", null, await currentUserName());

  revalidatePath("/admin/escalation");
  revalidatePath("/escalation");
}
