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

    await reconcileQuestionsTx(tx, id, input.questions);

    return quiz;
  });
}

/**
 * Updates existing questions/choices in place (matched by clientKey === DB id,
 * as set by the edit form) instead of deleting and recreating everything.
 * Deleting and recreating would cascade-delete every QuizAnswer tied to the
 * old rows, silently wiping already-submitted trainees' per-question results
 * on every edit. Only questions/choices the admin actually removed are deleted.
 */
async function reconcileQuestionsTx(
  tx: Prisma.TransactionClient,
  quizId: number,
  questions: QuizQuestionInput[]
) {
  const existingQuestions = await tx.quizQuestion.findMany({
    where: { quizId },
    select: { id: true, choices: { select: { id: true } } },
  });
  const existingQuestionIds = new Set(existingQuestions.map((q) => q.id));
  const existingChoiceIdsByQuestion = new Map(
    existingQuestions.map((q) => [q.id, new Set(q.choices.map((c) => c.id))])
  );

  const keptQuestionIds = new Set(
    questions.filter((q) => existingQuestionIds.has(q.clientKey)).map((q) => q.clientKey)
  );

  const removedQuestionIds = [...existingQuestionIds].filter((qid) => !keptQuestionIds.has(qid));
  if (removedQuestionIds.length > 0) {
    await tx.quizQuestion.deleteMany({ where: { id: { in: removedQuestionIds } } });
  }

  const questionUpdates = questions
    .map((q, qIndex) => ({ q, qIndex }))
    .filter(({ q }) => keptQuestionIds.has(q.clientKey));

  if (questionUpdates.length > 0) {
    await tx.$executeRaw`
      UPDATE "QuizQuestion" AS t
      SET text = v.text, "order" = v."order", points = v.points
      FROM UNNEST(
        ${questionUpdates.map(({ q }) => q.clientKey)}::int[],
        ${questionUpdates.map(({ q }) => q.text)}::text[],
        ${questionUpdates.map(({ qIndex }) => qIndex)}::int[],
        ${questionUpdates.map(({ q }) => q.points)}::int[]
      ) AS v(id, text, "order", points)
      WHERE t.id = v.id
    `;
  }

  const newQuestionEntries = questions
    .map((q, qIndex) => ({ q, qIndex }))
    .filter(({ q }) => !keptQuestionIds.has(q.clientKey));

  const createdQuestions =
    newQuestionEntries.length > 0
      ? await tx.quizQuestion.createManyAndReturn({
          data: newQuestionEntries.map(({ q, qIndex }) => ({
            quizId,
            text: q.text,
            order: qIndex,
            points: q.points,
          })),
        })
      : [];
  const newQuestionIdByOrder = new Map(createdQuestions.map((cq) => [cq.order, cq.id]));

  // clientKey -> the DB id it now maps to (unchanged for kept questions, freshly assigned for new ones)
  const questionDbId = new Map<number, number>();
  for (const { q } of questionUpdates) questionDbId.set(q.clientKey, q.clientKey);
  for (const { q, qIndex } of newQuestionEntries) {
    questionDbId.set(q.clientKey, newQuestionIdByOrder.get(qIndex)!);
  }

  const choiceUpdates: { id: number; text: string; isCorrect: boolean; order: number }[] = [];
  const choiceCreates: { questionId: number; text: string; isCorrect: boolean; order: number }[] = [];
  const keptChoiceIdsByQuestion = new Map<number, Set<number>>();

  for (const question of questions) {
    const dbQuestionId = questionDbId.get(question.clientKey)!;
    const existingChoiceIds = existingChoiceIdsByQuestion.get(question.clientKey);
    const kept = new Set<number>();

    question.choices.forEach((choice, cIndex) => {
      if (existingChoiceIds?.has(choice.clientKey)) {
        kept.add(choice.clientKey);
        choiceUpdates.push({ id: choice.clientKey, text: choice.text, isCorrect: choice.isCorrect, order: cIndex });
      } else {
        choiceCreates.push({ questionId: dbQuestionId, text: choice.text, isCorrect: choice.isCorrect, order: cIndex });
      }
    });

    if (existingChoiceIds) keptChoiceIdsByQuestion.set(question.clientKey, kept);
  }

  const removedChoiceIds = [...existingChoiceIdsByQuestion.entries()].flatMap(([qId, ids]) => {
    const kept = keptChoiceIdsByQuestion.get(qId) ?? new Set<number>();
    return [...ids].filter((cid) => !kept.has(cid));
  });
  if (removedChoiceIds.length > 0) {
    await tx.quizChoice.deleteMany({ where: { id: { in: removedChoiceIds } } });
  }

  if (choiceUpdates.length > 0) {
    await tx.$executeRaw`
      UPDATE "QuizChoice" AS t
      SET text = v.text, "isCorrect" = v."isCorrect", "order" = v."order"
      FROM UNNEST(
        ${choiceUpdates.map((c) => c.id)}::int[],
        ${choiceUpdates.map((c) => c.text)}::text[],
        ${choiceUpdates.map((c) => c.isCorrect)}::boolean[],
        ${choiceUpdates.map((c) => c.order)}::int[]
      ) AS v(id, text, "isCorrect", "order")
      WHERE t.id = v.id
    `;
  }

  if (choiceCreates.length > 0) {
    await tx.quizChoice.createMany({ data: choiceCreates });
  }
}

async function insertQuestionsAndChoicesTx(
  tx: Prisma.TransactionClient,
  quizId: number,
  questions: QuizQuestionInput[]
) {
  // Batched instead of one create() per row: a large quiz (30+ questions) looped
  // sequentially can rack up hundreds of round-trips and blow past Prisma's
  // default 5s interactive-transaction timeout, which surfaces to the client
  // as a generic sanitized "Server Components render" error.
  const createdQuestions = await tx.quizQuestion.createManyAndReturn({
    data: questions.map((question, qIndex) => ({
      quizId,
      text: question.text,
      order: qIndex,
      points: question.points,
    })),
  });

  const questionIdByOrder = new Map(createdQuestions.map((q) => [q.order, q.id]));

  const choicesData = questions.flatMap((question, qIndex) => {
    const questionId = questionIdByOrder.get(qIndex)!;
    return question.choices.map((choice, cIndex) => ({
      questionId,
      text: choice.text,
      isCorrect: choice.isCorrect,
      order: cIndex,
    }));
  });

  if (choicesData.length > 0) {
    await tx.quizChoice.createMany({ data: choicesData });
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
  email: string;
}

/** Every mutation here is scoped to the calling agent's own attempt — attemptId is a
 * small sequential int, so without this check one agent could tamper with another's
 * in-progress answers just by guessing/incrementing the id. */
function isOwnAttempt(attempt: { email: string }, email: string) {
  return attempt.email.toLowerCase() === email.trim().toLowerCase();
}

export async function saveQuizAnswer(input: SaveQuizAnswerInput) {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: input.attemptId } });
  if (!attempt || attempt.status !== "InProgress") return; // stale/finalized attempt — ignore
  if (!isOwnAttempt(attempt, input.email)) return; // not this agent's attempt — ignore

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

/** Submitted attempt history for an email, newest first, across all quizzes — matched case-insensitively since trainees self-report it with no account to normalize casing. */
export async function getAttemptsByEmail(email: string) {
  const attempts = await prisma.quizAttempt.findMany({
    where: { email: { equals: email.trim(), mode: "insensitive" }, status: "Submitted" },
    include: { quiz: { select: { id: true, title: true } } },
    orderBy: { submittedAt: "desc" },
  });

  return attempts.map((a) => ({
    quizId: a.quiz.id,
    quizTitle: a.quiz.title,
    score: a.score ?? 0,
    totalPoints: a.totalPoints ?? 0,
    percentage: a.percentage ?? 0,
    passed: a.passed ?? false,
    submittedAt: a.submittedAt,
  }));
}

/** Aggregate quiz stats for one agent's email, for the personalized home page summary. */
export async function getAgentQuizStats(email: string) {
  const attempts = await prisma.quizAttempt.findMany({
    where: { email: { equals: email.trim(), mode: "insensitive" }, status: "Submitted" },
    select: { percentage: true, passed: true },
  });

  const completed = attempts.length;
  const passed = attempts.filter((a) => a.passed).length;
  const avgPercentage =
    completed > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage ?? 0), 0) / completed)
      : null;

  return { completed, passed, avgPercentage };
}

/** Returns the resumable state for an in-progress attempt, or null if it's missing/finalized/belongs to a different quiz or agent. */
export async function getResumableAttempt(input: { attemptId: number; quizId: number; email: string }) {
  const attempt = await prisma.quizAttempt.findFirst({
    where: { id: input.attemptId, quizId: input.quizId, status: "InProgress" },
    include: { answers: true },
  });
  if (!attempt || !isOwnAttempt(attempt, input.email)) return null;

  return {
    attemptId: attempt.id,
    startedAt: attempt.startedAt,
    answers: attempt.answers.map((a) => ({ questionId: a.questionId, choiceId: a.choiceId })),
  };
}

export async function finalizeQuizAttempt(attemptId: number, email: string) {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: { answers: true },
  });
  // Same "not found" message either way — an ownership mismatch shouldn't reveal
  // that the attemptId belongs to someone else.
  if (!attempt || !isOwnAttempt(attempt, email)) throw new Error("Attempt not found.");

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

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { choices: { orderBy: { order: "asc" } } },
      },
    },
  });

  const submittedAttemptIds = attempts.filter((a) => a.status === "Submitted").map((a) => a.id);
  const answers =
    submittedAttemptIds.length > 0
      ? await prisma.quizAnswer.findMany({ where: { attemptId: { in: submittedAttemptIds } } })
      : [];

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

  if (quiz) {
    const statsByQuestion = new Map<number, { correct: number; incorrect: number }>();
    for (const a of answers) {
      const s = statsByQuestion.get(a.questionId) ?? { correct: 0, incorrect: 0 };
      if (a.isCorrect) s.correct += 1;
      else s.incorrect += 1;
      statsByQuestion.set(a.questionId, s);
    }

    // Worst-first: the questions trainees miss most are what need coaching, so surface them at the top.
    const questionStats = quiz.questions
      .map((q, i) => {
        const s = statsByQuestion.get(q.id) ?? { correct: 0, incorrect: 0 };
        const answered = s.correct + s.incorrect;
        return {
          originalNumber: i + 1,
          question: q,
          answered,
          correct: s.correct,
          incorrect: s.incorrect,
          pctCorrect: answered > 0 ? s.correct / answered : null,
        };
      })
      .sort((a, b) => (a.pctCorrect ?? 1) - (b.pctCorrect ?? 1));

    const questionSheet = workbook.addWorksheet("Question Analysis");
    questionSheet.columns = [
      { header: "Q#", key: "num", width: 6 },
      { header: "Question", key: "text", width: 70 },
      { header: "Points", key: "points", width: 8 },
      { header: "Times Answered", key: "answered", width: 16 },
      { header: "Correct", key: "correct", width: 10 },
      { header: "Incorrect", key: "incorrect", width: 10 },
      { header: "% Correct", key: "pctCorrect", width: 12 },
    ];
    questionSheet.getRow(1).font = { bold: true };

    for (const qs of questionStats) {
      questionSheet.addRow({
        num: qs.originalNumber,
        text: qs.question.text,
        points: qs.question.points,
        answered: qs.answered,
        correct: qs.correct,
        incorrect: qs.incorrect,
        pctCorrect: qs.pctCorrect != null ? `${Math.round(qs.pctCorrect * 100)}%` : "",
      });
    }

    // Matrix view: one row per agent, one column per question — scanning down a
    // question's column shows at a glance which one everyone's missing.
    const breakdownSheet = workbook.addWorksheet("Agent Breakdown");

    const questionColumns = quiz.questions.map((q, i) => ({
      header: `Q${i + 1}`,
      key: `q${q.id}`,
      width: 6,
    }));
    breakdownSheet.columns = [
      { header: "Name", key: "name", width: 24 },
      { header: "Email", key: "email", width: 30 },
      ...questionColumns,
      { header: "Score", key: "percentage", width: 10 },
      { header: "Result", key: "result", width: 10 },
    ];
    breakdownSheet.getRow(1).font = { bold: true };
    breakdownSheet.getRow(1).alignment = { horizontal: "center" };

    quiz.questions.forEach((q, i) => {
      breakdownSheet.getCell(1, 3 + i).note = q.text;
    });

    const answersByAttempt = new Map<number, Map<number, (typeof answers)[number]>>();
    for (const a of answers) {
      const byQuestion = answersByAttempt.get(a.attemptId) ?? new Map();
      byQuestion.set(a.questionId, a);
      answersByAttempt.set(a.attemptId, byQuestion);
    }

    const CORRECT_FILL = "FFC6EFCE";
    const CORRECT_FONT = "FF006100";
    const INCORRECT_FILL = "FFFFC7CE";
    const INCORRECT_FONT = "FF9C0006";

    for (const attempt of attempts.filter((a) => a.status === "Submitted")) {
      const byQuestion = answersByAttempt.get(attempt.id) ?? new Map();

      const rowData: Record<string, string | number> = {
        name: attempt.name,
        email: attempt.email,
        percentage: attempt.percentage != null ? `${Math.round(attempt.percentage)}%` : "",
        result: attempt.passed ? "Passed" : "Failed",
      };
      for (const q of quiz.questions) {
        const answer = byQuestion.get(q.id);
        rowData[`q${q.id}`] = answer ? (answer.isCorrect ? "Correct" : "Incorrect") : "-";
      }

      const row = breakdownSheet.addRow(rowData);
      quiz.questions.forEach((q, i) => {
        const answer = byQuestion.get(q.id);
        if (!answer) return;
        const cell = row.getCell(3 + i);
        cell.alignment = { horizontal: "center" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: answer.isCorrect ? CORRECT_FILL : INCORRECT_FILL },
        };
        cell.font = { color: { argb: answer.isCorrect ? CORRECT_FONT : INCORRECT_FONT } };
      });
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
