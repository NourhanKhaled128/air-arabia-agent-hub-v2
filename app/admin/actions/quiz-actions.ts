"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz,
  deleteAttempt,
  type QuizInput,
} from "@/lib/quiz-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createQuizAction(input: QuizInput) {
  await requireAdminUser();

  const quiz = await createQuiz(input);

  await logAction("Created", "Quiz", quiz.id, await currentUserName());

  revalidatePath("/admin/quizzes");
  revalidatePath("/Quizzes");
  redirect("/admin/quizzes");
}

export async function updateQuizAction(id: number, input: QuizInput) {
  await requireAdminUser();

  await updateQuiz(id, input);

  await logAction("Updated", "Quiz", id, await currentUserName());

  revalidatePath("/admin/quizzes");
  revalidatePath("/Quizzes");
  redirect("/admin/quizzes");
}

export async function deleteQuizAction(id: number) {
  await requireAdminUser();

  await deleteQuiz(id);

  await logAction("Deleted", "Quiz", id, await currentUserName());

  revalidatePath("/admin/quizzes");
  revalidatePath("/Quizzes");
}

export async function deleteManyQuizzesAction(ids: number[]) {
  await requireAdminUser();

  await prisma.quiz.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Quiz", null, await currentUserName());

  revalidatePath("/admin/quizzes");
  revalidatePath("/Quizzes");
}

export async function publishQuizAction(id: number) {
  await requireAdminUser();

  await publishQuiz(id);

  await logAction("Published", "Quiz", id, await currentUserName());

  revalidatePath("/admin/quizzes");
  revalidatePath("/Quizzes");
}

export async function unpublishQuizAction(id: number) {
  await requireAdminUser();

  await unpublishQuiz(id);

  await logAction("Unpublished", "Quiz", id, await currentUserName());

  revalidatePath("/admin/quizzes");
  revalidatePath("/Quizzes");
}

export async function deleteAttemptAction(id: number, quizId: number) {
  await requireAdminUser();

  await deleteAttempt(id);

  await logAction("Deleted", "QuizAttempt", id, await currentUserName());

  revalidatePath(`/admin/quizzes/${quizId}/results`);
}
