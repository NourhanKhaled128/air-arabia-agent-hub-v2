"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ArrowRight, RotateCcw } from "lucide-react";
import { getCategoryBadgeClasses } from "@/lib/helpers";

export interface PracticeScenario {
  situation: string;
  response: string;
  articleTitle: string;
  articleSlug: string;
  category: string;
}

interface Props {
  scenarios: PracticeScenario[];
}

const BATCH_SIZE = 10;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PracticeDeck({ scenarios }: Props) {
  const [pool, setPool] = useState(scenarios);
  const [batchStart, setBatchStart] = useState(0);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [batchDone, setBatchDone] = useState(false);

  if (pool.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
        <p className="text-gray-500 dark:text-slate-400">No scenarios available to practice with yet.</p>
      </div>
    );
  }

  const batch = pool.slice(batchStart, batchStart + BATCH_SIZE);

  function nextBatch() {
    // Once we've worked through the whole site-wide pool, reshuffle and loop back —
    // otherwise just slide the window to the next distinct, not-yet-seen 10.
    if (batchStart + BATCH_SIZE >= pool.length) {
      setPool(shuffle(scenarios));
      setBatchStart(0);
    } else {
      setBatchStart((s) => s + BATCH_SIZE);
    }
    setIndex(0);
    setRevealed(false);
    setBatchDone(false);
  }

  if (batchDone) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
        <p className="text-xl font-bold text-gray-900 dark:text-slate-100">
          Nice work — {batch.length} scenarios done.
        </p>
        <button
          onClick={nextBatch}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          <RotateCcw size={18} />
          Next {BATCH_SIZE} questions
        </button>
      </div>
    );
  }

  const scenario = batch[index];

  function next() {
    if (index + 1 >= batch.length) {
      setBatchDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
        <span>Question {index + 1} of {batch.length}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryBadgeClasses(scenario.category)}`}>
          {scenario.category}
        </span>
      </div>

      <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">If:</p>
        <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-slate-100">{scenario.situation}</p>

        {revealed ? (
          <>
            <hr className="my-6 border-gray-200 dark:border-border-subtle" />
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Response:</p>
            <p className="mt-2 text-gray-700 dark:text-slate-300">{scenario.response}</p>
            <Link
              href={`/Knowledge/${scenario.articleSlug}`}
              className="mt-4 inline-block text-sm font-semibold text-red-700 dark:text-brand hover:underline"
            >
              From: {scenario.articleTitle} →
            </Link>
          </>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="mt-6 flex items-center gap-2 rounded-xl border border-gray-300 dark:border-border-subtle px-6 py-3 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
          >
            <Eye size={18} />
            Reveal the correct response
          </button>
        )}
      </div>

      <button
        onClick={next}
        disabled={!revealed}
        className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next scenario
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
