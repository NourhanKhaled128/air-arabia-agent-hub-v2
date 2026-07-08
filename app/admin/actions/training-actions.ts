"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createTrainingCourse,
  updateTrainingCourse,
  deleteTrainingCourse,
} from "@/lib/training-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

function parseScore(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string" || value.trim() === "") return undefined;
  const score = Number(value);
  return Number.isFinite(score) ? score : undefined;
}

export async function createTrainingCourseAction(formData: FormData) {
  const course = await createTrainingCourse({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    duration: formData.get("duration") as string,
    passingScore: parseScore(formData.get("passingScore")),
    status: formData.get("status") as string,
  });

  await logAction("Created", "Training Course", course.id, await currentUserName());

  revalidatePath("/admin/training");
  revalidatePath("/", "layout");
  redirect("/admin/training");
}

export async function updateTrainingCourseAction(
  id: number,
  formData: FormData
) {
  await updateTrainingCourse(id, {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    duration: formData.get("duration") as string,
    passingScore: parseScore(formData.get("passingScore")),
    status: formData.get("status") as string,
  });

  await logAction("Updated", "Training Course", id, await currentUserName());

  revalidatePath("/admin/training");
  revalidatePath("/", "layout");
  redirect("/admin/training");
}

export async function deleteTrainingCourseAction(id: number) {
  await deleteTrainingCourse(id);

  await logAction("Deleted", "Training Course", id, await currentUserName());

  revalidatePath("/admin/training");
  revalidatePath("/", "layout");
}

export async function deleteManyTrainingCoursesAction(ids: number[]) {
  await prisma.trainingCourse.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Training Course", null, await currentUserName());

  revalidatePath("/admin/training");
  revalidatePath("/", "layout");
}
