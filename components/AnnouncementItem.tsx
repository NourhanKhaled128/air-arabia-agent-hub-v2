"use client";

import { useState } from "react";
import { formatRelativeTime } from "@/lib/format";

interface Props {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

export default function AnnouncementItem({ title, content, createdAt }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setExpanded((value) => !value)}
      aria-expanded={expanded}
      className="block w-full rounded-2xl border border-gray-100 p-4 text-left transition hover:bg-red-50"
    >
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-gray-500">{formatRelativeTime(createdAt)}</p>

      {expanded && (
        <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{content}</p>
      )}
    </button>
  );
}
