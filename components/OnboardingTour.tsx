"use client";

import { useState } from "react";
import { Search, LayoutList, ClipboardCheck, User, X } from "lucide-react";
import { markOnboardingSeenAction } from "@/app/actions/portal-auth";

interface Props {
  hasSeenOnboarding: boolean;
}

const STEPS = [
  {
    icon: Search,
    title: "Search anything",
    body: "Press ⌘K (or click the search bar) to find articles, decision trees, glossary terms, or quick-reference facts — use the tabs above the search box to pick where to search.",
  },
  {
    icon: LayoutList,
    title: "Browse by category",
    body: "The sidebar groups everything by hub and topic. Bookmark anything you'll want to find again from the article page.",
  },
  {
    icon: ClipboardCheck,
    title: "Take your quizzes",
    body: "The Quizzes section shows what's assigned to you and tracks your history automatically.",
  },
  {
    icon: User,
    title: "Your account",
    body: "Click your name any time to see your team, quiz stats, bookmarks, and activity in one place.",
  },
];

export default function OnboardingTour({ hasSeenOnboarding }: Props) {
  const [dismissed, setDismissed] = useState(hasSeenOnboarding);
  const [step, setStep] = useState(0);

  if (dismissed) return null;

  function dismiss() {
    setDismissed(true);
    markOnboardingSeenAction().catch(() => {});
  }

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-surface p-8 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-brand">
            <Icon size={24} />
          </div>
          <button
            onClick={dismiss}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-muted"
            title="Skip"
          >
            <X size={18} />
          </button>
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-slate-100">{current.title}</h2>
        <p className="mt-2 text-gray-600 dark:text-slate-400">{current.body}</p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full ${i === step ? "bg-red-700" : "bg-gray-200 dark:bg-surface-muted"}`}
              />
            ))}
          </div>

          <button
            onClick={() => (isLast ? dismiss() : setStep((s) => s + 1))}
            className="rounded-xl bg-red-700 px-6 py-2.5 font-semibold text-white hover:bg-red-800"
          >
            {isLast ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
