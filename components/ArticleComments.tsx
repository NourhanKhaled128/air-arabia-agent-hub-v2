"use client";

import { useState, useTransition } from "react";
import { submitCommentAction } from "@/app/actions/comment";

interface Comment {
  id: number;
  authorName: string;
  content: string;
  createdAt: Date;
}

interface Props {
  articleId: number;
  slug: string;
  comments: Comment[];
}

export default function ArticleComments({ articleId, slug, comments }: Props) {
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        await submitCommentAction({ articleId, slug, authorName, content });
        setContent("");
        setSubmitted(true);
      } catch (error) {
        console.error(error);
        alert("Could not submit your note.");
      }
    });
  }

  return (
    <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">
      <h2 className="mb-4 text-3xl font-bold">Notes from other agents</h2>

      {comments.length > 0 ? (
        <ul className="mb-6 space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-gray-200 dark:border-border-subtle p-4"
            >
              <p className="text-gray-700 dark:text-slate-300">{c.content}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                {c.authorName} · {c.createdAt.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-6 text-gray-500 dark:text-slate-400">
          No notes yet. Be the first to add one for other agents.
        </p>
      )}

      {submitted ? (
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Thanks — your note is pending admin approval before it appears here.
        </p>
      ) : (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note or tip for other agents..."
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
              disabled={isPending || !content.trim()}
              onClick={submit}
              className="rounded-xl bg-red-700 px-6 py-2 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
            >
              Post note
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
