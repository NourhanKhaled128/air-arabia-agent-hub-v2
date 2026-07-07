"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createNotification,
  updateNotification,
  deleteNotification,
} from "@/lib/notification-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

function parseSendDate(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function createNotificationAction(formData: FormData) {
  const notification = await createNotification({
    title: formData.get("title") as string,
    message: formData.get("message") as string,
    audience: formData.get("audience") as string,
    status: formData.get("status") as string,
    sendDate: parseSendDate(formData.get("sendDate")),
  });

  await logAction("Created", "Notification", notification.id, await currentUserName());

  revalidatePath("/admin/notifications");
  revalidatePath("/", "layout");
  redirect("/admin/notifications");
}

export async function updateNotificationAction(
  id: number,
  formData: FormData
) {
  await updateNotification(id, {
    title: formData.get("title") as string,
    message: formData.get("message") as string,
    audience: formData.get("audience") as string,
    status: formData.get("status") as string,
    sendDate: parseSendDate(formData.get("sendDate")) ?? null,
  });

  await logAction("Updated", "Notification", id, await currentUserName());

  revalidatePath("/admin/notifications");
  revalidatePath("/", "layout");
  redirect("/admin/notifications");
}

export async function deleteNotificationAction(id: number) {
  await deleteNotification(id);

  await logAction("Deleted", "Notification", id, await currentUserName());

  revalidatePath("/admin/notifications");
  revalidatePath("/", "layout");
}
