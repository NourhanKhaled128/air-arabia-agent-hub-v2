"use server";

import {
  startQuizAttempt,
  saveQuizAnswer,
  getResumableAttempt,
  finalizeQuizAttempt,
  getAttemptsByEmail,
} from "@/lib/quiz-service";
import { requirePortalUser } from "@/lib/portal-dal";

export async function startQuizAttemptAction(data: {
  quizId: number;
  previousClassFeedback?: string;
}) {
  const user = await requirePortalUser();

  const result = await startQuizAttempt({
    quizId: data.quizId,
    name: user.name,
    email: user.email,
    previousClassFeedback: data.previousClassFeedback?.trim() || undefined,
  });

  return { attemptId: result.attemptId, startedAt: result.startedAt.toISOString() };
}

export async function saveQuizAnswerAction(data: {
  attemptId: number;
  questionId: number;
  choiceId: number | null;
}) {
  const user = await requirePortalUser();

  await saveQuizAnswer({ ...data, email: user.email });
}

export async function getResumableAttemptAction(data: { attemptId: number; quizId: number }) {
  const user = await requirePortalUser();

  const result = await getResumableAttempt({ ...data, email: user.email });
  if (!result) return null;

  return { ...result, startedAt: result.startedAt.toISOString() };
}

export async function finalizeQuizAttemptAction(attemptId: number) {
  const user = await requirePortalUser();

  return finalizeQuizAttempt(attemptId, user.email);
}

/** The logged-in agent's own quiz history — no email argument, so it's structurally
 * impossible to fetch anyone else's history through this action. */
export async function getMyQuizHistoryAction() {
  const user = await requirePortalUser();

  const attempts = await getAttemptsByEmail(user.email);
  return attempts.map((a) => ({ ...a, submittedAt: a.submittedAt ? a.submittedAt.toISOString() : null }));
}
