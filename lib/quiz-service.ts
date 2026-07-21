import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";
import type { Prisma } from "@prisma/client";

export interface QuizChoiceInput {
  clientKey: number;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestionInput {
  clientKey: number;
  text: string;
  points: number;
  choices: QuizChoiceInput[];
}

export interface QuizInput {
  title: string;
  description?: string | null;
  timeLimitMinutes: number;
  passingScore: number;
  showAnswers: boolean;
  status: string;
  order: number;
  questions: QuizQuestionInput[];
}

// ---- Admin: list / read ----

export async function getAllQuizzesForAdmin() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      _count: { select: { questions: true, attempts: true } },
      attempts: { select: { status: true, percentage: true } },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return quizzes.map((quiz) => {
    const submitted = quiz.attempts.filter((a) => a.status === "Submitted" && a.percentage != null);
    const avgScore =
      submitted.length > 0
        ? Math.round(submitted.reduce((sum, a) => sum + (a.percentage ?? 0), 0) / submitted.length)
        : null;

    return {
      ...quiz,
      questionCount: quiz._count.questions,
      attemptCount: quiz._count.attempts,
      avgScore,
    };
  });
}

export async function getQuizForEdit(id: number) {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { choices: { orderBy: { order: "asc" } } },
      },
    },
  });
}

// ---- Admin: create / update (nested transactional write) ----

export async function createQuiz(input: QuizInput) {
  return prisma.$transaction(async (tx) => {
    const quiz = await tx.quiz.create({
      data: {
        title: input.title,
        description: input.description || null,
        timeLimitMinutes: input.timeLimitMinutes,
        passingScore: input.passingScore,
        showAnswers: input.showAnswers,
        status: input.status,
        order: input.order,
      },
    });

    await insertQuestionsAndChoicesTx(tx, quiz.id, input.questions);

    return quiz;
  });
}

export async function updateQuiz(id: number, input: QuizInput) {
  return prisma.$transaction(async (tx) => {
    const quiz = await tx.quiz.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description || null,
        timeLimitMinutes: input.timeLimitMinutes,
        passingScore: input.passingScore,
        showAnswers: input.showAnswers,
        status: input.status,
        order: input.order,
      },
    });

    await tx.quizQuestion.deleteMany({ where: { quizId: id } });
    await insertQuestionsAndChoicesTx(tx, id, input.questions);

    return quiz;
  });
}

async function insertQuestionsAndChoicesTx(
  tx: Prisma.TransactionClient,
  quizId: number,
  questions: QuizQuestionInput[]
) {
  for (const [qIndex, question] of questions.entries()) {
    const createdQuestion = await tx.quizQuestion.create({
      data: {
        quizId,
        text: question.text,
        order: qIndex,
        points: question.points,
      },
    });

    for (const [cIndex, choice] of question.choices.entries()) {
      await tx.quizChoice.create({
        data: {
          questionId: createdQuestion.id,
          text: choice.text,
          isCorrect: choice.isCorrect,
          order: cIndex,
        },
      });
    }
  }
}

export async function deleteQuiz(id: number) {
  return prisma.quiz.delete({ where: { id } });
}

export async function publishQuiz(id: number) {
  return prisma.quiz.update({ where: { id }, data: { status: "Published" } });
}

export async function unpublishQuiz(id: number) {
  return prisma.quiz.update({ where: { id }, data: { status: "Draft" } });
}

// ---- Public: list / take ----

export async function getPublishedQuizzes() {
  const quizzes = await prisma.quiz.findMany({
    where: { status: "Published" },
    include: { _count: { select: { questions: true } } },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return quizzes.map((quiz) => ({
    ...quiz,
    questionCount: quiz._count.questions,
  }));
}

/** Published quiz for taking — choices never include `isCorrect`, so the answer key never reaches the browser before grading. */
export async function getQuizForTaking(id: number) {
  return prisma.quiz.findFirst({
    where: { id, status: "Published" },
    select: {
      id: true,
      title: true,
      description: true,
      timeLimitMinutes: true,
      passingScore: true,
      questions: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          text: true,
          order: true,
          choices: {
            orderBy: { order: "asc" },
            select: { id: true, text: true, order: true },
          },
        },
      },
    },
  });
}

// ---- Public: resumable attempt lifecycle ----
// A QuizAttempt row is created the moment a trainee clicks Start (status
// "InProgress"), so an abandoned quiz is visible in the DB/admin even if the
// trainee never comes back. Each answer is upserted as it's picked, so a
// refresh can restore exactly where they left off. Only `finalizeQuizAttempt`
// computes and locks in the score, from the DB-stored answers — never from a
// client-submitted payload.

export interface StartQuizAttemptInput {
  quizId: number;
  name: string;
  email: string;
  previousClassFeedback?: string;
}

export async function startQuizAttempt(input: StartQuizAttemptInput) {
  const quiz = await prisma.quiz.findFirst({ where: { id: input.quizId, status: "Published" } });
  if (!quiz) throw new Error("Quiz not found or not published.");

  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: input.quizId,
      name: input.name,
      email: input.email,
      previousClassFeedback: input.previousClassFeedback || null,
      status: "InProgress",
      startedAt: new Date(),
    },
  });

  return { attemptId: attempt.id, startedAt: attempt.startedAt };
}

export interface SaveQuizAnswerInput {
  attemptId: number;
  questionId: number;
  choiceId: number | null;
}

export async function saveQuizAnswer(input: SaveQuizAnswerInput) {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: input.attemptId } });
  if (!attempt || attempt.status !== "InProgress") return; // stale/finalized attempt — ignore

  const question = await prisma.quizQuestion.findUnique({
    where: { id: input.questionId },
    include: { choices: true },
  });
  if (!question) return;

  const correctChoice = question.choices.find((c) => c.isCorrect);
  const isCorrect = input.choiceId != null && input.choiceId === correctChoice?.id;

  await prisma.quizAnswer.upsert({
    where: { attemptId_questionId: { attemptId: input.attemptId, questionId: input.questionId } },
    update: { choiceId: input.choiceId, isCorrect },
    create: {
      attemptId: input.attemptId,
      questionId: input.questionId,
      choiceId: input.choiceId,
      isCorrect,
    },
  });
}

/** Returns the resumable state for an in-progress attempt, or null if it's missing/finalized/belongs to a different quiz. */
export async function getResumableAttempt(input: { attemptId: number; quizId: number }) {
  const attempt = await prisma.quizAttempt.findFirst({
    where: { id: input.attemptId, quizId: input.quizId, status: "InProgress" },
    include: { answers: true },
  });
  if (!attempt) return null;

  return {
    attemptId: attempt.id,
    startedAt: attempt.startedAt,
    answers: attempt.answers.map((a) => ({ questionId: a.questionId, choiceId: a.choiceId })),
  };
}

export async function finalizeQuizAttempt(attemptId: number) {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: { answers: true },
  });
  if (!attempt) throw new Error("Attempt not found.");

  const quiz = await prisma.quiz.findUnique({
    where: { id: attempt.quizId },
    include: {
      questions: { orderBy: { order: "asc" }, include: { choices: { orderBy: { order: "asc" } } } },
    },
  });
  if (!quiz) throw new Error("Quiz not found.");

  const answerByQuestion = new Map(attempt.answers.map((a) => [a.questionId, a]));

  let finalAttempt = attempt;
  if (attempt.status !== "Submitted") {
    let score = 0;
    let totalPoints = 0;
    for (const question of quiz.questions) {
      totalPoints += question.points;
      if (answerByQuestion.get(question.id)?.isCorrect) score += question.points;
    }
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const passed = percentage >= quiz.passingScore;
    const submittedAt = new Date();
    const timeTakenSeconds = Math.max(
      0,
      Math.round((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)
    );

    finalAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: { status: "Submitted", score, totalPoints, percentage, passed, submittedAt, timeTakenSeconds },
      include: { answers: true },
    });
  }

  return {
    attemptId: finalAttempt.id,
    score: finalAttempt.score ?? 0,
    totalPoints: finalAttempt.totalPoints ?? 0,
    percentage: finalAttempt.percentage ?? 0,
    passed: finalAttempt.passed ?? false,
    passingScore: quiz.passingScore,
    showAnswers: quiz.showAnswers,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      choices: q.choices.map((c) => ({ id: c.id, text: c.text, isCorrect: c.isCorrect })),
      submittedChoiceId: answerByQuestion.get(q.id)?.choiceId ?? null,
    })),
  };
}

// ---- Admin: results ----

export async function getAttemptsForQuiz(quizId: number) {
  return prisma.quizAttempt.findMany({
    where: { quizId },
    orderBy: [{ status: "asc" }, { submittedAt: "desc" }, { startedAt: "desc" }],
  });
}

export async function getAllAttempts() {
  return prisma.quizAttempt.findMany({
    include: { quiz: { select: { title: true } } },
    orderBy: { startedAt: "desc" },
  });
}

export async function deleteAttempt(id: number) {
  return prisma.quizAttempt.delete({ where: { id } });
}

// ---- Admin: copyable per-trainee report ----

function buildQuizReportText(params: {
  quizTitle: string;
  name: string;
  email: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  submittedAt: Date | null;
  questions: { text: string; yourAnswer: string; correctAnswer: string; isCorrect: boolean }[];
}) {
  const lines: string[] = [];
  lines.push(`Subject: ${params.quizTitle} — Result for ${params.name}`);
  lines.push("");
  lines.push(`Quiz: ${params.quizTitle}`);
  lines.push(`Name: ${params.name}`);
  lines.push(`Email: ${params.email}`);
  if (params.submittedAt) lines.push(`Submitted: ${params.submittedAt.toLocaleString("en-GB")}`);
  lines.push(
    `Score: ${params.score}/${params.totalPoints} (${Math.round(params.percentage)}%) — ${
      params.passed ? "PASSED" : "FAILED"
    }`
  );
  lines.push("");
  lines.push("Answer Breakdown:");
  lines.push("");
  params.questions.forEach((q, i) => {
    lines.push(`${i + 1}. ${q.text}`);
    lines.push(`   Your answer: ${q.yourAnswer}${q.isCorrect ? "" : " (incorrect)"}`);
    if (!q.isCorrect) lines.push(`   Correct answer: ${q.correctAnswer}`);
    lines.push("");
  });
  return lines.join("\n");
}

/** Plain-text report ready to paste into an email — null for attempts that haven't been submitted yet. */
export async function getAttemptReportText(attemptId: number): Promise<string | null> {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: { answers: true },
  });
  if (!attempt || attempt.status !== "Submitted") return null;

  const quiz = await prisma.quiz.findUnique({
    where: { id: attempt.quizId },
    include: {
      questions: { orderBy: { order: "asc" }, include: { choices: { orderBy: { order: "asc" } } } },
    },
  });
  if (!quiz) return null;

  const answerByQuestion = new Map(attempt.answers.map((a) => [a.questionId, a]));

  const questions = quiz.questions.map((q) => {
    const answer = answerByQuestion.get(q.id);
    const correctChoice = q.choices.find((c) => c.isCorrect);
    const yourChoice = q.choices.find((c) => c.id === answer?.choiceId);
    return {
      text: q.text,
      yourAnswer: yourChoice?.text ?? "(no answer)",
      correctAnswer: correctChoice?.text ?? "",
      isCorrect: answer?.isCorrect ?? false,
    };
  });

  return buildQuizReportText({
    quizTitle: quiz.title,
    name: attempt.name,
    email: attempt.email,
    score: attempt.score ?? 0,
    totalPoints: attempt.totalPoints ?? 0,
    percentage: attempt.percentage ?? 0,
    passed: attempt.passed ?? false,
    submittedAt: attempt.submittedAt,
    questions,
  });
}

// ---- Admin: Excel export ----

export async function exportAttemptsWorkbook(quizId: number): Promise<Buffer> {
  const attempts = await getAttemptsForQuiz(quizId);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Results");

  sheet.columns = [
    { header: "Name", key: "name", width: 24 },
    { header: "Email", key: "email", width: 30 },
    { header: "Status", key: "status", width: 14 },
    { header: "Score", key: "score", width: 10 },
    { header: "Total", key: "total", width: 10 },
    { header: "Percentage", key: "percentage", width: 12 },
    { header: "Result", key: "result", width: 10 },
    { header: "Time Taken (s)", key: "timeTaken", width: 14 },
    { header: "Submitted At", key: "submittedAt", width: 20 },
    { header: "Feedback on Previous Class", key: "feedback", width: 40 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const a of attempts) {
    sheet.addRow({
      name: a.name,
      email: a.email,
      status: a.status === "Submitted" ? "Submitted" : "In Progress",
      score: a.score ?? "",
      total: a.totalPoints ?? "",
      percentage: a.percentage != null ? `${Math.round(a.percentage)}%` : "",
      result: a.status === "Submitted" ? (a.passed ? "Passed" : "Failed") : "",
      timeTaken: a.timeTakenSeconds ?? "",
      submittedAt: a.submittedAt ? a.submittedAt.toLocaleString("en-GB") : "",
      feedback: a.previousClassFeedback ?? "",
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
