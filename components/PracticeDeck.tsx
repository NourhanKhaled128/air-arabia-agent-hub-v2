"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ArrowRight, RotateCcw } from "lucide-react";
import { getCategoryBadgeClasses } from "@/lib/helpers";
import PracticeSetup from "@/components/PracticeSetup";

export interface PracticeScenario {
  id: number;
  situation: string;
  response: string;
  articleTitle: string;
  articleSlug: string;
  category: string;
}

interface BatchCard {
  scenario: PracticeScenario;
  /** 4 shuffled options (1 correct + 3 real responses from other scenarios as distractors), or null if too few distinct responses exist to build one. */
  options: string[] | null;
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

/**
 * Wrong options are real responses to other scenarios, preferring the closest topic match first
 * (same article, then same category, then site-wide) so they read as plausible SOP text for the
 * situation at hand rather than an obviously-unrelated decoy.
 */
function buildOptions(scenario: PracticeScenario, allScenarios: PracticeScenario[]): string[] | null {
  const seen = new Set([scenario.response]);
  const sameArticle = shuffle(
    allScenarios.filter((s) => s.articleSlug === scenario.articleSlug && s.id !== scenario.id)
  );
  const sameCategory = shuffle(
    allScenarios.filter((s) => s.articleSlug !== scenario.articleSlug && s.category === scenario.category && s.id !== scenario.id)
  );
  const others = shuffle(allScenarios.filter((s) => s.category !== scenario.category && s.id !== scenario.id));

  const distractors: string[] = [];
  for (const s of [...sameArticle, ...sameCategory, ...others]) {
    if (distractors.length >= 3) break;
    if (seen.has(s.response)) continue;
    seen.add(s.response);
    distractors.push(s.response);
  }

  if (distractors.length < 3) return null;
  return shuffle([scenario.response, ...distractors]);
}

/** Weaves up to 3 previously-missed scenarios into the front of the queue so they resurface within the next batch instead of waiting for a full reshuffle lap. */
function drawBatch(
  queue: PracticeScenario[],
  missed: PracticeScenario[],
  filteredPool: PracticeScenario[],
  allScenarios: PracticeScenario[]
): { batch: BatchCard[]; queue: PracticeScenario[]; missed: PracticeScenario[] } {
  let q = queue;
  let m = missed;

  if (m.length > 0) {
    const upNext = new Set(q.slice(0, BATCH_SIZE).map((s) => s.id));
    const resurface = m.filter((s) => !upNext.has(s.id)).slice(0, 3);
    if (resurface.length > 0) {
      const resurfaceIds = new Set(resurface.map((s) => s.id));
      q = [...resurface, ...q];
      m = m.filter((s) => !resurfaceIds.has(s.id));
    }
  }

  // A filtered pool (e.g. a single article) can hold fewer than BATCH_SIZE scenarios — cap the
  // batch so a small pool never duplicates a scenario within the same batch to pad it out.
  const batchSize = Math.min(BATCH_SIZE, filteredPool.length);
  while (q.length < batchSize) {
    const seen = new Set(q.map((s) => s.id));
    q = [...q, ...shuffle(filteredPool).filter((s) => !seen.has(s.id))];
  }

  const batch = q.slice(0, batchSize).map((scenario) => ({
    scenario,
    options: buildOptions(scenario, allScenarios),
  }));

  return { batch, queue: q.slice(batchSize), missed: m };
}

export default function PracticeDeck({ scenarios }: Props) {
  const [filteredPool, setFilteredPool] = useState<PracticeScenario[] | null>(null);
  const [queue, setQueue] = useState<PracticeScenario[]>([]);
  const [missed, setMissed] = useState<PracticeScenario[]>([]);
  const [missedThisBatch, setMissedThisBatch] = useState<PracticeScenario[]>([]);
  const [batch, setBatch] = useState<BatchCard[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [batchDone, setBatchDone] = useState(false);

  if (scenarios.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
        <p className="text-gray-500 dark:text-slate-400">No scenarios available to practice with yet.</p>
      </div>
    );
  }

  if (filteredPool === null) {
    return (
      <PracticeSetup
        scenarios={scenarios}
        onStart={(selectedSlugs) => {
          const pool = scenarios.filter((s) => selectedSlugs.has(s.articleSlug));
          const drawn = drawBatch(shuffle(pool), [], pool, scenarios);
          setFilteredPool(pool);
          setQueue(drawn.queue);
          setMissed(drawn.missed);
          setMissedThisBatch([]);
          setBatch(drawn.batch);
          setIndex(0);
          setSelected(null);
          setCorrectCount(0);
          setBatchDone(false);
        }}
      />
    );
  }

  function nextBatch() {
    const drawn = drawBatch(queue, [...missed, ...missedThisBatch], filteredPool!, scenarios);
    setQueue(drawn.queue);
    setMissed(drawn.missed);
    setMissedThisBatch([]);
    setBatch(drawn.batch);
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setBatchDone(false);
  }

  if (batchDone) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-10 text-center shadow-sm">
        <p className="text-xl font-bold text-gray-900 dark:text-slate-100">
          Nice work — {correctCount}/{batch.length} correct.
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

  const { scenario, options } = batch[index];

  function selectOption(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === scenario.response) {
      setCorrectCount((c) => c + 1);
    } else {
      setMissedThisBatch((m) => [...m, scenario]);
    }
  }

  function next() {
    if (index + 1 >= batch.length) {
      setBatchDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
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

        {options ? (
          <div className="mt-6 space-y-3">
            {options.map((option) => {
              let optionClasses =
                "border-gray-300 dark:border-border-subtle text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted";
              if (selected) {
                const isCorrect = option === scenario.response;
                const isSelected = selected === option;
                if (isCorrect) {
                  optionClasses =
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300";
                } else if (isSelected) {
                  optionClasses = "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300";
                } else {
                  optionClasses = "border-gray-200 dark:border-border-subtle text-gray-400 dark:text-slate-500";
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={!!selected}
                  onClick={() => selectOption(option)}
                  className={`block w-full rounded-xl border px-5 py-3 text-left font-medium transition disabled:cursor-default ${optionClasses}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : selected ? (
          <>
            <hr className="my-6 border-gray-200 dark:border-border-subtle" />
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Response:</p>
            <p className="mt-2 text-gray-700 dark:text-slate-300">{scenario.response}</p>
          </>
        ) : (
          <button
            onClick={() => selectOption(scenario.response)}
            className="mt-6 flex items-center gap-2 rounded-xl border border-gray-300 dark:border-border-subtle px-6 py-3 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
          >
            <Eye size={18} />
            Reveal the correct response
          </button>
        )}

        {selected && (
          <Link
            href={`/Knowledge/${scenario.articleSlug}`}
            className="mt-4 inline-block text-sm font-semibold text-red-700 dark:text-brand hover:underline"
          >
            From: {scenario.articleTitle} →
          </Link>
        )}
      </div>

      <button
        onClick={next}
        disabled={!selected}
        className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next scenario
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
