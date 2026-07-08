"use server";

import { revalidatePath } from "next/cache";
import {
  createHomeWidget,
  deleteHomeWidget,
  moveHomeWidget,
  updateHomeWidget,
} from "@/lib/home-widget-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function addHomeWidgetAction(type: string) {
  const widget = await createHomeWidget({ type, size: "half", order: 999 });

  await logAction("Created", "Home Widget", widget.id, await currentUserName());

  revalidatePath("/admin/home-widgets");
  revalidatePath("/", "layout");
}

export async function toggleHomeWidgetVisibleAction(id: number, visible: boolean) {
  await updateHomeWidget(id, { visible });

  await logAction("Updated", "Home Widget", id, await currentUserName());

  revalidatePath("/admin/home-widgets");
  revalidatePath("/", "layout");
}

export async function setHomeWidgetSizeAction(id: number, size: string) {
  await updateHomeWidget(id, { size });

  await logAction("Updated", "Home Widget", id, await currentUserName());

  revalidatePath("/admin/home-widgets");
  revalidatePath("/", "layout");
}

export async function moveHomeWidgetAction(id: number, direction: "up" | "down") {
  await moveHomeWidget(id, direction);

  revalidatePath("/admin/home-widgets");
  revalidatePath("/", "layout");
}

export async function deleteHomeWidgetAction(id: number) {
  await deleteHomeWidget(id);

  await logAction("Deleted", "Home Widget", id, await currentUserName());

  revalidatePath("/admin/home-widgets");
  revalidatePath("/", "layout");
}
