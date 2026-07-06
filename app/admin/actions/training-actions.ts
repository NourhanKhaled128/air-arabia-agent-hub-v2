"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createTrainingCourse,
  updateTrainingCourse,
  deleteTrainingCourse,
} from "@/lib/training-service";

function parseScore(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string" || value.trim() === "") return undefined;
  const score = Number(value);
  return Number.isFinite(score) ? score : undefined;
}

export async function createTrainingCourseAction(formData: FormData) {
  await createTrainingCourse({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    duration: formData.get("duration") as string,
    passingScore: parseScore(formData.get("passingScore")),
    status: formData.get("status") as string,
  });

  revalidatePath("/admin/training");
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

  revalidatePath("/admin/training");
  redirect("/admin/training");
}

export async function deleteTrainingCourseAction(id: number) {
  await deleteTrainingCourse(id);

  revalidatePath("/admin/training");
}
