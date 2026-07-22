"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { submitContentSuggestionAction } from "@/app/actions/content-suggestion";

interface Props {
  articleId: number;
}

export default function SuggestEditButton({ articleId }: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!description.trim()) return;

    startTransition(async () => {
      try {
        await submitContentSuggestionAction({ articleId, description: description.trim() });
        setSubmitted(true);
      } catch (error) {
        console.error(error);
        alert("Could not submit your suggestion.");
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-gray-300 dark:border-border-subtle px-4 py-2.5 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted print:hidden"
      >
        <Pencil size={18} />
        Suggest an edit
      </button>
    );
  }

  return (
    <div className="w-full rounded-xl border border-gray-300 dark:border-border-subtle p-4 print:hidden">
      {submitted ? (
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Thanks — your suggestion has been sent to the content team.
        </p>
      ) : (
        <>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
            What should change in this article?
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. The fee amount here is outdated, it should be..."
            className="w-full rounded-xl border border-gray-300 dark:border-border-subtle bg-transparent p-3 outline-none focus:border-brand"
          />
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              disabled={isPending || !description.trim()}
              onClick={submit}
              className="rounded-xl bg-red-700 px-5 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-gray-300 dark:border-border-subtle px-5 py-2 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
