"use server";

import { submitQuizAttempt } from "@/lib/quiz-service";

export async function submitQuizAttemptAction(data: {
  quizId: number;
  name: string;
  email: string;
  previousClassFeedback?: string;
  startedAt: string;
  answers: { questionId: number; choiceId: number | null }[];
}) {
  return submitQuizAttempt({
    quizId: data.quizId,
    name: data.name.trim(),
    email: data.email.trim(),
    previousClassFeedback: data.previousClassFeedback?.trim() || undefined,
    startedAt: new Date(data.startedAt),
    answers: data.answers,
  });
}
