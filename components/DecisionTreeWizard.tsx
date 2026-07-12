"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import CopyButton from "./CopyButton";
import ExcessBaggageRateFinder, {
  type ExcessBaggageRateRow,
} from "./excess-baggage/ExcessBaggageRateFinder";

interface Option {
  id: number;
  label: string;
  targetNodeId: number | null;
  targetTree?: { id: number; title: string; slug: string } | null;
}

interface Node {
  id: number;
  type: string;
  text: string;
  image?: string | null;
  options: Option[];
}

interface Props {
  nodes: Node[];
  excessBaggageHub?: string;
  excessBaggageRates?: ExcessBaggageRateRow[];
}

export default function DecisionTreeWizard({ nodes, excessBaggageHub, excessBaggageRates }: Props) {
  const router = useRouter();
  const rootId = nodes[0]?.id ?? null;
  const [currentId, setCurrentId] = useState<number | null>(rootId);
  const [history, setHistory] = useState<number[]>([]);

  const current = nodes.find((n) => n.id === currentId);

  function choose(option: Option) {
    if (currentId === null) return;

    if (option.targetNodeId === null && option.targetTree) {
      router.push(`/decision-trees/${option.targetTree.slug}`);
      return;
    }

    setHistory((prev) => [...prev, currentId]);
    setCurrentId(option.targetNodeId);
  }

  function goBack() {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop()!;
      setCurrentId(last);
      return next;
    });
  }

  function startOver() {
    setHistory([]);
    setCurrentId(rootId);
  }

  if (!current) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-border-subtle p-6 text-center text-gray-500 dark:text-slate-400">
        This path doesn&apos;t lead anywhere yet — the tree may still be a work in progress.
        <div className="mt-4">
          <button
            onClick={startOver}
            className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 text-white mx-auto"
          >
            <RotateCcw size={16} />
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-border-subtle p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
          {current.type === "outcome" ? "Resolution" : `Step ${history.length + 1}`}
        </span>

        <div className="flex gap-2">
          {history.length > 0 && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-border-subtle px-3 py-1.5 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}

          {(history.length > 0 || current.type === "outcome") && (
            <button
              onClick={startOver}
              className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-border-subtle px-3 py-1.5 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
            >
              <RotateCcw size={14} />
              Start Over
            </button>
          )}
        </div>
      </div>

      {current.type === "question" ? (
        <>
          <h3 className="mb-5 text-xl font-semibold text-gray-900 dark:text-slate-100">
            {current.text}
          </h3>

          {current.image && (
            <div className="mb-5 overflow-hidden rounded-xl border border-gray-200 dark:border-border-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.image} alt="" className="w-full object-contain" />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {current.options.map((option) => (
              <button
                key={option.id}
                onClick={() => choose(option)}
                className="rounded-xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface px-5 py-3 font-semibold text-gray-800 dark:text-slate-200 hover:border-red-400 hover:bg-red-50 dark:hover:bg-brand/10"
              >
                {option.label}
                {option.targetNodeId === null && option.targetTree ? " →" : ""}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 p-5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <p className="whitespace-pre-wrap text-gray-800 dark:text-slate-100">{current.text}</p>
              <CopyButton text={current.text} compact />
            </div>
          </div>

          {current.image && (
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-border-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.image} alt="" className="w-full object-contain" />
            </div>
          )}

          {excessBaggageHub && excessBaggageRates && (
            <div className="rounded-xl border border-gray-200 dark:border-border-subtle p-5">
              <p className="mb-3 text-sm font-semibold text-gray-600 dark:text-slate-300">
                Need the exact figure? Search the live {excessBaggageHub} rate table:
              </p>
              <ExcessBaggageRateFinder rates={excessBaggageRates} defaultHub={excessBaggageHub} compact />
            </div>
          )}

          {current.options.filter((o) => o.targetTree).length > 0 && (
            <div className="flex flex-wrap gap-3">
              {current.options
                .filter((o) => o.targetTree)
                .map((option) => (
                  <button
                    key={option.id}
                    onClick={() => choose(option)}
                    className="rounded-xl border border-red-200 dark:border-brand/30 bg-red-50 dark:bg-brand/10 px-5 py-3 font-semibold text-red-700 dark:text-brand hover:bg-red-100 dark:hover:bg-brand/20"
                  >
                    {option.label || `Continue to: ${option.targetTree!.title}`} →
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
