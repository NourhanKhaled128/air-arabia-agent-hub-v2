"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Loader2,
  History,
} from "lucide-react";
import {
  startQuizAttemptAction,
  saveQuizAnswerAction,
  getResumableAttemptAction,
  finalizeQuizAttemptAction,
  getMyQuizHistoryAction,
} from "@/app/actions/quiz";

interface Choice {
  id: number;
  text: string;
  order: number;
}

interface Question {
  id: number;
  text: string;
  order: number;
  choices: Choice[];
}

interface QuizData {
  id: number;
  title: string;
  description: string | null;
  timeLimitMinutes: number;
  passingScore: number;
  questions: Question[];
}

interface GradedQuestion {
  id: number;
  text: string;
  choices: { id: number; text: string; isCorrect: boolean }[];
  submittedChoiceId: number | null;
}

interface GradeResult {
  attemptId: number;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  showAnswers: boolean;
  questions: GradedQuestion[];
}

interface PreviousAttempt {
  quizId: number;
  quizTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  submittedAt: string | null;
}

const STORAGE_KEY = "airarabia_quiz_attempt";

interface StoredAttempt {
  quizId: number;
  attemptId: number;
}

function readStoredAttempt(): StoredAttempt | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.quizId === "number" && typeof parsed?.attemptId === "number") return parsed;
    return null;
  } catch {
    return null;
  }
}

function writeStoredAttempt(value: StoredAttempt) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function clearStoredAttempt() {
  localStorage.removeItem(STORAGE_KEY);
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Props {
  quiz: QuizData;
  agentName: string;
}

export default function QuizRunner({ quiz, agentName }: Props) {
  const [step, setStep] = useState<"loading" | "intro" | "taking" | "result">("loading");

  // Intro fields
  const [feedback, setFeedback] = useState("");
  const [starting, setStarting] = useState(false);
  const [history, setHistory] = useState<PreviousAttempt[] | null>(null);

  // Taking state
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(quiz.timeLimitMinutes * 60);
  const [submitting, setSubmitting] = useState(false);
  const [resumed, setResumed] = useState(false);

  // Result state
  const [result, setResult] = useState<GradeResult | null>(null);

  const attemptIdRef = useRef<number | null>(null);
  const startedAtRef = useRef<Date | null>(null);
  const pendingSaveRef = useRef<Promise<unknown> | null>(null);
  const submittingRef = useRef(false);
  const advancingRef = useRef(false);

  async function doSubmit() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);

    if (pendingSaveRef.current) await pendingSaveRef.current.catch(() => {});

    const attemptId = attemptIdRef.current;
    if (attemptId == null) {
      submittingRef.current = false;
      setSubmitting(false);
      return;
    }

    const graded = await finalizeQuizAttemptAction(attemptId);
    clearStoredAttempt();
    setResult(graded as GradeResult);
    setStep("result");
    setSubmitting(false);
  }

  // On mount: resume this quiz's in-progress attempt if one exists on this
  // browser, or — if the lingering attempt belongs to a *different* quiz —
  // auto-finalize it first, then show a normal intro form for this one.
  useEffect(() => {
    let cancelled = false;

    getMyQuizHistoryAction().then((result) => {
      if (!cancelled) setHistory(result as PreviousAttempt[]);
    });

    (async () => {
      const stored = readStoredAttempt();
      if (!stored) {
        if (!cancelled) setStep("intro");
        return;
      }

      if (stored.quizId !== quiz.id) {
        await finalizeQuizAttemptAction(stored.attemptId).catch(() => {});
        clearStoredAttempt();
        if (!cancelled) setStep("intro");
        return;
      }

      const resumable = await getResumableAttemptAction({ attemptId: stored.attemptId, quizId: quiz.id });
      if (!resumable) {
        clearStoredAttempt();
        if (!cancelled) setStep("intro");
        return;
      }

      if (cancelled) return;

      attemptIdRef.current = resumable.attemptId;
      startedAtRef.current = new Date(resumable.startedAt);

      const restoredAnswers: Record<number, number> = {};
      for (const a of resumable.answers) {
        if (a.choiceId != null) restoredAnswers[a.questionId] = a.choiceId;
      }
      setAnswers(restoredAnswers);

      const elapsed = (Date.now() - startedAtRef.current.getTime()) / 1000;
      const remaining = Math.floor(quiz.timeLimitMinutes * 60 - elapsed);

      if (remaining <= 0) {
        setStep("taking"); // doSubmit below will flip to "result" once graded
        await doSubmit();
        return;
      }

      const firstUnanswered = quiz.questions.findIndex((q) => !(q.id in restoredAnswers));
      setIndex(firstUnanswered === -1 ? quiz.questions.length - 1 : firstUnanswered);
      setSecondsLeft(remaining);
      setResumed(true);
      setStep("taking");
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.id]);

  // Countdown timer — only runs while actively taking the quiz.
  useEffect(() => {
    if (step !== "taking") return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          doSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  async function handleStart() {
    setStarting(true);

    const { attemptId, startedAt } = await startQuizAttemptAction({
      quizId: quiz.id,
      previousClassFeedback: feedback.trim() || undefined,
    });

    attemptIdRef.current = attemptId;
    startedAtRef.current = new Date(startedAt);
    writeStoredAttempt({ quizId: quiz.id, attemptId });

    setSecondsLeft(quiz.timeLimitMinutes * 60);
    setStarting(false);
    setStep("taking");
  }

  async function startOver() {
    const attemptId = attemptIdRef.current;
    if (attemptId != null) {
      await finalizeQuizAttemptAction(attemptId).catch(() => {});
    }
    clearStoredAttempt();
    attemptIdRef.current = null;
    startedAtRef.current = null;
    setAnswers({});
    setIndex(0);
    setResumed(false);
    setFeedback("");
    setStep("intro");
  }

  function selectChoice(questionId: number, choiceId: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));

    const attemptId = attemptIdRef.current;
    if (attemptId == null) return;
    pendingSaveRef.current = saveQuizAnswerAction({ attemptId, questionId, choiceId }).catch((e) => {
      console.error("Failed to save answer", e);
    });
  }

  async function goNext() {
    // Guards against a double-click (or an impatient repeat-tap while the
    // pending answer save is still in flight) firing two overlapping calls —
    // both would otherwise read the same stale `index` and each advance it,
    // skipping a question or pushing `index` past the last one.
    if (advancingRef.current) return;
    advancingRef.current = true;
    try {
      if (pendingSaveRef.current) await pendingSaveRef.current.catch(() => {});

      if (index + 1 >= quiz.questions.length) {
        await doSubmit();
        return;
      }
      setIndex((i) => i + 1);
    } finally {
      advancingRef.current = false;
    }
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  // ---- Step: loading (resume check) ----
  if (step === "loading") {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 dark:text-slate-500">
        <Loader2 size={28} className="animate-spin" />
      </div>
    );
  }

  // ---- Step: intro ----
  if (step === "intro") {
    return (
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-brand">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{quiz.title}</h1>
            {quiz.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">{quiz.description}</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-6 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-gray-500 dark:text-slate-400">Hi {agentName} 👋</p>
          <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
            <Clock size={16} />
            {quiz.timeLimitMinutes} minutes · {quiz.questions.length} questions · starts as soon as you click Start Quiz
          </p>

          <div className="rounded-xl border border-gray-200 dark:border-border-subtle bg-gray-50 dark:bg-surface-muted p-4">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-slate-300">
              <History size={14} />
              Your quiz history
            </p>
            {history === null ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">Loading...</p>
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                No previous quiz attempts yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((h, i) => (
                  <li
                    key={`${h.quizId}-${i}`}
                    className="flex flex-col gap-0.5 rounded-lg border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-800 dark:text-slate-200">{h.quizTitle}</p>
                      {h.submittedAt && (
                        <p className="text-xs text-gray-500 dark:text-slate-500">
                          {new Date(h.submittedAt).toLocaleDateString("en-GB")}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        h.passed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {Math.round(h.percentage)}% · {h.passed ? "Passed" : "Failed"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className="mt-4 block text-sm font-semibold text-gray-700 dark:text-slate-300">
            Feedback on the previous class
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Optional — anything that would make the last session better"
              rows={3}
              className="mt-1.5 w-full resize-none rounded-xl border border-gray-300 dark:border-border-subtle bg-white dark:bg-surface-muted px-4 py-2.5 text-gray-900 dark:text-slate-100 outline-none focus:border-red-500"
            />
          </label>

          <button
            onClick={handleStart}
            disabled={starting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {starting ? "Starting..." : "Start Quiz"}
            {!starting && <ArrowRight size={18} />}
          </button>
        </div>
      </div>
    );
  }

  // ---- Step: taking ----
  if (step === "taking") {
    // Defensive fallback: `index` should never leave [0, length), but if a
    // stray render slips through before doSubmit() finishes, show the
    // spinner instead of crashing on an undefined question.
    const question = quiz.questions[index];
    if (!question) {
      return (
        <div className="flex items-center justify-center py-24 text-gray-400 dark:text-slate-500">
          <Loader2 size={28} className="animate-spin" />
        </div>
      );
    }
    const selectedChoiceId = answers[question.id];
    const lowTime = secondsLeft <= 60;

    return (
      <div className="mx-auto max-w-2xl">
        {resumed && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300">
            <span>Resumed where you left off — the timer kept running.</span>
            <button onClick={startOver} className="font-semibold underline shrink-0 ml-3">
              Not you? Start a new attempt
            </button>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-500 dark:text-slate-400">
            Question {index + 1} of {quiz.questions.length}
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-bold ${
              lowTime
                ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                : "bg-gray-100 text-gray-700 dark:bg-surface-muted dark:text-slate-300"
            }`}
          >
            <Clock size={14} />
            {formatTime(secondsLeft)}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-surface-muted">
          <div
            className="h-full rounded-full bg-red-700 transition-all"
            style={{ width: `${((index + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        <div className="mt-6 rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
          <p className="text-xl font-semibold text-gray-900 dark:text-slate-100">{question.text}</p>

          <div className="mt-6 space-y-3">
            {question.choices.map((choice) => {
              const active = selectedChoiceId === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => selectChoice(question.id, choice.id)}
                  className={`block w-full rounded-xl border px-5 py-3 text-left font-medium transition ${
                    active
                      ? "border-red-600 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                      : "border-gray-300 dark:border-border-subtle text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
                  }`}
                >
                  {choice.text}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-border-subtle px-5 py-3 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={goNext}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {index + 1 >= quiz.questions.length ? "Submit Quiz" : "Next"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ---- Step: result ----
  if (!result) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 text-center shadow-sm">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
            result.passed
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
          }`}
        >
          <Trophy size={30} />
        </div>

        <p className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-slate-100">
          {Math.round(result.percentage)}%
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          {result.score} / {result.totalPoints} points · passing score {result.passingScore}%
        </p>
        <p
          className={`mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-bold ${
            result.passed
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
              : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
          }`}
        >
          {result.passed ? "Passed" : "Not passed — review below and try again"}
        </p>
      </div>

      {result.showAnswers && (
        <div className="mt-6 space-y-4">
          {result.questions.map((q, i) => (
            <div
              key={q.id}
              className="rounded-2xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-500 dark:text-slate-400">Question {i + 1}</p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-slate-100">{q.text}</p>

              <div className="mt-3 space-y-2">
                {q.choices.map((c) => {
                  const isSubmitted = q.submittedChoiceId === c.id;
                  let classes =
                    "border-gray-200 dark:border-border-subtle text-gray-500 dark:text-slate-400";
                  if (c.isCorrect) {
                    classes =
                      "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
                  } else if (isSubmitted) {
                    classes = "border-red-500 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300";
                  }

                  return (
                    <div
                      key={c.id}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${classes}`}
                    >
                      {c.isCorrect ? (
                        <CheckCircle2 size={16} className="shrink-0" />
                      ) : isSubmitted ? (
                        <XCircle size={16} className="shrink-0" />
                      ) : (
                        <span className="w-4 shrink-0" />
                      )}
                      {c.text}
                      {isSubmitted && !c.isCorrect && (
                        <span className="ml-auto text-xs font-bold uppercase">Your answer</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/Quizzes"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-border-subtle px-6 py-3 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
      >
        Back to Quizzes
      </Link>
    </div>
  );
}
