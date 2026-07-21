import { prisma } from "@/lib/prisma";
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
      attempts: { select: { percentage: true } },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return quizzes.map((quiz) => {
    const attemptCount = quiz.attempts.length;
    const avgScore =
      attemptCount > 0
        ? Math.round(
            quiz.attempts.reduce((sum, a) => sum + a.percentage, 0) / attemptCount
          )
        : null;

    return {
      ...quiz,
      questionCount: quiz._count.questions,
      attemptCount,
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

// ---- Public: submit + server-side grading ----

export interface SubmitQuizAttemptInput {
  quizId: number;
  name: string;
  email: string;
  previousClassFeedback?: string;
  startedAt: Date;
  answers: { questionId: number; choiceId: number | null }[];
}

export async function submitQuizAttempt(input: SubmitQuizAttemptInput) {
  const quiz = await prisma.quiz.findFirst({
    where: { id: input.quizId, status: "Published" },
    include: {
      questions: {
        include: { choices: true },
      },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found or not published.");
  }

  const submittedByQuestion = new Map(
    input.answers.map((a) => [a.questionId, a.choiceId])
  );

  let score = 0;
  let totalPoints = 0;
  const gradedAnswers: {
    questionId: number;
    choiceId: number | null;
    isCorrect: boolean;
  }[] = [];

  for (const question of quiz.questions) {
    totalPoints += question.points;
    const submittedChoiceId = submittedByQuestion.get(question.id) ?? null;
    const correctChoice = question.choices.find((c) => c.isCorrect);
    const isCorrect =
      submittedChoiceId != null && submittedChoiceId === correctChoice?.id;

    if (isCorrect) score += question.points;

    gradedAnswers.push({
      questionId: question.id,
      choiceId: submittedChoiceId,
      isCorrect,
    });
  }

  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
  const passed = percentage >= quiz.passingScore;
  const timeTakenSeconds = Math.max(
    0,
    Math.round((Date.now() - input.startedAt.getTime()) / 1000)
  );

  const attempt = await prisma.$transaction(async (tx) => {
    const created = await tx.quizAttempt.create({
      data: {
        quizId: quiz.id,
        name: input.name,
        email: input.email,
        previousClassFeedback: input.previousClassFeedback || null,
        score,
        totalPoints,
        percentage,
        passed,
        startedAt: input.startedAt,
        timeTakenSeconds,
      },
    });

    await tx.quizAnswer.createMany({
      data: gradedAnswers.map((a) => ({
        attemptId: created.id,
        questionId: a.questionId,
        choiceId: a.choiceId,
        isCorrect: a.isCorrect,
      })),
    });

    return created;
  });

  return {
    attemptId: attempt.id,
    score,
    totalPoints,
    percentage,
    passed,
    passingScore: quiz.passingScore,
    showAnswers: quiz.showAnswers,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      choices: q.choices.map((c) => ({ id: c.id, text: c.text, isCorrect: c.isCorrect })),
      submittedChoiceId: submittedByQuestion.get(q.id) ?? null,
    })),
  };
}

// ---- Admin: results ----

export async function getAttemptsForQuiz(quizId: number) {
  return prisma.quizAttempt.findMany({
    where: { quizId },
    orderBy: { submittedAt: "desc" },
  });
}

export async function getAllAttempts() {
  return prisma.quizAttempt.findMany({
    include: { quiz: { select: { title: true } } },
    orderBy: { submittedAt: "desc" },
  });
}

export async function deleteAttempt(id: number) {
  return prisma.quizAttempt.delete({ where: { id } });
}
