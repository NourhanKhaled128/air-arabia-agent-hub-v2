"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/lib/announcement-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

function parseDate(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseTeamId(formData: FormData): number | null {
  const raw = formData.get("teamId") as string;
  return raw ? Number(raw) : null;
}

export async function createAnnouncementAction(
  formData: FormData
) {
  await requireAdminUser();

  const announcement = await createAnnouncement({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    priority: formData.get("priority") as string,
    status: formData.get("status") as string,
    audience: formData.get("audience") as string,
    teamId: parseTeamId(formData),
    isPlatformUpdate: formData.get("isPlatformUpdate") === "on",
    publishDate: parseDate(formData.get("publishDate")),
    expiryDate: parseDate(formData.get("expiryDate")),
  });

  await logAction("Created", "Announcement", announcement.id, await currentUserName());

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
  revalidatePath("/whats-new");
  redirect("/admin/announcements");
}

export async function updateAnnouncementAction(
  id: number,
  formData: FormData
) {
  await requireAdminUser();

  await updateAnnouncement(id, {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    priority: formData.get("priority") as string,
    status: formData.get("status") as string,
    audience: formData.get("audience") as string,
    teamId: parseTeamId(formData),
    isPlatformUpdate: formData.get("isPlatformUpdate") === "on",
    publishDate: parseDate(formData.get("publishDate")),
    expiryDate: parseDate(formData.get("expiryDate")),
  });

  await logAction("Updated", "Announcement", id, await currentUserName());

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
  revalidatePath("/whats-new");
  redirect("/admin/announcements");
}

export async function deleteAnnouncementAction(id: number) {
  await requireAdminUser();

  await deleteAnnouncement(id);

  await logAction("Deleted", "Announcement", id, await currentUserName());

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
  revalidatePath("/whats-new");
}

export async function deleteManyAnnouncementsAction(ids: number[]) {
  await requireAdminUser();

  await prisma.announcement.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Announcement", null, await currentUserName());

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
  revalidatePath("/whats-new");
}