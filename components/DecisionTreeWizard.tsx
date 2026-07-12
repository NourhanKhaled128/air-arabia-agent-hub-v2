"use client";

import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import CopyButton from "./CopyButton";

interface Option {
  id: number;
  label: string;
  targetNodeId: number | null;
}

interface Node {
  id: number;
  type: string;
  text: string;
  options: Option[];
}

interface Props {
  nodes: Node[];
}

export default function DecisionTreeWizard({ nodes }: Props) {
  const rootId = nodes[0]?.id ?? null;
  const [currentId, setCurrentId] = useState<number | null>(rootId);
  const [history, setHistory] = useState<number[]>([]);

  const current = nodes.find((n) => n.id === currentId);

  function choose(option: Option) {
    if (currentId === null) return;
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

          <div className="flex flex-wrap gap-3">
            {current.options.map((option) => (
              <button
                key={option.id}
                onClick={() => choose(option)}
                className="rounded-xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface px-5 py-3 font-semibold text-gray-800 dark:text-slate-200 hover:border-red-400 hover:bg-red-50 dark:hover:bg-brand/10"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 p-5">
          <div className="mb-3 flex items-start justify-between gap-4">
            <p className="whitespace-pre-wrap text-gray-800 dark:text-slate-100">{current.text}</p>
            <CopyButton text={current.text} compact />
          </div>
        </div>
      )}
    </div>
  );
}
