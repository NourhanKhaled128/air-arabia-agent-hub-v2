"use server";

import {
  startQuizAttempt,
  saveQuizAnswer,
  getResumableAttempt,
  finalizeQuizAttempt,
} from "@/lib/quiz-service";

export async function startQuizAttemptAction(data: {
  quizId: number;
  name: string;
  email: string;
  previousClassFeedback?: string;
}) {
  const result = await startQuizAttempt({
    quizId: data.quizId,
    name: data.name.trim(),
    email: data.email.trim(),
    previousClassFeedback: data.previousClassFeedback?.trim() || undefined,
  });

  return { attemptId: result.attemptId, startedAt: result.startedAt.toISOString() };
}

export async function saveQuizAnswerAction(data: {
  attemptId: number;
  questionId: number;
  choiceId: number | null;
}) {
  await saveQuizAnswer(data);
}

export async function getResumableAttemptAction(data: { attemptId: number; quizId: number }) {
  const result = await getResumableAttempt(data);
  if (!result) return null;

  return { ...result, startedAt: result.startedAt.toISOString() };
}

export async function finalizeQuizAttemptAction(attemptId: number) {
  return finalizeQuizAttempt(attemptId);
}
