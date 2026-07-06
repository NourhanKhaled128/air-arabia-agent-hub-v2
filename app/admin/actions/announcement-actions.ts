"use server";

import { revalidatePath } from "next/cache";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/lib/announcement-service";

export async function createAnnouncementAction(
  formData: FormData
) {
  await createAnnouncement({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    priority: formData.get("priority") as string,
    status: formData.get("status") as string,
    audience: formData.get("audience") as string,
  });

  revalidatePath("/admin/announcements");
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
  });

  revalidatePath("/admin/announcements");
}

export async function deleteAnnouncementAction(id: number) {
  await deleteAnnouncement(id);

  revalidatePath("/admin/announcements");
}