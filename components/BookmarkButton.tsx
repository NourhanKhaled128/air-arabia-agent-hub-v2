"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmarkAction } from "@/app/actions/article";

interface Props {
  articleId: number;
  initialBookmarked: boolean;
}

export default function BookmarkButton({ articleId, initialBookmarked }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      try {
        const next = await toggleBookmarkAction(articleId);
        setBookmarked(next);
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      title={bookmarked ? "Remove bookmark" : "Bookmark this article"}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-semibold transition disabled:opacity-50 print:hidden ${
        bookmarked
          ? "border-red-600 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300"
          : "border-gray-300 dark:border-border-subtle text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted"
      }`}
    >
      <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
