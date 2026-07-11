"use client";

import { useState, useTransition } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { submitFeedbackAction } from "@/app/actions/feedback";

interface Props {
  articleId: number;
  slug: string;
}

export default function ArticleFeedback({ articleId, slug }: Props) {
  const [choice, setChoice] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function pick(helpful: boolean) {
    setChoice(helpful);
  }

  function submit() {
    if (choice === null) return;

    startTransition(async () => {
      try {
        await submitFeedbackAction({
          articleId,
          slug,
          helpful: choice,
          message,
          authorName,
        });
        setSubmitted(true);
      } catch (error) {
        console.error(error);
        alert("Could not submit feedback.");
      }
    });
  }

  if (submitted) {
    return (
      <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 text-center shadow-sm">
        <p className="font-semibold text-gray-900 dark:text-slate-100">
          Thanks for your feedback!
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-slate-100">
        Was this article helpful?
      </h2>

      <div className="flex items-center gap-3">
        <button
          onClick={() => pick(true)}
          className={`flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${
            choice === true
              ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40"
              : "border-gray-300 dark:border-border-subtle text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
          }`}
        >
          <ThumbsUp size={18} /> Yes
        </button>

        <button
          onClick={() => pick(false)}
          className={`flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${
            choice === false
              ? "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40"
              : "border-gray-300 dark:border-border-subtle text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
          }`}
        >
          <ThumbsDown size={18} /> No
        </button>
      </div>

      {choice !== null && (
        <div className="mt-5 space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything we should improve? (optional)"
            rows={3}
            className="w-full rounded-xl border border-gray-300 dark:border-border-subtle bg-transparent p-4 outline-none focus:border-brand"
          />

          <div className="flex flex-wrap items-center gap-3">
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name (optional)"
              className="flex-1 min-w-[180px] rounded-xl border border-gray-300 dark:border-border-subtle bg-transparent px-4 py-2 outline-none focus:border-brand"
            />

            <button
              disabled={isPending}
              onClick={submit}
              className="rounded-xl bg-red-700 px-6 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
