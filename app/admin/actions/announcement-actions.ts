"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/lib/announcement-service";

function parseDate(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function createAnnouncementAction(
  formData: FormData
) {
  await createAnnouncement({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    priority: formData.get("priority") as string,
    status: formData.get("status") as string,
    audience: formData.get("audience") as string,
    publishDate: parseDate(formData.get("publishDate")),
    expiryDate: parseDate(formData.get("expiryDate")),
  });

  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function updateAnnouncementAction(
  id: number,
  formData: FormData
) {
  await updateAnnouncement(id, {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    priority: formData.get("priority") as string,
    status: formData.get("status") as string,
    audience: formData.get("audience") as string,
    publishDate: parseDate(formData.get("publishDate")),
    expiryDate: parseDate(formData.get("expiryDate")),
  });

  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}

export async function deleteAnnouncementAction(id: number) {
  await deleteAnnouncement(id);

  revalidatePath("/admin/announcements");
}