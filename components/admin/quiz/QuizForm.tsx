"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { createQuizAction, updateQuizAction } from "@/app/admin/actions/quiz-actions";

interface ChoiceFormState {
  clientKey: number;
  text: string;
  isCorrect: boolean;
}

interface QuestionFormState {
  clientKey: number;
  text: string;
  points: number;
  choices: ChoiceFormState[];
}

interface QuizFormState {
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScore: number;
  showAnswers: boolean;
  status: string;
  order: number;
  questions: QuestionFormState[];
}

interface Props {
  quizId?: number;
  initial?: QuizFormState;
}

let clientKeySeq = 0;
function nextKey() {
  clientKeySeq += 1;
  return Date.now() + clientKeySeq;
}

function emptyChoice(): ChoiceFormState {
  return { clientKey: nextKey(), text: "", isCorrect: false };
}

function emptyQuestion(): QuestionFormState {
  return {
    clientKey: nextKey(),
    text: "",
    points: 1,
    choices: [emptyChoice(), emptyChoice(), emptyChoice(), emptyChoice()],
  };
}

const emptyForm: QuizFormState = {
  title: "",
  description: "",
  timeLimitMinutes: 15,
  passingScore: 70,
  showAnswers: true,
  status: "Draft",
  order: 0,
  questions: [emptyQuestion()],
};

export default function QuizForm({ quizId, initial }: Props) {
  const [form, setForm] = useState<QuizFormState>(initial ?? emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof QuizFormState>(key: K, value: QuizFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateQuestion(clientKey: number, patch: Partial<QuestionFormState>) {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.clientKey === clientKey ? { ...q, ...patch } : q)),
    }));
  }

  function updateChoice(questionKey: number, choiceKey: number, patch: Partial<ChoiceFormState>) {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.clientKey === questionKey
          ? { ...q, choices: q.choices.map((c) => (c.clientKey === choiceKey ? { ...c, ...patch } : c)) }
          : q
      ),
    }));
  }

  function setCorrectChoice(questionKey: number, choiceKey: number) {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.clientKey === questionKey
          ? { ...q, choices: q.choices.map((c) => ({ ...c, isCorrect: c.clientKey === choiceKey })) }
          : q
      ),
    }));
  }

  function addQuestion() {
    setForm((prev) => ({ ...prev, questions: [...prev.questions, emptyQuestion()] }));
  }

  function removeQuestion(clientKey: number) {
    setForm((prev) => ({ ...prev, questions: prev.questions.filter((q) => q.clientKey !== clientKey) }));
  }

  function moveQuestion(clientKey: number, direction: -1 | 1) {
    setForm((prev) => {
      const index = prev.questions.findIndex((q) => q.clientKey === clientKey);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.questions.length) return prev;
      const questions = [...prev.questions];
      [questions[index], questions[target]] = [questions[target], questions[index]];
      return { ...prev, questions };
    });
  }

  function addChoice(questionKey: number) {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.clientKey === questionKey && q.choices.length < 6
          ? { ...q, choices: [...q.choices, emptyChoice()] }
          : q
      ),
    }));
  }

  function removeChoice(questionKey: number, choiceKey: number) {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.clientKey === questionKey && q.choices.length > 2
          ? { ...q, choices: q.choices.filter((c) => c.clientKey !== choiceKey) }
          : q
      ),
    }));
  }

  function validate(): string | null {
    if (!form.title.trim()) return "Title is required.";
    if (form.questions.length === 0) return "Add at least one question.";
    for (const [i, q] of form.questions.entries()) {
      if (!q.text.trim()) return `Question ${i + 1} needs text.`;
      if (q.choices.some((c) => !c.text.trim())) return `Question ${i + 1} has an empty choice.`;
      if (!q.choices.some((c) => c.isCorrect)) return `Question ${i + 1} needs a correct choice marked.`;
    }
    return null;
  }

  async function handleSave() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);

    const input = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      timeLimitMinutes: form.timeLimitMinutes,
      passingScore: form.passingScore,
      showAnswers: form.showAnswers,
      status: form.status,
      order: form.order,
      questions: form.questions.map((q) => ({
        clientKey: q.clientKey,
        text: q.text.trim(),
        points: q.points,
        choices: q.choices.map((c) => ({
          clientKey: c.clientKey,
          text: c.text.trim(),
          isCorrect: c.isCorrect,
        })),
      })),
    };

    try {
      if (quizId) {
        await updateQuizAction(quizId, input);
      } else {
        await createQuizAction(input);
      }
    } catch (err) {
      // redirect() throws internally to trigger navigation on success — that's
      // not a real failure, only surface genuine errors.
      const digest = (err as { digest?: string } | null)?.digest;
      if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to save quiz.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">Quiz Details</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Title</label>
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Quiz 1 — Days 1–2 Recap"
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="One line describing what this quiz covers."
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Time limit (minutes)</label>
            <input
              type="number"
              min={1}
              value={form.timeLimitMinutes}
              onChange={(e) => updateField("timeLimitMinutes", Number(e.target.value))}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Passing score (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.passingScore}
              onChange={(e) => updateField("passingScore", Number(e.target.value))}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full rounded-xl border p-4"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Display order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => updateField("order", Number(e.target.value))}
              className="w-full rounded-xl border p-4"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3 rounded-xl border p-4">
            <input
              type="checkbox"
              id="showAnswers"
              checked={form.showAnswers}
              onChange={(e) => updateField("showAnswers", e.target.checked)}
              className="h-5 w-5 rounded border-gray-300"
            />
            <label htmlFor="showAnswers" className="text-sm font-semibold text-gray-700">
              Show correct answers to the trainee after they submit
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Questions ({form.questions.length})</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
          >
            <Plus size={16} />
            Add question
          </button>
        </div>

        <div className="space-y-6">
          {form.questions.map((q, qi) => (
            <div key={q.clientKey} className="rounded-2xl border p-6">
              <div className="mb-4 flex items-start gap-3">
                <GripVertical size={20} className="mt-3 shrink-0 text-gray-300" />

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                    Question {qi + 1}
                  </div>
                  <textarea
                    rows={2}
                    value={q.text}
                    onChange={(e) => updateQuestion(q.clientKey, { text: e.target.value })}
                    placeholder="A passenger calls saying..."
                    className="w-full rounded-xl border p-3"
                  />
                </div>

                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveQuestion(q.clientKey, -1)}
                    disabled={qi === 0}
                    className="rounded-lg border p-1.5 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveQuestion(q.clientKey, 1)}
                    disabled={qi === form.questions.length - 1}
                    className="rounded-lg border p-1.5 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={q.points}
                    onChange={(e) => updateQuestion(q.clientKey, { points: Number(e.target.value) })}
                    title="Points"
                    className="w-16 rounded-lg border p-2 text-center"
                  />
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.clientKey)}
                    disabled={form.questions.length <= 1}
                    className="rounded-lg border p-2 text-red-600 hover:bg-red-50 disabled:opacity-30"
                    title="Remove question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="ml-8 space-y-2">
                {q.choices.map((c) => (
                  <div key={c.clientKey} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct-${q.clientKey}`}
                      checked={c.isCorrect}
                      onChange={() => setCorrectChoice(q.clientKey, c.clientKey)}
                      className="h-4 w-4 shrink-0"
                      title="Mark as correct"
                    />
                    <input
                      value={c.text}
                      onChange={(e) => updateChoice(q.clientKey, c.clientKey, { text: e.target.value })}
                      placeholder="Choice text"
                      className={`flex-1 rounded-lg border p-2.5 ${c.isCorrect ? "border-emerald-400 bg-emerald-50" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeChoice(q.clientKey, c.clientKey)}
                      disabled={q.choices.length <= 2}
                      className="shrink-0 rounded-lg border p-2 text-red-600 hover:bg-red-50 disabled:opacity-30"
                      title="Remove choice"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addChoice(q.clientKey)}
                  disabled={q.choices.length >= 6}
                  className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={14} />
                  Add choice
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
          {error}
        </p>
      )}

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-red-700 px-8 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </section>
    </div>
  );
}
